<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    public function index()
    {
        $settings = [
            'theme' => SystemSetting::get('theme', 'system'),
            'sidebar_collapsed' => SystemSetting::get('sidebar_collapsed', 'false'),
            'language' => SystemSetting::get('language', 'en'),
            'date_format' => SystemSetting::get('date_format', 'Y-m-d'),
            'time_format' => SystemSetting::get('time_format', 'H:i:s'),
            'currency' => SystemSetting::get('currency', 'USD'),
            'timezone' => SystemSetting::get('timezone', 'UTC'),
        ];

        return Inertia::render('Settings/Appearance', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:light,dark,system',
            'sidebar_collapsed' => 'boolean',
            'language' => 'required|string|max:10',
            'date_format' => 'required|string|max:20',
            'time_format' => 'required|string|max:20',
            'currency' => 'required|string|max:3',
            'timezone' => 'required|string|max:50',
        ]);

        try {
            foreach ($request->validated() as $key => $value) {
                SystemSetting::set($key, $value, 'string', "Appearance setting for {$key}");
            }
            
            return back()->with('success', 'Appearance settings updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update appearance settings: ' . $e->getMessage());
        }
    }
}