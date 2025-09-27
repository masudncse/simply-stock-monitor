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

        $purchases = Purchase::factory(25)->create([
            'supplier_id' => fn() => $suppliers->random()->id,
            'warehouse_id' => fn() => $warehouses->random()->id,
            'created_by' => fn() => $users->random()->id,
        ]);

        // Create purchase items
        foreach ($purchases as $purchase) {
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
