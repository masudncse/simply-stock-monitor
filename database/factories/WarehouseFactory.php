<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $warehouseTypes = ['Main', 'Secondary', 'Storage', 'Distribution', 'Cold', 'Dry', 'Bonded'];
        $type = $warehouseTypes[array_rand($warehouseTypes)];
        
        return [
            'name' => $type . ' Warehouse',
            'code' => 'WH' . strtoupper(uniqid()),
            'address' => 'Address ' . rand(1, 1000),
            'contact_person' => 'Contact Person ' . rand(1, 1000),
            'phone' => '+1-' . rand(100, 999) . '-' . rand(100, 999) . '-' . rand(1000, 9999),
            'email' => 'warehouse' . rand(1, 1000) . '@example.com',
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
