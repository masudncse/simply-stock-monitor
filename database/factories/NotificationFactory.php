<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['info', 'success', 'warning', 'error'];
        $type = $this->faker->randomElement($types);
        
        $titles = [
            'info' => [
                'System Update',
                'Payment Received',
                'New User Registration',
                'Backup Completed',
                'Maintenance Scheduled',
            ],
            'success' => [
                'New Sale Recorded',
                'Purchase Order Approved',
                'Payment Processed',
                'Inventory Updated',
                'Report Generated',
            ],
            'warning' => [
                'Low Stock Alert',
                'Expired Product',
                'Payment Overdue',
                'System Maintenance',
                'Storage Space Low',
            ],
            'error' => [
                'Payment Failed',
                'System Error',
                'Backup Failed',
                'Connection Lost',
                'Validation Error',
            ],
        ];
        
        $messages = [
            'info' => [
                'A system update has been completed successfully.',
                'Payment of ${{amount}} received from {{customer}}.',
                'New user {{user}} has registered in the system.',
                'Database backup completed at {{time}}.',
                'System maintenance is scheduled for {{date}}.',
            ],
            'success' => [
                'A new sale of ${{amount}} has been recorded.',
                'Purchase order #{{order}} has been approved.',
                'Payment of ${{amount}} has been processed successfully.',
                'Inventory for {{product}} has been updated.',
                '{{report}} report has been generated successfully.',
            ],
            'warning' => [
                'Product "{{product}}" is running low on stock ({{stock}} items remaining).',
                'Product "{{product}}" has expired and needs attention.',
                'Payment from {{customer}} is overdue by {{days}} days.',
                'System maintenance is required for optimal performance.',
                'Storage space is running low ({{percent}}% used).',
            ],
            'error' => [
                'Payment processing failed for transaction #{{transaction}}.',
                'System error occurred: {{error}}.',
                'Database backup failed. Please check logs.',
                'Connection to {{service}} has been lost.',
                'Validation error in {{form}}: {{field}} is required.',
            ],
        ];
        
        $title = $this->faker->randomElement($titles[$type]);
        $message = $this->faker->randomElement($messages[$type]);
        
        // Replace placeholders with fake data
        $message = str_replace('{{amount}}', $this->faker->randomFloat(2, 10, 10000), $message);
        $message = str_replace('{{customer}}', $this->faker->name(), $message);
        $message = str_replace('{{user}}', $this->faker->userName(), $message);
        $message = str_replace('{{time}}', $this->faker->time(), $message);
        $message = str_replace('{{date}}', $this->faker->date(), $message);
        $message = str_replace('{{order}}', $this->faker->bothify('PO-###'), $message);
        $message = str_replace('{{product}}', $this->faker->word(), $message);
        $message = str_replace('{{stock}}', $this->faker->numberBetween(1, 10), $message);
        $message = str_replace('{{days}}', $this->faker->numberBetween(1, 30), $message);
        $message = str_replace('{{percent}}', $this->faker->numberBetween(80, 95), $message);
        $message = str_replace('{{transaction}}', $this->faker->uuid(), $message);
        $message = str_replace('{{error}}', $this->faker->sentence(), $message);
        $message = str_replace('{{service}}', $this->faker->word(), $message);
        $message = str_replace('{{form}}', $this->faker->word(), $message);
        $message = str_replace('{{field}}', $this->faker->word(), $message);
        $message = str_replace('{{report}}', $this->faker->word(), $message);
        
        $isRead = $this->faker->boolean(30); // 30% chance of being read
        
        return [
            'user_id' => \App\Models\User::factory(),
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => [
                'source' => $this->faker->randomElement(['system', 'user', 'automated']),
                'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
                'category' => $this->faker->randomElement(['inventory', 'sales', 'purchases', 'payments', 'system']),
            ],
            'read' => $isRead,
            'read_at' => $isRead ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
    
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => false,
            'read_at' => null,
        ]);
    }
    
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => true,
            'read_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }
    
    public function info(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'info',
        ]);
    }
    
    public function success(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'success',
        ]);
    }
    
    public function warning(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'warning',
        ]);
    }
    
    public function error(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'error',
        ]);
    }
}
