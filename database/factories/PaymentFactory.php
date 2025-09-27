<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $voucherTypes = ['receipt', 'payment'];
        $paymentModes = ['cash', 'bank_transfer', 'cheque', 'card'];
        $referenceTypes = ['sale', 'purchase', 'customer', 'supplier'];
        
        return [
            'voucher_number' => 'VCH-' . rand(1000, 99999),
            'voucher_type' => $voucherTypes[array_rand($voucherTypes)],
            'payment_date' => now()->subDays(rand(0, 365)),
            'account_id' => \App\Models\Account::factory(),
            'reference_type' => $referenceTypes[array_rand($referenceTypes)],
            'reference_id' => rand(1, 100),
            'amount' => rand(10000, 1000000) / 100, // 100.00 to 10000.00
            'payment_mode' => $paymentModes[array_rand($paymentModes)],
            'reference_number' => 'REF-' . rand(100000, 999999),
            'notes' => rand(0, 10) < 3 ? 'Payment notes ' . rand(1, 1000) : null,
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
