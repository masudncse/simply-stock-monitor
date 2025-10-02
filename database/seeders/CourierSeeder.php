<?php

namespace Database\Seeders;

use App\Models\Courier;
use Illuminate\Database\Seeder;

class CourierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing couriers (optional - comment out if you want to keep existing data)
        // Courier::truncate();

        // Real courier services in Bangladesh and International
        $couriers = [
            // Local Bangladesh Couriers
            [
                'name' => 'SA Poribahan',
                'branch' => 'Dhaka Central',
                'code' => 'SAP',
                'contact_person' => 'Abdul Karim',
                'phone' => '+880-2-8821177',
                'email' => 'info@saparibahan.com',
                'website' => 'https://www.saparibahan.com',
                'address' => 'Motijheel, Dhaka-1000',
                'coverage_areas' => 'Bangladesh - All major cities and districts',
                'base_rate' => 50.00,
                'per_kg_rate' => 15.00,
                'notes' => 'One of the oldest and most reliable courier services in Bangladesh',
                'is_active' => true,
            ],
            [
                'name' => 'Sundorbon Express',
                'branch' => 'Gulshan Branch',
                'code' => 'SBE',
                'contact_person' => 'Mohammad Hasan',
                'phone' => '+880-1711-111111',
                'email' => 'support@sundorbonexpress.com',
                'website' => 'https://www.sundorbonexpress.com',
                'address' => 'Gulshan-2, Dhaka',
                'coverage_areas' => 'Bangladesh - Nationwide coverage',
                'base_rate' => 60.00,
                'per_kg_rate' => 18.00,
                'notes' => 'Fast and reliable service across Bangladesh',
                'is_active' => true,
            ],
            [
                'name' => 'Janani',
                'branch' => 'Dhanmondi',
                'code' => 'JAN',
                'contact_person' => 'Fatema Begum',
                'phone' => '+880-1722-222222',
                'email' => 'contact@janani.com.bd',
                'website' => 'https://www.janani.com.bd',
                'address' => 'Dhanmondi, Dhaka',
                'coverage_areas' => 'Bangladesh - Major districts and cities',
                'base_rate' => 45.00,
                'per_kg_rate' => 12.00,
                'notes' => 'Affordable courier service with good coverage',
                'is_active' => true,
            ],
            [
                'name' => 'Pathao Courier',
                'branch' => 'Banani Hub',
                'code' => 'PAT',
                'contact_person' => 'Rifat Ahmed',
                'phone' => '+880-1312-456789',
                'email' => 'support@pathao.com',
                'website' => 'https://pathao.com',
                'address' => 'Banani, Dhaka',
                'coverage_areas' => 'Bangladesh - Dhaka, Chittagong, Sylhet, major cities',
                'base_rate' => 40.00,
                'per_kg_rate' => 10.00,
                'notes' => 'Tech-enabled delivery service with real-time tracking',
                'is_active' => true,
            ],
            [
                'name' => 'RedX',
                'branch' => 'Uttara',
                'code' => 'RDX',
                'contact_person' => 'Tanvir Rahman',
                'phone' => '+880-9610-123456',
                'email' => 'support@redx.com.bd',
                'website' => 'https://redx.com.bd',
                'address' => 'Uttara, Dhaka',
                'coverage_areas' => 'Bangladesh - All 64 districts',
                'base_rate' => 50.00,
                'per_kg_rate' => 14.00,
                'notes' => 'Fast growing courier service with extensive network',
                'is_active' => true,
            ],
            [
                'name' => 'eCourier',
                'branch' => 'Mirpur Branch',
                'code' => 'ECO',
                'contact_person' => 'Sadia Islam',
                'phone' => '+880-1886-888888',
                'email' => 'support@ecourier.com.bd',
                'website' => 'https://ecourier.com.bd',
                'address' => 'Mirpur, Dhaka',
                'coverage_areas' => 'Bangladesh - All districts with e-commerce focus',
                'base_rate' => 55.00,
                'per_kg_rate' => 16.00,
                'notes' => 'Specialized in e-commerce deliveries',
                'is_active' => true,
            ],
            [
                'name' => 'Paperfly',
                'branch' => 'Mohakhali',
                'code' => 'PFL',
                'contact_person' => 'Kamrul Hasan',
                'phone' => '+880-1777-888999',
                'email' => 'info@paperfly.com.bd',
                'website' => 'https://paperfly.com.bd',
                'address' => 'Mohakhali, Dhaka',
                'coverage_areas' => 'Bangladesh - 64 districts',
                'base_rate' => 48.00,
                'per_kg_rate' => 13.00,
                'notes' => 'Reliable service with good customer support',
                'is_active' => true,
            ],
            [
                'name' => 'Steadfast Courier',
                'branch' => 'Tejgaon',
                'code' => 'SFC',
                'contact_person' => 'Ashraf Ali',
                'phone' => '+880-1999-777888',
                'email' => 'support@steadfast.com.bd',
                'website' => 'https://steadfast.com.bd',
                'address' => 'Tejgaon, Dhaka',
                'coverage_areas' => 'Bangladesh - Nationwide',
                'base_rate' => 52.00,
                'per_kg_rate' => 15.00,
                'notes' => 'Known for steady and reliable deliveries',
                'is_active' => true,
            ],

            // International Couriers
            [
                'name' => 'FedEx',
                'branch' => 'Dhaka International',
                'code' => 'FDX',
                'contact_person' => 'John Smith',
                'phone' => '+880-2-9894000',
                'email' => 'bangladesh@fedex.com',
                'website' => 'https://www.fedex.com',
                'address' => 'Gulshan-2, Dhaka',
                'coverage_areas' => 'International - Worldwide express shipping',
                'base_rate' => 500.00,
                'per_kg_rate' => 200.00,
                'notes' => 'Global leader in express shipping and logistics',
                'is_active' => true,
            ],
            [
                'name' => 'DHL',
                'branch' => 'Dhaka Gateway',
                'code' => 'DHL',
                'contact_person' => 'Sarah Johnson',
                'phone' => '+880-2-9894040',
                'email' => 'bangladesh@dhl.com',
                'website' => 'https://www.dhl.com',
                'address' => 'Banani, Dhaka',
                'coverage_areas' => 'International - 220+ countries and territories',
                'base_rate' => 550.00,
                'per_kg_rate' => 220.00,
                'notes' => 'World\'s leading logistics company',
                'is_active' => true,
            ],
            [
                'name' => 'Aramex',
                'branch' => 'Dhaka Office',
                'code' => 'ARX',
                'contact_person' => 'Ahmed Al-Mansoori',
                'phone' => '+880-2-8879494',
                'email' => 'bangladesh@aramex.com',
                'website' => 'https://www.aramex.com',
                'address' => 'Gulshan-1, Dhaka',
                'coverage_areas' => 'International - 600+ cities worldwide',
                'base_rate' => 480.00,
                'per_kg_rate' => 190.00,
                'notes' => 'Leading provider of comprehensive logistics and transportation solutions',
                'is_active' => true,
            ],
            [
                'name' => 'UPS',
                'branch' => null,
                'code' => 'UPS',
                'contact_person' => 'Michael Brown',
                'phone' => '+880-2-9876543',
                'email' => 'bangladesh@ups.com',
                'website' => 'https://www.ups.com',
                'address' => 'Banani, Dhaka',
                'coverage_areas' => 'International - Global shipping network',
                'base_rate' => 520.00,
                'per_kg_rate' => 210.00,
                'notes' => 'Reliable international shipping with tracking',
                'is_active' => true,
            ],
        ];

        // Create or update the predefined couriers
        foreach ($couriers as $courierData) {
            Courier::updateOrCreate(
                ['name' => $courierData['name']], // Match by name
                $courierData // Update or create with this data
            );
        }

        // Optionally, create some random couriers using the factory
        // Uncomment the lines below to generate additional test data
        
        // Courier::factory()->count(5)->create(); // 5 random active couriers
        // Courier::factory()->count(2)->inactive()->create(); // 2 inactive couriers
        // Courier::factory()->count(2)->international()->create(); // 2 international couriers
        // Courier::factory()->count(3)->budget()->create(); // 3 budget couriers
    }
}
