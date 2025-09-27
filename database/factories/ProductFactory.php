<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = rand(1000, 100000) / 100; // 10.00 to 1000.00
        $costPrice = $price * (rand(50, 80) / 100); // Cost is 50-80% of price
        
        return [
            'sku' => 'SKU' . strtoupper(uniqid()),
            'barcode' => rand(1000000000000, 9999999999999),
            'name' => 'Product ' . rand(1, 1000),
            'description' => 'Description for product ' . rand(1, 1000),
            'category_id' => \App\Models\Category::factory(),
            'unit' => ['pcs', 'kg', 'liter', 'box', 'pack', 'dozen', 'gallon', 'meter'][array_rand(['pcs', 'kg', 'liter', 'box', 'pack', 'dozen', 'gallon', 'meter'])],
            'min_stock' => rand(1, 50),
            'price' => $price,
            'cost_price' => $costPrice,
            'tax_rate' => rand(0, 2500) / 100, // 0 to 25%
            'image' => null,
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
    
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'min_stock' => $this->faker->numberBetween(10, 20),
        ]);
    }
}
