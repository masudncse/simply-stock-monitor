<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BankTransaction;
use App\Models\Account;
use App\Models\User;
use App\Services\BankTransactionService;

class BankTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $service = new BankTransactionService();
        

        // Get or create accounts
        $cashAccount = Account::where('code', '1000')->first();
        if (!$cashAccount) {
            $cashAccount = Account::create([
                'code' => '1000',
                'name' => 'Cash',
                'type' => 'asset',
                'sub_type' => 'current_asset',
                'opening_balance' => 10000.00,
                'is_active' => true,
            ]);
        }

        $bankAccount = Account::where('code', '1100')->first();
        if (!$bankAccount) {
            $bankAccount = Account::create([
                'code' => '1100',
                'name' => 'Bank Account',
                'type' => 'asset',
                'sub_type' => 'current_asset',
                'opening_balance' => 50000.00,
                'is_active' => true,
            ]);
        }

        $adminUser = User::first();
        if (!$adminUser) {
            $this->command->warn('Admin user not found. Skipping bank transaction seeder.');
            return;
        }

        // Sample bank transactions
        $transactions = [
            // Deposits
            [
                'transaction_type' => 'deposit',
                'from_account_id' => $cashAccount->id,
                'to_account_id' => $bankAccount->id,
                'transaction_date' => now()->subDays(5)->toDateString(),
                'amount' => 5000.00,
                'reference_number' => 'DEP-001',
                'description' => 'Daily cash deposit',
                'notes' => 'End of day cash deposit',
            ],
            [
                'transaction_type' => 'deposit',
                'from_account_id' => $cashAccount->id,
                'to_account_id' => $bankAccount->id,
                'transaction_date' => now()->subDays(3)->toDateString(),
                'amount' => 3500.00,
                'reference_number' => 'DEP-002',
                'description' => 'Cash deposit from sales',
                'notes' => null,
            ],
            
            // Withdrawals
            [
                'transaction_type' => 'withdraw',
                'from_account_id' => $bankAccount->id,
                'to_account_id' => $cashAccount->id,
                'transaction_date' => now()->subDays(2)->toDateString(),
                'amount' => 1000.00,
                'reference_number' => 'WTH-001',
                'description' => 'Cash withdrawal for petty cash',
                'notes' => 'Petty cash replenishment',
            ],
            [
                'transaction_type' => 'withdraw',
                'from_account_id' => $bankAccount->id,
                'to_account_id' => $cashAccount->id,
                'transaction_date' => now()->subDays(1)->toDateString(),
                'amount' => 500.00,
                'reference_number' => 'ATM-12345',
                'description' => 'ATM withdrawal',
                'notes' => null,
            ],
        ];

        foreach ($transactions as $transactionData) {
            $service->createBankTransaction($transactionData, $adminUser->id);
        }

        $this->command->info('Bank transactions seeded successfully!');
    }
}
