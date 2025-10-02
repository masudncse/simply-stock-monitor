<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = rand(10000, 1000000) / 100; // 100.00 to 10000.00
        
        // Random tax rate: 0%, 4%, 8%, or 10%
        $taxRates = [0, 4, 8, 10];
        $taxRate = $taxRates[array_rand($taxRates)];
        
        $discountAmount = rand(0, $subtotal * 20) / 100; // Max 20% discount
        $taxAmount = $subtotal * ($taxRate / 100);
        $totalAmount = $subtotal - $discountAmount + $taxAmount;
        $paidAmount = rand(0, $totalAmount * 100) / 100;
        
        $statuses = ['draft', 'pending'];
        $paymentStatuses = ['pending', 'partial'];
        
        $status = $statuses[array_rand($statuses)];
        $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];
        
        return [
            'invoice_number' => 'INV-' . rand(1000, 99999),
            'customer_id' => \App\Models\Customer::factory(),
            'warehouse_id' => \App\Models\Warehouse::factory(),
            'sale_date' => now()->subDays(rand(0, 365)),
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'status' => $status,
            'payment_status' => $paymentStatus,
            'notes' => rand(0, 10) < 3 ? 'Notes for sale ' . rand(1, 1000) : null,
            'created_by' => \App\Models\User::factory(),
        ];
    }
    
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'payment_status' => 'pending',
            'paid_amount' => 0,
        ]);
    }
    
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }
    
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
            'paid_amount' => $attributes['total_amount'],
        ]);
    }
    
    public function partial(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'partial',
            'paid_amount' => $attributes['total_amount'] * 0.5,
        ]);
    }
    
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'overdue',
            'sale_date' => now()->subDays(rand(30, 365)),
        ]);
    }
}
