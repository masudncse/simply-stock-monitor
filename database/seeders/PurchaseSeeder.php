<?php

namespace Database\Seeders;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating purchases...');

        $suppliers = Supplier::all();
        $warehouses = Warehouse::all();
        $users = User::all();
        $products = Product::all();
        
        if ($suppliers->isEmpty() || $warehouses->isEmpty() || $users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Required data not found. Please run UserSeeder, SupplierSeeder, WarehouseSeeder, and ProductSeeder first.');
            return;
        }

        // Create purchases with supplier's default tax rate
        foreach (range(1, 25) as $index) {
            $supplier = $suppliers->random();
            $warehouse = $warehouses->random();
            $user = $users->random();
            
            $purchase = Purchase::factory()->create([
                'supplier_id' => $supplier->id,
                'warehouse_id' => $warehouse->id,
                'tax_rate' => $supplier->default_tax_rate, // Use supplier's default tax rate
                'created_by' => $user->id,
            ]);

            // Create purchase items
            $itemCount = rand(1, 4);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = rand(10, 100);
                $costPrice = $product->cost_price;
                $total = $qty * $costPrice;
                
                PurchaseItem::factory()->create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => $costPrice,
                    'total_price' => $total,
                ]);
            }
        }
        
        $this->command->info('Purchases created successfully!');
    }
}
