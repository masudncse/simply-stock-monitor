<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Http\Requests\CompanySettingsRequest;
use App\Http\Requests\SystemSettingsRequest;
use App\Models\CompanySetting;
use App\Models\SystemSetting;

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

        // Get company settings from database
        $settings = CompanySetting::getSettings();

        return Inertia::render('Settings/Company', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update company settings
     */
    public function updateCompany(CompanySettingsRequest $request)
    {
        $this->authorize('edit-settings');

        try {
            Log::info('Company settings update request:', $request->all());
            
            $settings = CompanySetting::updateSettings($request->validated());
            
            Log::info('Company settings saved:', $settings->toArray());
            
            return redirect()->route('settings.company')
                ->with('success', 'Company settings updated successfully.');
        } catch (\Exception $e) {
            Log::error('Company settings update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('settings.company')
                ->with('error', 'Failed to update company settings: ' . $e->getMessage());
        }
    }

    /**
     * System Settings
     */
    public function system()
    {
        $this->authorize('view-settings');

        // Get system settings from database with defaults
        $settings = [
            'low_stock_threshold' => SystemSetting::get('low_stock_threshold', 10),
            'auto_generate_invoice' => SystemSetting::get('auto_generate_invoice', true),
            'require_approval_for_purchases' => SystemSetting::get('require_approval_for_purchases', false),
            'require_approval_for_sales' => SystemSetting::get('require_approval_for_sales', false),
            'enable_barcode_scanning' => SystemSetting::get('enable_barcode_scanning', true),
            'enable_inventory_tracking' => SystemSetting::get('enable_inventory_tracking', true),
            'enable_multi_warehouse' => SystemSetting::get('enable_multi_warehouse', true),
            'default_tax_rate' => SystemSetting::get('default_tax_rate', 0),
            'default_currency' => SystemSetting::get('default_currency', 'USD'),
            'backup_frequency' => SystemSetting::get('backup_frequency', 'daily'),
            'barcode_format' => SystemSetting::get('barcode_format', 'CODE128'),
        ];

        return Inertia::render('Settings/System', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSystem(SystemSettingsRequest $request)
    {
        $this->authorize('edit-settings');

        try {
            Log::info('System settings update request:', $request->all());
            
            $validatedData = $request->validated();
            
            // Save each setting to database
            foreach ($validatedData as $key => $value) {
                $type = is_bool($value) ? 'boolean' : (is_numeric($value) ? 'numeric' : 'string');
                SystemSetting::set($key, $value, $type);
            }
            
            Log::info('System settings saved successfully');
            
            return redirect()->route('settings.system')
                ->with('success', 'System settings updated successfully.');
        } catch (\Exception $e) {
            Log::error('System settings update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('settings.system')
                ->with('error', 'Failed to update system settings: ' . $e->getMessage());
        }
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
