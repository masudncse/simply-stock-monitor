<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core system seeders
            RolePermissionSeeder::class,
            UserSeeder::class,
            CompanySettingSeeder::class,
            SystemSettingSeeder::class,
            
            // Business data seeders
            CategorySeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            SupplierSeeder::class,
            WarehouseSeeder::class,
            StockSeeder::class,
            
            // Transaction seeders
            SaleSeeder::class,
            PurchaseSeeder::class,
            QuotationSeeder::class,
            PaymentSeeder::class,
            ExpenseSeeder::class,
            AccountSeeder::class,
            TransactionSeeder::class,
            
            // Return management seeders
            ReturnManagementSeeder::class,
            BankTransactionSeeder::class,
            
            // Notification seeder
            NotificationSeeder::class,
        ]);
    }
}
