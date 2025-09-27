<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quotation>
 */
class QuotationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = rand(10000, 1000000) / 100; // 100.00 to 10000.00
        $taxRate = rand(0, 2500) / 100; // 0 to 25%
        $discountAmount = rand(0, $subtotal * 20) / 100; // Max 20% discount
        $taxAmount = ($subtotal - $discountAmount) * ($taxRate / 100);
        $totalAmount = $subtotal - $discountAmount + $taxAmount;
        
        $statuses = ['draft', 'sent', 'approved', 'rejected', 'expired'];
        $discountTypes = ['percentage', 'fixed'];
        
        $status = $statuses[array_rand($statuses)];
        $discountType = $discountTypes[array_rand($discountTypes)];
        
        return [
            'quotation_number' => 'QUO-' . rand(1000, 99999),
            'customer_id' => \App\Models\Customer::factory(),
            'warehouse_id' => \App\Models\Warehouse::factory(),
            'quotation_date' => now()->subDays(rand(0, 365)),
            'valid_until' => now()->addDays(rand(1, 30)),
            'notes' => rand(0, 10) < 3 ? 'Quotation notes ' . rand(1, 1000) : null,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'discount_type' => $discountType,
            'discount_value' => $discountAmount,
            'total_amount' => $totalAmount,
            'status' => $status,
            'created_by' => \App\Models\User::factory(),
            'approved_by' => $status === 'approved' ? \App\Models\User::factory() : null,
            'approved_at' => $status === 'approved' ? now()->subDays(rand(0, 30)) : null,
            'converted_to_sale_id' => null,
        ];
    }
}
