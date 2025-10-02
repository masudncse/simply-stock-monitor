<?php

namespace App\Providers;

use App\Models\SystemSetting;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class MailConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            // Override mail configuration with database settings if SMTP is enabled
            $smtpEnabled = SystemSetting::get('smtp_enabled', false);
            
            if ($smtpEnabled) {
                $this->overrideMailConfig();
            }
        } catch (\Exception $e) {
            Log::error('Failed to load mail configuration from database: ' . $e->getMessage());
            // Continue with default .env configuration
        }
    }

    /**
     * Override Laravel mail configuration with database settings
     */
    protected function overrideMailConfig(): void
    {
        $smtpHost = SystemSetting::get('smtp_host');
        $smtpPort = SystemSetting::get('smtp_port', 587);
        $smtpUsername = SystemSetting::get('smtp_username');
        $smtpPassword = SystemSetting::get('smtp_password');
        $smtpEncryption = SystemSetting::get('smtp_encryption', 'tls');
        $fromAddress = SystemSetting::get('smtp_from_address');
        $fromName = SystemSetting::get('smtp_from_name');

        // Only override if we have the essential settings
        if ($smtpHost && $smtpUsername) {
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $smtpHost,
                'mail.mailers.smtp.port' => $smtpPort,
                'mail.mailers.smtp.username' => $smtpUsername,
                'mail.mailers.smtp.password' => $smtpPassword,
                'mail.mailers.smtp.encryption' => $smtpEncryption,
                'mail.mailers.smtp.timeout' => 60,
                'mail.mailers.smtp.auth_mode' => null,
            ]);

            // Override from address and name if provided
            if ($fromAddress) {
                config(['mail.from.address' => $fromAddress]);
            }
            if ($fromName) {
                config(['mail.from.name' => $fromName]);
            }
        } else {
            // Only log warning if SMTP is enabled but missing required settings
            Log::warning('SMTP enabled but missing required settings (host or username)');
        }
    }
}
