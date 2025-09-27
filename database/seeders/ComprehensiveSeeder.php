<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Stock;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Notification;
use App\Models\CompanySetting;
use App\Models\SystemSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ComprehensiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting comprehensive seeding...');

        // 1. Create admin user
        $this->command->info('Creating admin user...');
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 2. Create regular users
        $this->command->info('Creating regular users...');
        $users = User::factory(5)->create();
        $allUsers = collect([$admin])->merge($users);

        // 3. Create categories
        $this->command->info('Creating categories...');
        $categories = Category::factory(10)->active()->create();

        // 4. Create products
        $this->command->info('Creating products...');
        $products = Product::factory(50)->active()->create([
            'category_id' => fn() => $categories->random()->id
        ]);

        // 5. Create customers
        $this->command->info('Creating customers...');
        $customers = Customer::factory(20)->active()->create();

        // 6. Create suppliers
        $this->command->info('Creating suppliers...');
        $suppliers = Supplier::factory(15)->active()->create();

        // 7. Create warehouses
        $this->command->info('Creating warehouses...');
        $warehouses = Warehouse::factory(3)->active()->create();

        // 8. Create stock entries
        $this->command->info('Creating stock entries...');
        foreach ($products as $product) {
            foreach ($warehouses as $warehouse) {
                Stock::factory()->create([
                    'product_id' => $product->id,
                    'warehouse_id' => $warehouse->id,
                    'qty' => fake()->numberBetween(0, 500),
                ]);
            }
        }

        // 9. Create sales
        $this->command->info('Creating sales...');
        $sales = Sale::factory(30)->create([
            'customer_id' => fn() => $customers->random()->id,
            'warehouse_id' => fn() => $warehouses->random()->id,
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 10. Create sale items
        $this->command->info('Creating sale items...');
        foreach ($sales as $sale) {
            $itemCount = fake()->numberBetween(1, 5);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = fake()->numberBetween(1, 10);
                $price = $product->price;
                $total = $qty * $price;
                
                SaleItem::factory()->create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $price,
                    'total' => $total,
                ]);
            }
        }

        // 11. Create purchases
        $this->command->info('Creating purchases...');
        $purchases = Purchase::factory(25)->create([
            'supplier_id' => fn() => $suppliers->random()->id,
            'warehouse_id' => fn() => $warehouses->random()->id,
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 12. Create purchase items
        $this->command->info('Creating purchase items...');
        foreach ($purchases as $purchase) {
            $itemCount = fake()->numberBetween(1, 4);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = fake()->numberBetween(10, 100);
                $costPrice = $product->cost_price;
                $total = $qty * $costPrice;
                
                PurchaseItem::factory()->create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'cost_price' => $costPrice,
                    'total' => $total,
                ]);
            }
        }

        // 13. Create payments
        $this->command->info('Creating payments...');
        Payment::factory(40)->create([
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 14. Create expenses
        $this->command->info('Creating expenses...');
        Expense::factory(20)->create([
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 15. Create accounts
        $this->command->info('Creating accounts...');
        Account::factory(10)->create();

        // 16. Create transactions
        $this->command->info('Creating transactions...');
        Transaction::factory(50)->create([
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 17. Create quotations
        $this->command->info('Creating quotations...');
        $quotations = Quotation::factory(15)->create([
            'customer_id' => fn() => $customers->random()->id,
            'created_by' => fn() => $allUsers->random()->id,
        ]);

        // 18. Create quotation items
        $this->command->info('Creating quotation items...');
        foreach ($quotations as $quotation) {
            $itemCount = fake()->numberBetween(1, 4);
            $selectedProducts = $products->random($itemCount);
            
            foreach ($selectedProducts as $product) {
                $qty = fake()->numberBetween(1, 10);
                $price = $product->price;
                $total = $qty * $price;
                
                QuotationItem::factory()->create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $price,
                    'total' => $total,
                ]);
            }
        }

        // 19. Create notifications for all users
        $this->command->info('Creating notifications...');
        foreach ($allUsers as $user) {
            Notification::factory(5)->create([
                'user_id' => $user->id,
            ]);
        }

        // 20. Create company settings
        $this->command->info('Creating company settings...');
        CompanySetting::create([
            'name' => 'Sample Company Ltd',
            'email' => 'info@samplecompany.com',
            'phone' => '+1-555-0123',
            'address' => '123 Business Street, City, State 12345',
            'logo' => null,
            'website' => 'https://samplecompany.com',
            'tax_number' => 'TAX123456789',
            'currency' => 'USD',
            'timezone' => 'America/New_York',
        ]);

        // 21. Create system settings
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
            SystemSetting::set($key, $value, 'string', "System setting for {$key}");
        }

        $this->command->info('Comprehensive seeding completed successfully!');
        $this->command->info('Admin login: admin@example.com / password');
    }
}
