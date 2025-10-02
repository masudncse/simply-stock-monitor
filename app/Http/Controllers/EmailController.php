<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Mail\TestEmail;

class EmailController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display email configuration page
     */
    public function index()
    {
        $this->authorize('view-settings');

        $emailSettings = [
            'smtp_host' => SystemSetting::get('smtp_host', ''),
            'smtp_port' => SystemSetting::get('smtp_port', '587'),
            'smtp_username' => SystemSetting::get('smtp_username', ''),
            'smtp_password' => SystemSetting::get('smtp_password', ''),
            'smtp_encryption' => SystemSetting::get('smtp_encryption', 'tls'),
            'smtp_from_address' => SystemSetting::get('smtp_from_address', ''),
            'smtp_from_name' => SystemSetting::get('smtp_from_name', ''),
            'smtp_enabled' => SystemSetting::get('smtp_enabled', false),
        ];

        return Inertia::render('Settings/Email', [
            'emailSettings' => $emailSettings,
        ]);
    }

    /**
     * Update email configuration
     */
    public function update(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|integer|min:1|max:65535',
            'smtp_username' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            'smtp_encryption' => 'nullable|string|in:tls,ssl,none',
            'smtp_from_address' => 'nullable|email|max:255',
            'smtp_from_name' => 'nullable|string|max:255',
            'smtp_enabled' => 'boolean',
        ]);

        // Update system settings
        SystemSetting::set('smtp_host', $request->smtp_host);
        SystemSetting::set('smtp_port', $request->smtp_port);
        SystemSetting::set('smtp_username', $request->smtp_username);
        SystemSetting::set('smtp_password', $request->smtp_password);
        SystemSetting::set('smtp_encryption', $request->smtp_encryption);
        SystemSetting::set('smtp_from_address', $request->smtp_from_address);
        SystemSetting::set('smtp_from_name', $request->smtp_from_name);
        SystemSetting::set('smtp_enabled', $request->smtp_enabled);

        // Clear and cache configuration to apply changes immediately
        $this->refreshMailConfiguration();

        Log::info('Email configuration updated', [
            'smtp_enabled' => $request->smtp_enabled,
            'smtp_host' => $request->smtp_host,
            'smtp_port' => $request->smtp_port,
        ]);

        return redirect()->back()->with('success', 'Email configuration updated successfully!');
    }

    /**
     * Test email configuration (direct send)
     */
    public function testDirect(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'test_email' => 'required|email',
        ]);

        try {
            // Refresh configuration to ensure latest settings are used
            $this->refreshMailConfiguration();
            
            // Send test email directly (config is automatically updated by service provider)
            Mail::to($request->test_email)->send(new TestEmail('Direct Email Test'));

            Log::info("Test email sent directly to: {$request->test_email}");

            return redirect()->back()->with('success', 'Direct test email sent successfully!');

        } catch (\Exception $e) {
            Log::error("Direct test email failed: " . $e->getMessage());

            return redirect()->back()->withErrors(['message' => 'Failed to send test email: ' . $e->getMessage()]);
        }
    }

    /**
     * Test email configuration (queued)
     */
    public function testQueued(Request $request)
    {
        $this->authorize('edit-settings');

        $request->validate([
            'test_email' => 'required|email',
        ]);

        try {
            // Refresh configuration to ensure latest settings are used
            $this->refreshMailConfiguration();
            
            // Send test email via queue (config is automatically updated by service provider)
            Mail::to($request->test_email)->queue(new TestEmail('Queued Email Test'));

            Log::info("Test email queued to: {$request->test_email}");

            return redirect()->back()->with('success', 'Queued test email sent successfully! Check your email in a few moments.');

        } catch (\Exception $e) {
            Log::error("Queued test email failed: " . $e->getMessage());

            return redirect()->back()->withErrors(['message' => 'Failed to queue test email: ' . $e->getMessage()]);
        }
    }

    /**
     * Refresh mail configuration by clearing and caching config
     * 
     * This ensures that changes to email settings take effect immediately
     * by clearing the configuration cache and rebuilding it with the latest
     * database settings from SystemSetting.
     */
    protected function refreshMailConfiguration(): void
    {
        try {
            // Clear configuration cache to remove old settings
            Artisan::call('config:clear');
            
            // Cache configuration for better performance with new settings
            Artisan::call('config:cache');
            
            Log::info('Mail configuration refreshed successfully');
        } catch (\Exception $e) {
            Log::error('Failed to refresh mail configuration: ' . $e->getMessage());
            
            // If caching fails, at least clear the config to ensure changes take effect
            try {
                Artisan::call('config:clear');
                Log::info('Configuration cleared (caching failed)');
            } catch (\Exception $clearException) {
                Log::error('Failed to clear configuration: ' . $clearException->getMessage());
            }
        }
    }

}
