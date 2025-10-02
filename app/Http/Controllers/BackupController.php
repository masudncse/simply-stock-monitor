<?php

namespace App\Http\Controllers;

use App\Services\BackupService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    use AuthorizesRequests;
    
    protected $backupService;

    public function __construct(BackupService $backupService)
    {
        $this->backupService = $backupService;
    }

    /**
     * Display the backup management page
     */
    public function index()
    {
        $this->authorize('view-settings');

        $backups = $this->backupService->getAvailableBackups();
        $diskConfig = $this->backupService->getBackupDiskConfig();

        return Inertia::render('Settings/Backup', [
            'backups' => $backups,
            'diskConfig' => $diskConfig,
        ]);
    }

    /**
     * Create a new backup
     */
    public function create(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'compress' => 'boolean',
        ]);

        $compress = $request->boolean('compress', false);
        
        try {
            // Use Artisan command to create backup
            $exitCode = Artisan::call('db:backup', [
                '--compress' => $compress
            ]);

            if ($exitCode === 0) {
                $output = Artisan::output();
                return redirect()->back()->with('success', 'Backup created successfully!');
            } else {
                return redirect()->back()->with('error', 'Failed to create backup.');
            }
        } catch (\Exception $e) {
            \Log::error("Backup creation failed via Artisan command: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    /**
     * Download a backup file
     */
    public function download(string $filename)
    {
        $this->authorize('view-settings');

        $filepath = "database/{$filename}";
        $downloadPath = $this->backupService->downloadBackup($filepath);

        if (!$downloadPath) {
            abort(404, 'Backup file not found');
        }

        return response()->download($downloadPath, $filename);
    }

    /**
     * Restore database from backup
     */
    public function restore(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'filename' => 'required|string',
        ]);

        $filepath = "database/{$request->filename}";
        $success = $this->backupService->restoreDatabase($filepath);

        if ($success) {
            return redirect()->back()->with('success', 'Database restored successfully!');
        } else {
            return redirect()->back()->with('error', 'Failed to restore database.');
        }
    }

    /**
     * Delete a backup file
     */
    public function destroy(string $filename)
    {
        $this->authorize('edit-settings');

        $filepath = "database/{$filename}";
        $success = $this->backupService->deleteBackup($filepath);

        if ($success) {
            return redirect()->back()->with('success', 'Backup deleted successfully!');
        } else {
            return redirect()->back()->with('error', 'Failed to delete backup.');
        }
    }

}
