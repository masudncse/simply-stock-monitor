<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
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
        
        $status = $statuses[array_rand($statuses)];
        
        return [
            'invoice_number' => 'PO-' . rand(1000, 99999),
            'supplier_id' => \App\Models\Supplier::factory(),
            'warehouse_id' => \App\Models\Warehouse::factory(),
            'purchase_date' => now()->subDays(rand(0, 365)),
            'due_date' => now()->addDays(rand(1, 30)),
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'status' => $status,
            'notes' => rand(0, 10) < 3 ? 'Notes for purchase ' . rand(1, 1000) : null,
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
