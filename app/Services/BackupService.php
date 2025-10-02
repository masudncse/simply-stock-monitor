<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Process;
use Carbon\Carbon;
use Exception;

class BackupService
{
    protected $backupDisk = 'backups';
    protected $backupPath = 'database';
    protected $mysqlPath = '';
    protected $mysqldumpPath = '';

    public function __construct()
    {
        // Ensure backup disk exists
        if (!Storage::disk($this->backupDisk)->exists($this->backupPath)) {
            Storage::disk($this->backupDisk)->makeDirectory($this->backupPath);
        }

        // Set MySQL executable paths for Laragon
        $this->setMysqlPaths();
    }

    /**
     * Set MySQL executable paths
     */
    protected function setMysqlPaths(): void
    {
        // Try to detect MySQL executables using system commands
        $this->mysqlPath = $this->detectMysqlPath();
        $this->mysqldumpPath = $this->detectMysqldumpPath();

        // Fallback to system PATH if not found
        if (empty($this->mysqlPath)) {
            $this->mysqlPath = 'mysql';
        }
        if (empty($this->mysqldumpPath)) {
            $this->mysqldumpPath = 'mysqldump';
        }
    }

    /**
     * Detect MySQL executable path
     */
    protected function detectMysqlPath(): string
    {
        // Try to get the actual executable path from system
        $path = trim(shell_exec('where mysql 2>nul'));
        
        if (!empty($path) && !str_contains($path, 'not found') && !str_contains($path, 'not recognized')) {
            // where command might return multiple paths, take the first one
            $paths = explode("\n", $path);
            $firstPath = trim($paths[0]);
            if (file_exists($firstPath)) {
                return $firstPath;
            }
        }

        return '';
    }

    /**
     * Detect mysqldump executable path
     */
    protected function detectMysqldumpPath(): string
    {
        // Try to get the actual executable path from system
        $path = trim(shell_exec('where mysqldump 2>nul'));
        
        if (!empty($path) && !str_contains($path, 'not found') && !str_contains($path, 'not recognized')) {
            // where command might return multiple paths, take the first one
            $paths = explode("\n", $path);
            $firstPath = trim($paths[0]);
            if (file_exists($firstPath)) {
                return $firstPath;
            }
        }

        return '';
    }

    /**
     * Test database connection before attempting backup
     */
    protected function testDatabaseConnection(): void
    {
        try {
            // Test basic database connection
            DB::connection()->getPdo();
            
            // Test if MySQL service is running by trying a simple query
            DB::select('SELECT 1 as test');
            
        } catch (\Exception $e) {
            throw new Exception("Database connection failed. Please ensure MySQL is running and accessible. Error: " . $e->getMessage());
        }
    }

    /**
     * Create a database backup
     */
    public function createDatabaseBackup(bool $compress = false): ?string
    {
        try {
            // Test database connection first
            $this->testDatabaseConnection();

            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $filename = "backup_{$timestamp}.sql";
            $filepath = "{$this->backupPath}/{$filename}";

            // Get database configuration
            $connection = config('database.default');
            $config = config("database.connections.{$connection}");

            // Create mysqldump command
            $command = $this->buildMysqldumpCommand($config, $filepath);

            // Log the command being executed (without password for security)
            $safeCommand = str_replace($config['password'], '***', $command);
            \Log::info("Executing backup command: {$safeCommand}");

            // Execute backup command with retry mechanism
            $result = null;
            $maxRetries = 3;
            $retryDelay = 2; // seconds

            for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
                \Log::info("Backup attempt {$attempt}/{$maxRetries}");
                
                $result = Process::run($command);
                
                if ($result->successful()) {
                    \Log::info("Backup command succeeded on attempt {$attempt}");
                    break;
                }
                
                if ($attempt < $maxRetries) {
                    \Log::warning("Backup attempt {$attempt} failed, retrying in {$retryDelay} seconds. Error: " . $result->errorOutput());
                    sleep($retryDelay);
                }
            }

            if ($result && $result->failed()) {
                // Clean up empty file if command failed
                if (Storage::disk($this->backupDisk)->exists($filepath)) {
                    Storage::disk($this->backupDisk)->delete($filepath);
                }
                $errorMsg = "Backup command failed after {$maxRetries} attempts. Exit code: {$result->exitCode()}. Error: " . $result->errorOutput();
                \Log::error($errorMsg);
                throw new Exception($errorMsg);
            }

            // Verify backup file was created and has content
            if (!Storage::disk($this->backupDisk)->exists($filepath)) {
                throw new Exception("Backup file was not created");
            }

            $fileSize = Storage::disk($this->backupDisk)->size($filepath);
            if ($fileSize === 0) {
                // Clean up empty file
                Storage::disk($this->backupDisk)->delete($filepath);
                throw new Exception("Backup file is empty - mysqldump may have failed silently");
            }

            // Compress if requested
            if ($compress) {
                $filepath = $this->compressBackup($filepath);
            }

            // Log backup creation
            \Log::info("Database backup created: {$filepath} ({$fileSize} bytes)");

            return $filepath;
        } catch (Exception $e) {
            \Log::error("Backup creation failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Build mysqldump command
     */
    protected function buildMysqldumpCommand(array $config, string $filepath): string
    {
        $host = $config['host'];
        $port = $config['port'] ?? 3306;
        $username = $config['username'];
        $password = $config['password'];
        $database = $config['database'];

        $fullPath = Storage::disk($this->backupDisk)->path($filepath);

        // For local connections, try socket first, then TCP/IP
        if ($host === '127.0.0.1' || $host === 'localhost') {
            // Try socket connection first (more reliable for local MySQL)
            $command = sprintf(
                '%s --user=%s --password=%s --single-transaction --routines --triggers %s > %s',
                escapeshellarg($this->mysqldumpPath),
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($database),
                escapeshellarg($fullPath)
            );
        } else {
            // Use TCP/IP for remote connections
            $command = sprintf(
                '%s --host=%s --port=%s --user=%s --password=%s --single-transaction --routines --triggers %s > %s',
                escapeshellarg($this->mysqldumpPath),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($database),
                escapeshellarg($fullPath)
            );
        }

        return $command;
    }

    /**
     * Compress backup file
     */
    protected function compressBackup(string $filepath): string
    {
        $fullPath = Storage::disk($this->backupDisk)->path($filepath);
        $compressedPath = $filepath . '.gz';
        $compressedFullPath = Storage::disk($this->backupDisk)->path($compressedPath);

        // Use PHP's built-in gzip compression for Windows compatibility
        $input = fopen($fullPath, 'rb');
        if (!$input) {
            throw new Exception("Cannot open file for compression: {$fullPath}");
        }

        $output = gzopen($compressedFullPath, 'wb9'); // wb9 = write binary, compression level 9
        if (!$output) {
            fclose($input);
            throw new Exception("Cannot create compressed file: {$compressedFullPath}");
        }

        while (!feof($input)) {
            $data = fread($input, 8192);
            if ($data !== false) {
                gzwrite($output, $data);
            }
        }

        fclose($input);
        gzclose($output);

        // Delete original uncompressed file
        Storage::disk($this->backupDisk)->delete($filepath);

        return $compressedPath;
    }

    /**
     * Get list of available backups
     */
    public function getAvailableBackups(): array
    {
        $backups = [];
        $files = Storage::disk($this->backupDisk)->files($this->backupPath);

        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'filepath' => $file,
                'size' => Storage::disk($this->backupDisk)->size($file),
                'created_at' => Carbon::createFromTimestamp(Storage::disk($this->backupDisk)->lastModified($file)),
                'is_compressed' => str_ends_with($file, '.gz'),
            ];
        }

        // Sort by creation date (newest first)
        usort($backups, function ($a, $b) {
            return $b['created_at']->timestamp - $a['created_at']->timestamp;
        });

        return $backups;
    }

    /**
     * Download backup file
     */
    public function downloadBackup(string $filepath): ?string
    {
        if (!Storage::disk($this->backupDisk)->exists($filepath)) {
            return null;
        }

        return Storage::disk($this->backupDisk)->path($filepath);
    }

    /**
     * Restore database from backup
     */
    public function restoreDatabase(string $filepath): bool
    {
        try {
            if (!Storage::disk($this->backupDisk)->exists($filepath)) {
                throw new Exception("Backup file not found: {$filepath}");
            }

            $connection = config('database.default');
            $config = config("database.connections.{$connection}");
            
            $fullPath = Storage::disk($this->backupDisk)->path($filepath);
            
            // Handle compressed files
            if (str_ends_with($filepath, '.gz')) {
                $tempFile = tempnam(sys_get_temp_dir(), 'restore_') . '.sql';
                
                // Use PHP's built-in gzip decompression for Windows compatibility
                $handle = gzopen($fullPath, 'rb');
                if (!$handle) {
                    throw new Exception("Cannot open compressed file: {$fullPath}");
                }
                
                $output = fopen($tempFile, 'wb');
                if (!$output) {
                    gzclose($handle);
                    throw new Exception("Cannot create temporary file: {$tempFile}");
                }
                
                while (!gzeof($handle)) {
                    $data = gzread($handle, 8192);
                    if ($data === false) {
                        break;
                    }
                    fwrite($output, $data);
                }
                
                gzclose($handle);
                fclose($output);
                
                $fullPath = $tempFile;
            }

            // Build mysql command
            if ($config['host'] === '127.0.0.1' || $config['host'] === 'localhost') {
                // Use socket connection for local MySQL
                $command = sprintf(
                    '%s --user=%s --password=%s %s < %s',
                    escapeshellarg($this->mysqlPath),
                    escapeshellarg($config['username']),
                    escapeshellarg($config['password']),
                    escapeshellarg($config['database']),
                    escapeshellarg($fullPath)
                );
            } else {
                // Use TCP/IP for remote connections
                $command = sprintf(
                    '%s --host=%s --port=%s --user=%s --password=%s %s < %s',
                    escapeshellarg($this->mysqlPath),
                    escapeshellarg($config['host']),
                    escapeshellarg($config['port'] ?? 3306),
                    escapeshellarg($config['username']),
                    escapeshellarg($config['password']),
                    escapeshellarg($config['database']),
                    escapeshellarg($fullPath)
                );
            }

            $result = Process::run($command);
            
            if ($result->failed()) {
                throw new Exception("Restore command failed: " . $result->errorOutput());
            }

            \Log::info("Database restored from backup: {$filepath}");
            return true;
        } catch (Exception $e) {
            \Log::error("Database restore failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete backup file
     */
    public function deleteBackup(string $filepath): bool
    {
        try {
            if (Storage::disk($this->backupDisk)->exists($filepath)) {
                Storage::disk($this->backupDisk)->delete($filepath);
                \Log::info("Backup deleted: {$filepath}");
                return true;
            }
            return false;
        } catch (Exception $e) {
            \Log::error("Failed to delete backup: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get backup disk configuration
     */
    public function getBackupDiskConfig(): array
    {
        return [
            'disk' => $this->backupDisk,
            'path' => $this->backupPath,
            'total_size' => $this->getTotalBackupSize(),
            'backup_count' => count($this->getAvailableBackups()),
            'mysql_path' => $this->mysqlPath,
            'mysqldump_path' => $this->mysqldumpPath,
        ];
    }

    /**
     * Calculate total backup size
     */
    protected function getTotalBackupSize(): int
    {
        $total = 0;
        $files = Storage::disk($this->backupDisk)->files($this->backupPath);
        
        foreach ($files as $file) {
            $total += Storage::disk($this->backupDisk)->size($file);
        }
        
        return $total;
    }
}
