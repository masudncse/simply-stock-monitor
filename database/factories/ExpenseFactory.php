<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['office_supplies', 'utilities', 'travel', 'marketing', 'maintenance', 'professional_services'];
        $paymentModes = ['cash', 'bank_transfer', 'cheque', 'card'];
        
        return [
            'expense_number' => 'EXP-' . rand(1000, 99999),
            'account_id' => \App\Models\Account::factory(),
            'expense_date' => now()->subDays(rand(0, 365)),
            'category' => $categories[array_rand($categories)],
            'description' => 'Expense description ' . rand(1, 1000),
            'amount' => rand(1000, 100000) / 100, // 10.00 to 1000.00
            'payment_mode' => $paymentModes[array_rand($paymentModes)],
            'reference_number' => 'REF-' . rand(100000, 999999),
            'notes' => rand(0, 10) < 3 ? 'Expense notes ' . rand(1, 1000) : null,
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
