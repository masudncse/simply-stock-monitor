<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shipment;
use App\Models\Sale;
use App\Models\User;

class ShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating shipments...');

        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Get completed or approved sales (or any sales if none are approved/completed)
        $sales = Sale::whereIn('status', ['approved', 'completed'])
            ->with('customer')
            ->limit(30)
            ->get();

        // If no approved/completed sales, get any sales
        if ($sales->isEmpty()) {
            $sales = Sale::with('customer')
                ->limit(30)
                ->get();
        }

        if ($sales->isEmpty()) {
            $this->command->warn('No sales found. Please run SaleSeeder first.');
            return;
        }

        foreach ($sales as $sale) {
            // Create 1-2 shipments per sale
            $shipmentCount = rand(1, 2);
            
            for ($i = 0; $i < $shipmentCount; $i++) {
                Shipment::factory()->create([
                    'sale_id' => $sale->id,
                    'customer_id' => $sale->customer_id,
                    'created_by' => $users->random()->id,
                ]);
            }
        }

        $this->command->info('Shipments created successfully!');
    }
}

