<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shipment>
 */
class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $courierServices = [
            'SA Poribahan',
            'Sundorbon Express',
            'Janani',
            'FedEx',
            'DHL',
            'Pathao Courier',
            'RedX',
            'Aramex',
            'eCourier',
        ];

        $statuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
        $status = $this->faker->randomElement($statuses);
        
        $shippingDate = $this->faker->dateTimeBetween('-30 days', 'now');
        $expectedDeliveryDate = (clone $shippingDate)->modify('+' . rand(2, 7) . ' days');
        
        $actualDeliveryDate = null;
        if ($status === 'delivered') {
            $actualDeliveryDate = (clone $shippingDate)->modify('+' . rand(1, 10) . ' days');
        }

        $districts = [
            'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 
            'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
            'Narayanganj', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur'
        ];

        return [
            'shipment_number' => 'SHP-' . date('Ymd', $shippingDate->getTimestamp()) . '-' . str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'courier_service' => $this->faker->randomElement($courierServices),
            'tracking_number' => $this->faker->optional(0.7)->numerify('TRK###########'),
            'shipping_date' => $shippingDate,
            'expected_delivery_date' => $expectedDeliveryDate,
            'actual_delivery_date' => $actualDeliveryDate,
            'status' => $status,
            'recipient_name' => $this->faker->name(),
            'recipient_phone' => $this->faker->numerify('+880-1#########'),
            'recipient_address' => $this->faker->address(),
            'recipient_city' => $this->faker->city(),
            'recipient_district' => $this->faker->randomElement($districts),
            'recipient_postal_code' => $this->faker->numerify('####'),
            'number_of_packages' => $this->faker->numberBetween(1, 5),
            'total_weight' => $this->faker->randomFloat(2, 0.5, 50),
            'package_dimensions' => $this->faker->numberBetween(10, 50) . 'x' . $this->faker->numberBetween(10, 50) . 'x' . $this->faker->numberBetween(5, 30) . ' cm',
            'shipping_cost' => $this->faker->randomFloat(2, 100, 2000),
            'is_paid' => $this->faker->boolean(80),
            'notes' => $this->faker->optional(0.3)->sentence(),
            'special_instructions' => $this->faker->optional(0.2)->sentence(),
        ];
    }
}
