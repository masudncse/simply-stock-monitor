<?php

namespace Database\Seeders;

use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuotationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating quotations...');

        $customers = Customer::all();
        $users = User::all();
        $products = Product::all();
        
        if ($customers->isEmpty() || $users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Required data not found. Please run UserSeeder, CustomerSeeder, and ProductSeeder first.');
            return;
        }

        $quotations = Quotation::factory(15)->create([
            'customer_id' => fn() => $customers->random()->id,
            'created_by' => fn() => $users->random()->id,
        ]);

        // Create quotation items
        foreach ($quotations as $quotation) {
            $itemCount = rand(1, 4);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = rand(1, 10);
                $price = $product->price;
                $total = $qty * $price;
                
                QuotationItem::factory()->create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'total_price' => $total,
                ]);
            }
        }
        
        $this->command->info('Quotations created successfully!');
    }
}
