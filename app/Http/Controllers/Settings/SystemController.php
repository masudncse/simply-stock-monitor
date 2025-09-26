<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemController extends Controller
{
    public function index()
    {
        $settings = [
            'currency' => SystemSetting::get('currency', 'USD'),
            'timezone' => SystemSetting::get('timezone', 'UTC'),
            'date_format' => SystemSetting::get('date_format', 'Y-m-d'),
            'time_format' => SystemSetting::get('time_format', 'H:i'),
            'low_stock_threshold' => SystemSetting::get('low_stock_threshold', '10'),
            'auto_backup' => SystemSetting::get('auto_backup', 'false'),
            'backup_frequency' => SystemSetting::get('backup_frequency', 'daily'),
        ];

        return Inertia::render('Settings/System', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'currency' => 'required|string|max:3',
            'timezone' => 'required|string|max:50',
            'date_format' => 'required|string|max:20',
            'time_format' => 'required|string|max:10',
            'low_stock_threshold' => 'required|integer|min:0',
            'auto_backup' => 'boolean',
            'backup_frequency' => 'required|string|in:daily,weekly,monthly',
        ]);

        try {
            foreach ($request->validated() as $key => $value) {
                SystemSetting::set($key, $value, 'string', "System setting for {$key}");
            }
            
            return back()->with('success', 'System settings updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update system settings: ' . $e->getMessage());
        }
    }
}
