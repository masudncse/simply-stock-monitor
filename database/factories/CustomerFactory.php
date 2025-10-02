<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creditLimit = rand(100000, 5000000) / 100; // 1000.00 to 50000.00
        $outstandingAmount = rand(0, $creditLimit * 80) / 100; // Max 80% of credit limit
        
        // Random default tax rate: 0%, 4%, 8%, or 10%
        $taxRates = [0, 4, 8, 10];
        $defaultTaxRate = $taxRates[array_rand($taxRates)];
        
        return [
            'name' => 'Customer ' . rand(1, 1000),
            'code' => 'CUS' . strtoupper(uniqid()),
            'contact_person' => 'Contact Person ' . rand(1, 1000),
            'phone' => '+1-' . rand(100, 999) . '-' . rand(100, 999) . '-' . rand(1000, 9999),
            'email' => 'customer' . rand(1, 1000) . '@example.com',
            'address' => 'Address ' . rand(1, 1000),
            'tax_number' => rand(0, 10) < 7 ? 'TAX' . rand(100000000, 999999999) : null,
            'default_tax_rate' => $defaultTaxRate,
            'credit_limit' => $creditLimit,
            'outstanding_amount' => $outstandingAmount,
            'is_active' => rand(0, 10) < 9, // 90% chance
        ];
    }
    
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
    
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
    
    public function withOutstanding(): static
    {
        return $this->state(fn (array $attributes) => [
            'outstanding_amount' => $this->faker->randomFloat(2, 1000, $attributes['credit_limit'] * 0.5),
        ]);
    }
    
    public function noOutstanding(): static
    {
        return $this->state(fn (array $attributes) => [
            'outstanding_amount' => 0,
        ]);
    }
}
