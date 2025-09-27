<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['asset', 'liability', 'equity', 'income', 'expense'];
        $subTypes = ['current_asset', 'fixed_asset', 'current_liability', 'long_term_liability', 'revenue', 'cost_of_goods_sold', 'operating_expense'];
        
        return [
            'code' => 'ACC' . uniqid(),
            'name' => 'Account ' . rand(1, 1000),
            'type' => $types[array_rand($types)],
            'sub_type' => $subTypes[array_rand($subTypes)],
            'parent_id' => null,
            'opening_balance' => rand(-1000000, 1000000) / 100, // -10000.00 to 10000.00
            'is_active' => rand(0, 10) < 9, // 90% chance
        ];
    }
}
