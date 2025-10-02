<?php

use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\JobManagementController;
use App\Http\Controllers\Settings\CompanyController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\RolesController;
use App\Http\Controllers\Settings\SystemController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\Settings\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Main settings index
    Route::get('settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings.index');

    // Profile settings
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Password settings
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Appearance settings
    Route::get('settings/appearance', [AppearanceController::class, 'index'])->name('appearance.edit');
    Route::post('settings/appearance', [AppearanceController::class, 'update'])->name('appearance.update');

    // Two-factor authentication
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Company settings
    Route::get('settings/company', [CompanyController::class, 'index'])->name('settings.company');
    Route::post('settings/company', [CompanyController::class, 'update'])->name('settings.company.update');

    // System settings
    Route::get('settings/system', [\App\Http\Controllers\SettingsController::class, 'system'])->name('settings.system');
    Route::post('settings/system', [\App\Http\Controllers\SettingsController::class, 'updateSystem'])->name('settings.system.update');

    // User management
    Route::get('settings/users', [UsersController::class, 'index'])->name('settings.users');
    Route::get('settings/users/create', [UsersController::class, 'create'])->name('settings.users.create');
    Route::post('settings/users', [UsersController::class, 'store'])->name('settings.users.store');
    Route::get('settings/users/{user}/edit', [UsersController::class, 'edit'])->name('settings.users.edit');
    Route::put('settings/users/{user}', [UsersController::class, 'update'])->name('settings.users.update');
    Route::delete('settings/users/{user}', [UsersController::class, 'destroy'])->name('settings.users.destroy');

    // Roles and permissions
    Route::get('settings/roles', [RolesController::class, 'index'])->name('settings.roles');
    Route::get('settings/roles/create', [RolesController::class, 'create'])->name('settings.roles.create');
    Route::post('settings/roles', [RolesController::class, 'store'])->name('settings.roles.store');
    Route::get('settings/roles/{role}/edit', [RolesController::class, 'edit'])->name('settings.roles.edit');
    Route::put('settings/roles/{role}', [RolesController::class, 'update'])->name('settings.roles.update');
    Route::delete('settings/roles/{role}', [RolesController::class, 'destroy'])->name('settings.roles.destroy');

    // Email configuration
    Route::get('settings/email', [EmailController::class, 'index'])->name('settings.email');
    Route::post('settings/email', [EmailController::class, 'update'])->name('settings.email.update');
    Route::post('settings/email/test-direct', [EmailController::class, 'testDirect'])->name('settings.email.test.direct');
    Route::post('settings/email/test-queued', [EmailController::class, 'testQueued'])->name('settings.email.test.queued');

    // Backup and maintenance
    Route::get('settings/backup', [BackupController::class, 'index'])->name('settings.backup');
    Route::post('settings/backup', [BackupController::class, 'create'])->name('settings.backup.create');
    Route::get('settings/backup/{filename}/download', [BackupController::class, 'download'])->name('settings.backup.download');
    Route::post('settings/backup/restore', [BackupController::class, 'restore'])->name('settings.backup.restore');
    Route::delete('settings/backup/{filename}', [BackupController::class, 'destroy'])->name('settings.backup.destroy');

    // Job Management
    Route::get('settings/jobs', [JobManagementController::class, 'index'])->name('settings.jobs');
    Route::get('settings/jobs/failed', [JobManagementController::class, 'failed'])->name('settings.jobs.failed');
    Route::delete('settings/jobs/{job}', [JobManagementController::class, 'destroy'])->name('settings.jobs.destroy');
    Route::delete('settings/jobs/failed/{job}', [JobManagementController::class, 'destroyFailed'])->name('settings.jobs.failed.destroy');
    Route::post('settings/jobs/failed/{job}/retry', [JobManagementController::class, 'retry'])->name('settings.jobs.failed.retry');
    Route::post('settings/jobs/failed/retry-all', [JobManagementController::class, 'retryAll'])->name('settings.jobs.failed.retry-all');
    Route::post('settings/jobs/failed/clear', [JobManagementController::class, 'clearFailed'])->name('settings.jobs.failed.clear');
    Route::post('settings/jobs/purge', [JobManagementController::class, 'purgeAll'])->name('settings.jobs.purge');
});
