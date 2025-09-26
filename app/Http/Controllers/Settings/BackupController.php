<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function index()
    {
        $backups = collect(Storage::files('backups'))
            ->map(function ($file) {
                return [
                    'name' => basename($file),
                    'size' => Storage::size($file),
                    'created_at' => Storage::lastModified($file),
                ];
            })
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('Settings/Backup', [
            'backups' => $backups
        ]);
    }

    public function create()
    {
        try {
            // Check if backup package is installed
            if (!class_exists(\Spatie\Backup\BackupServiceProvider::class)) {
                return back()->with('error', 'Backup package not installed. Please install spatie/laravel-backup.');
            }

            Artisan::call('backup:run');
            return back()->with('success', 'Backup created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    public function download($filename)
    {
        try {
            $filePath = 'backups/' . $filename;
            
            if (!Storage::exists($filePath)) {
                abort(404, 'Backup file not found.');
            }

            return Storage::download($filePath);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to download backup: ' . $e->getMessage());
        }
    }

    public function destroy($filename)
    {
        try {
            $filePath = 'backups/' . $filename;
            
            if (Storage::exists($filePath)) {
                Storage::delete($filePath);
                return back()->with('success', 'Backup deleted successfully.');
            }

            return back()->with('error', 'Backup not found.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete backup: ' . $e->getMessage());
        }
    }
}
