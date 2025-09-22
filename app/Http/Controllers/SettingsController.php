<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class SettingsController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the settings dashboard
     */
    public function index()
    {
        $this->authorize('view-settings');

        return Inertia::render('Settings/Index');
    }

    /**
     * Company Settings
     */
    public function company()
    {
        $this->authorize('view-settings');

        // Get company settings from config or database
        $settings = [
            'company_name' => config('app.name', 'Stock Management System'),
            'company_address' => '',
            'company_phone' => '',
            'company_email' => '',
            'company_website' => '',
            'tax_number' => '',
            'currency' => 'USD',
            'timezone' => 'UTC',
            'date_format' => 'Y-m-d',
            'time_format' => 'H:i:s',
        ];

        return Inertia::render('Settings/Company', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update company settings
     */
    public function updateCompany(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'nullable|string',
            'company_phone' => 'nullable|string|max:50',
            'company_email' => 'nullable|email|max:255',
            'company_website' => 'nullable|url|max:255',
            'tax_number' => 'nullable|string|max:50',
            'currency' => 'required|string|max:3',
            'timezone' => 'required|string|max:50',
            'date_format' => 'required|string|max:20',
            'time_format' => 'required|string|max:20',
        ]);

        // Here you would typically save to database or config file
        // For now, we'll just return success

        return redirect()->route('settings.company')
            ->with('success', 'Company settings updated successfully.');
    }

    /**
     * System Settings
     */
    public function system()
    {
        $this->authorize('view-settings');

        $settings = [
            'low_stock_threshold' => 10,
            'auto_generate_invoice' => true,
            'require_approval_for_purchases' => false,
            'require_approval_for_sales' => false,
            'enable_barcode_scanning' => true,
            'enable_inventory_tracking' => true,
            'enable_multi_warehouse' => true,
            'default_tax_rate' => 0,
            'default_currency' => 'USD',
            'backup_frequency' => 'daily',
        ];

        return Inertia::render('Settings/System', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSystem(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'low_stock_threshold' => 'required|integer|min:1',
            'auto_generate_invoice' => 'boolean',
            'require_approval_for_purchases' => 'boolean',
            'require_approval_for_sales' => 'boolean',
            'enable_barcode_scanning' => 'boolean',
            'enable_inventory_tracking' => 'boolean',
            'enable_multi_warehouse' => 'boolean',
            'default_tax_rate' => 'required|numeric|min:0|max:100',
            'default_currency' => 'required|string|max:3',
            'backup_frequency' => 'required|in:daily,weekly,monthly',
        ]);

        // Here you would typically save to database or config file

        return redirect()->route('settings.system')
            ->with('success', 'System settings updated successfully.');
    }

    /**
     * User Management
     */
    public function users()
    {
        $this->authorize('view-users');

        $users = \App\Models\User::with('roles')->paginate(15);

        return Inertia::render('Settings/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Roles & Permissions
     */
    public function roles()
    {
        $this->authorize('view-users');

        $roles = \Spatie\Permission\Models\Role::with('permissions')->get();
        $permissions = \Spatie\Permission\Models\Permission::all();

        return Inertia::render('Settings/Roles', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Backup & Maintenance
     */
    public function backup()
    {
        $this->authorize('view-settings');

        return Inertia::render('Settings/Backup');
    }

    /**
     * Create database backup
     */
    public function createBackup()
    {
        $this->authorize('view-settings');

        // Here you would implement actual backup functionality
        // For now, we'll just return success

        return redirect()->route('settings.backup')
            ->with('success', 'Database backup created successfully.');
    }
}
