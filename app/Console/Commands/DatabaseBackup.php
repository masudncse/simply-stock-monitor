<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--compress : Compress the backup file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a backup of the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database backup...');

        try {
            $backupService = app(\App\Services\BackupService::class);
            $backupPath = $backupService->createDatabaseBackup($this->option('compress'));

            if ($backupPath) {
                $this->info("Database backup created successfully: {$backupPath}");
                return 0;
            } else {
                $this->error('Failed to create database backup');
                return 1;
            }
        } catch (\Exception $e) {
            $this->error("Backup failed: {$e->getMessage()}");
            return 1;
        }
    }
}