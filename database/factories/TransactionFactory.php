<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $referenceTypes = ['sale', 'purchase', 'payment', 'expense', 'adjustment'];
        $isDebit = rand(0, 1) === 1;
        $amount = rand(1000, 100000) / 100; // 10.00 to 1000.00
        
        return [
            'account_id' => \App\Models\Account::factory(),
            'transaction_date' => now()->subDays(rand(0, 365)),
            'reference_type' => $referenceTypes[array_rand($referenceTypes)],
            'reference_id' => rand(1, 100),
            'debit' => $isDebit ? $amount : 0,
            'credit' => $isDebit ? 0 : $amount,
            'description' => 'Transaction description ' . rand(1, 1000),
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
