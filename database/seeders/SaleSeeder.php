<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating sales...');

        $customers = Customer::all();
        $warehouses = Warehouse::all();
        $users = User::all();
        $products = Product::all();
        
        if ($customers->isEmpty() || $warehouses->isEmpty() || $users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Required data not found. Please run UserSeeder, CustomerSeeder, WarehouseSeeder, and ProductSeeder first.');
            return;
        }

        // Create sales with customer's default tax rate
        foreach (range(1, 30) as $index) {
            $customer = $customers->random();
            $warehouse = $warehouses->random();
            $user = $users->random();
            
            $sale = Sale::factory()->create([
                'customer_id' => $customer->id,
                'warehouse_id' => $warehouse->id,
                'tax_rate' => $customer->default_tax_rate, // Use customer's default tax rate
                'created_by' => $user->id,
            ]);

            // Create sale items
            $itemCount = rand(1, 5);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = rand(1, 10);
                $price = $product->price;
                $total = $qty * $price;
                
                SaleItem::factory()->create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'total_price' => $total,
                ]);
            }
        }
        
        $this->command->info('Sales created successfully!');
    }
}
