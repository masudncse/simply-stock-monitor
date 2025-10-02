<?php

namespace Database\Factories;

use App\Models\Courier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Courier>
 */
class CourierFactory extends Factory
{
    protected $model = Courier::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $courierNames = [
            'Express Logistics',
            'Swift Delivery',
            'Fast Track Courier',
            'Prime Shipping',
            'Global Transport',
            'City Express',
            'Metro Courier',
            'Elite Delivery',
            'Speed Post',
            'Quick Ship',
        ];

        $branches = [
            'Dhaka Central',
            'Gulshan Branch',
            'Dhanmondi Office',
            'Uttara Hub',
            'Mirpur Branch',
            'Chittagong Main',
            'Sylhet Branch',
            'Rajshahi Office',
            'Khulna Hub',
            'Banani Branch',
        ];

        $districts = [
            'Dhaka, Gazipur, Narayanganj',
            'Chittagong, Cox\'s Bazar',
            'Sylhet, Moulvibazar',
            'Rajshahi, Bogra',
            'Khulna, Jessore',
            'All major cities',
            'Nationwide',
            '64 districts',
        ];

        $name = fake()->unique()->randomElement($courierNames);
        $code = strtoupper(substr($name, 0, 3));

        return [
            'name' => $name,
            'branch' => fake()->boolean(70) ? fake()->randomElement($branches) : null,
            'code' => $code,
            'contact_person' => fake()->name(),
            'phone' => '+880-' . fake()->numerify('####-######'),
            'email' => strtolower(str_replace(' ', '', $name)) . '@' . fake()->domainName(),
            'website' => 'https://www.' . strtolower(str_replace(' ', '', $name)) . '.com',
            'address' => fake()->address(),
            'base_rate' => fake()->randomFloat(2, 30, 100),
            'per_kg_rate' => fake()->randomFloat(2, 8, 25),
            'coverage_areas' => 'Bangladesh - ' . fake()->randomElement($districts),
            'notes' => fake()->boolean(40) ? fake()->sentence() : null,
            'is_active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the courier is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the courier is for international shipping.
     */
    public function international(): static
    {
        return $this->state(fn (array $attributes) => [
            'coverage_areas' => 'International - ' . fake()->randomElement([
                'Worldwide',
                'Asia Pacific',
                'Europe & Americas',
                'Global shipping available',
            ]),
            'base_rate' => fake()->randomFloat(2, 400, 600),
            'per_kg_rate' => fake()->randomFloat(2, 150, 250),
        ]);
    }

    /**
     * Indicate that the courier is budget-friendly.
     */
    public function budget(): static
    {
        return $this->state(fn (array $attributes) => [
            'base_rate' => fake()->randomFloat(2, 25, 50),
            'per_kg_rate' => fake()->randomFloat(2, 5, 12),
        ]);
    }
}
