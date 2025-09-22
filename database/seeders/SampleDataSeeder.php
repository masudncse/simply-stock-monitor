<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Stock;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Account;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Electronics', 'code' => 'ELEC', 'description' => 'Electronic products'],
            ['name' => 'Clothing', 'code' => 'CLOTH', 'description' => 'Clothing and apparel'],
            ['name' => 'Books', 'code' => 'BOOK', 'description' => 'Books and publications'],
            ['name' => 'Food & Beverages', 'code' => 'FOOD', 'description' => 'Food and beverage items'],
            ['name' => 'Home & Garden', 'code' => 'HOME', 'description' => 'Home and garden products'],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create warehouses
        $warehouses = [
            ['name' => 'Main Warehouse', 'code' => 'MAIN', 'address' => '123 Main St, City'],
            ['name' => 'Secondary Warehouse', 'code' => 'SEC', 'address' => '456 Secondary Ave, City'],
        ];

        foreach ($warehouses as $warehouseData) {
            Warehouse::create($warehouseData);
        }

        // Create suppliers
        $suppliers = [
            ['name' => 'ABC Electronics Ltd', 'code' => 'ABC', 'contact_person' => 'John Doe', 'phone' => '123-456-7890', 'email' => 'john@abc.com'],
            ['name' => 'XYZ Clothing Co', 'code' => 'XYZ', 'contact_person' => 'Jane Smith', 'phone' => '098-765-4321', 'email' => 'jane@xyz.com'],
            ['name' => 'Book World Inc', 'code' => 'BOOK', 'contact_person' => 'Bob Johnson', 'phone' => '555-123-4567', 'email' => 'bob@bookworld.com'],
        ];

        foreach ($suppliers as $supplierData) {
            Supplier::create($supplierData);
        }

        // Create customers
        $customers = [
            ['name' => 'Retail Store A', 'code' => 'RSA', 'contact_person' => 'Alice Brown', 'phone' => '111-222-3333', 'email' => 'alice@retail.com'],
            ['name' => 'Online Shop B', 'code' => 'OSB', 'contact_person' => 'Charlie Davis', 'phone' => '444-555-6666', 'email' => 'charlie@online.com'],
            ['name' => 'Wholesale C', 'code' => 'WC', 'contact_person' => 'Diana Wilson', 'phone' => '777-888-9999', 'email' => 'diana@wholesale.com'],
        ];

        foreach ($customers as $customerData) {
            Customer::create($customerData);
        }

        // Create chart of accounts
        $accounts = [
            // Assets
            ['code' => '1000', 'name' => 'Cash', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1100', 'name' => 'Bank Account', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1200', 'name' => 'Accounts Receivable', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1300', 'name' => 'Inventory', 'type' => 'asset', 'sub_type' => 'current_asset'],
            ['code' => '1500', 'name' => 'Equipment', 'type' => 'asset', 'sub_type' => 'fixed_asset'],
            
            // Liabilities
            ['code' => '2000', 'name' => 'Accounts Payable', 'type' => 'liability', 'sub_type' => 'current_liability'],
            ['code' => '2100', 'name' => 'Accrued Expenses', 'type' => 'liability', 'sub_type' => 'current_liability'],
            
            // Equity
            ['code' => '3000', 'name' => 'Owner Equity', 'type' => 'equity', 'sub_type' => 'owner_equity'],
            ['code' => '3100', 'name' => 'Retained Earnings', 'type' => 'equity', 'sub_type' => 'owner_equity'],
            
            // Income
            ['code' => '4000', 'name' => 'Sales Revenue', 'type' => 'income', 'sub_type' => 'revenue'],
            ['code' => '4100', 'name' => 'Other Income', 'type' => 'income', 'sub_type' => 'revenue'],
            
            // Expenses
            ['code' => '5000', 'name' => 'Cost of Goods Sold', 'type' => 'expense', 'sub_type' => 'cost_of_goods_sold'],
            ['code' => '6000', 'name' => 'Operating Expenses', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '6100', 'name' => 'Rent Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '6200', 'name' => 'Utilities Expense', 'type' => 'expense', 'sub_type' => 'operating_expense'],
            ['code' => '6300', 'name' => 'Office Supplies', 'type' => 'expense', 'sub_type' => 'operating_expense'],
        ];

        foreach ($accounts as $accountData) {
            Account::create($accountData);
        }

        // Create sample products
        $products = [
            ['sku' => 'LAPTOP001', 'name' => 'Gaming Laptop', 'category_id' => 1, 'unit' => 'pcs', 'price' => 1200.00, 'cost_price' => 800.00],
            ['sku' => 'MOUSE001', 'name' => 'Wireless Mouse', 'category_id' => 1, 'unit' => 'pcs', 'price' => 25.00, 'cost_price' => 15.00],
            ['sku' => 'TSHIRT001', 'name' => 'Cotton T-Shirt', 'category_id' => 2, 'unit' => 'pcs', 'price' => 15.00, 'cost_price' => 8.00],
            ['sku' => 'BOOK001', 'name' => 'Programming Guide', 'category_id' => 3, 'unit' => 'pcs', 'price' => 35.00, 'cost_price' => 20.00],
            ['sku' => 'COFFEE001', 'name' => 'Premium Coffee', 'category_id' => 4, 'unit' => 'kg', 'price' => 45.00, 'cost_price' => 25.00],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create initial stock
        $warehouses = Warehouse::all();
        $products = Product::all();

        foreach ($warehouses as $warehouse) {
            foreach ($products as $product) {
                Stock::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $product->id,
                    'qty' => rand(10, 100),
                    'cost_price' => $product->cost_price,
                ]);
            }
        }
    }
}