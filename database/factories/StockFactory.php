<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = rand(0, 1000);
        $costPrice = rand(500, 50000) / 100; // 5.00 to 500.00
        
        return [
            'warehouse_id' => \App\Models\Warehouse::factory(),
            'product_id' => \App\Models\Product::factory(),
            'qty' => $qty,
            'batch' => rand(0, 10) < 6 ? 'BATCH-' . rand(1000, 9999) : null,
            'expiry_date' => rand(0, 10) < 4 ? now()->addDays(rand(1, 730)) : null,
            'cost_price' => $costPrice,
        ];
    }
    
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty' => rand(10, 1000),
        ]);
    }
    
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty' => rand(1, 10),
        ]);
    }
    
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty' => 0,
        ]);
    }
    
    public function withExpiry(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => now()->addDays(rand(1, 730)),
        ]);
    }
    
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => now()->subDays(rand(1, 365)),
        ]);
    }
}
