<?php

namespace Database\Seeders;

use App\Models\Stock;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating stock entries...');

        $faker = null;
        $products = Product::all();
        $warehouses = Warehouse::all();
        
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');
            return;
        }
        
        if ($warehouses->isEmpty()) {
            $this->command->warn('No warehouses found. Please run WarehouseSeeder first.');
            return;
        }

        foreach ($products as $product) {
            foreach ($warehouses as $warehouse) {
                Stock::factory()->create([
                    'product_id' => $product->id,
                    'warehouse_id' => $warehouse->id,
                    'qty' => rand(0, 500),
                ]);
            }
        }
        
        $this->command->info('Stock entries created successfully!');
    }
}
