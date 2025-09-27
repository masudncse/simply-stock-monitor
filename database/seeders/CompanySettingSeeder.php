<?php

namespace Database\Seeders;

use App\Models\CompanySetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating company settings...');

        if (!CompanySetting::exists()) {
            CompanySetting::create([
                'name' => 'Sample Company Ltd',
                'email' => 'info@samplecompany.com',
                'phone' => '+1-555-0123',
                'address' => '123 Business Street',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '12345',
                'country' => 'USA',
                'tax_id' => 'TAX123456789',
                'website' => 'https://samplecompany.com',
                'logo' => null,
            ]);
        }
        
        $this->command->info('Company settings created successfully!');
    }
}
