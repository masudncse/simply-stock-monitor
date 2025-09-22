<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'code' => strtoupper($this->faker->unique()->lexify('SUP???')),
            'contact_person' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'address' => $this->faker->address(),
            'tax_number' => $this->faker->numerify('TAX#######'),
            'credit_limit' => $this->faker->randomFloat(2, 1000, 50000),
            'outstanding_amount' => $this->faker->randomFloat(2, 0, 10000),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
