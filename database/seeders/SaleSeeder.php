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

        $sales = Sale::factory(30)->create([
            'customer_id' => fn() => $customers->random()->id,
            'warehouse_id' => fn() => $warehouses->random()->id,
            'created_by' => fn() => $users->random()->id,
        ]);

        // Create sale items
        foreach ($sales as $sale) {
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
