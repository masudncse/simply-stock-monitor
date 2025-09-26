<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $settings = CompanySetting::getSettings();
        
        return Inertia::render('Settings/Company', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_id' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
        ]);

        try {
            \Log::info('Company settings update request:', $request->all());
            
            $settings = CompanySetting::updateSettings($request->validated());
            
            \Log::info('Company settings saved:', $settings->toArray());
            
            return back()->with('success', 'Company settings updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Company settings update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Failed to update company settings: ' . $e->getMessage());
        }
    }
}
