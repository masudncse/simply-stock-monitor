<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanySettingsRequest;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

    public function update(CompanySettingsRequest $request)
    {
        try {
            Log::info('Company settings update request:', $request->all());

            $settings = CompanySetting::updateSettings($request->validated());
            
            Log::info('Company settings saved:', $settings->toArray());
            
            return back()->with('success', 'Company settings updated successfully.');
        } catch (\Exception $e) {
            Log::error('Company settings update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Failed to update company settings: ' . $e->getMessage());
        }
    }
}
