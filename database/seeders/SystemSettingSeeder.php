<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating system settings...');

        $systemSettings = [
            'theme' => 'system',
            'primary_color' => 'blue',
            'sidebar_collapsed' => false,
            'language' => 'en',
            'date_format' => 'Y-m-d',
            'time_format' => 'H:i:s',
            'currency' => 'USD',
            'timezone' => 'UTC',
            'low_stock_threshold' => 10,
            'auto_generate_invoice' => true,
            'require_approval_for_purchases' => false,
            'require_approval_for_sales' => false,
            'enable_barcode_scanning' => true,
            'enable_inventory_tracking' => true,
            'enable_multi_warehouse' => true,
            'default_tax_rate' => 10,
            'default_currency' => 'USD',
            'backup_frequency' => 'daily',
        ];

        foreach ($systemSettings as $key => $value) {
            if (!SystemSetting::where('key', $key)->exists()) {
                SystemSetting::set($key, $value, 'string', "System setting for {$key}");
            }
        }
        
        $this->command->info('System settings created successfully!');
    }
}
