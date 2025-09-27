<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    public function index(Request $request)
    {
        // Get theme from cookie first, then fallback to system setting
        $theme = $request->cookie('appearance') ?? SystemSetting::get('theme', 'system');
        $primaryColor = $request->cookie('primaryColor') ?? SystemSetting::get('primary_color', 'blue');
        
        $settings = [
            'theme' => $theme,
            'primary_color' => $primaryColor,
            'sidebar_collapsed' => SystemSetting::get('sidebar_collapsed', false),
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
        try {
            $validated = $request->validate([
                'theme' => 'required|string|in:light,dark,system',
                'primary_color' => 'required|string|in:blue,green,purple,red,orange,pink,indigo,teal,cyan,emerald,lime,amber,violet,rose,slate',
                'sidebar_collapsed' => 'boolean',
                'language' => 'required|string|max:10',
                'date_format' => 'required|string|max:20',
                'time_format' => 'required|string|max:20',
                'currency' => 'required|string|max:3',
                'timezone' => 'required|string|max:50',
            ]);

            foreach ($validated as $key => $value) {
                SystemSetting::set($key, $value, 'string', "Appearance setting for {$key}");
            }
            
            // Set the appearance and primary color cookies for immediate frontend sync
            $response = back()->with('success', 'Appearance settings updated successfully.');
            if (isset($validated['theme'])) {
                $response->withCookie(cookie('appearance', $validated['theme'], 365 * 24 * 60));
            }
            if (isset($validated['primary_color'])) {
                $response->withCookie(cookie('primaryColor', $validated['primary_color'], 365 * 24 * 60));
            }
            
            return $response;
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update appearance settings: ' . $e->getMessage());
        }
    }
}