<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Home & Garden',
            'Sports & Outdoors', 'Health & Beauty', 'Toys & Games', 'Automotive',
            'Office Supplies', 'Jewelry', 'Pet Supplies', 'Baby Products', 'Tools',
            'Musical Instruments', 'Art & Crafts', 'Travel', 'Fitness', 'Kitchen',
            'Furniture', 'Lighting', 'Bathroom', 'Bedroom', 'Living Room'
        ];
        
        $name = $categories[array_rand($categories)];
        
        return [
            'name' => $name,
            'code' => strtoupper(substr($name, 0, 3) . rand(100, 999)),
            'description' => 'Description for ' . $name,
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
}
