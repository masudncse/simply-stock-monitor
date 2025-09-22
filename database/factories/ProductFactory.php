<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'sku' => strtoupper($this->faker->unique()->lexify('SKU??????')),
            'barcode' => $this->faker->unique()->ean13(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'category_id' => \App\Models\Category::factory(),
            'unit' => $this->faker->randomElement(['pcs', 'kg', 'liter', 'box', 'pack']),
            'min_stock' => $this->faker->numberBetween(1, 50),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'cost_price' => $this->faker->randomFloat(2, 5, 500),
            'tax_rate' => $this->faker->randomFloat(2, 0, 25),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
