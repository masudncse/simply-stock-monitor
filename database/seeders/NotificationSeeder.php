<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            return;
        }

        $sampleNotifications = [
            [
                'type' => 'warning',
                'title' => 'Low Stock Alert',
                'message' => 'Product "Laptop" is running low on stock (5 items remaining)',
                'data' => ['product_id' => 1, 'current_stock' => 5, 'threshold' => 10],
            ],
            [
                'type' => 'success',
                'title' => 'New Sale',
                'message' => 'A new sale of $1,250.00 has been recorded',
                'data' => ['sale_id' => 1, 'amount' => 1250.00],
            ],
            [
                'type' => 'info',
                'title' => 'Payment Received',
                'message' => 'Payment of $500.00 received from customer John Doe',
                'data' => ['payment_id' => 1, 'amount' => 500.00, 'customer' => 'John Doe'],
            ],
            [
                'type' => 'info',
                'title' => 'System Update',
                'message' => 'System maintenance completed successfully',
                'data' => ['maintenance_id' => 1],
            ],
            [
                'type' => 'warning',
                'title' => 'Expired Product',
                'message' => 'Product "Milk" has expired and needs to be removed from inventory',
                'data' => ['product_id' => 2, 'expiry_date' => '2024-09-25'],
            ],
            [
                'type' => 'success',
                'title' => 'Purchase Order Approved',
                'message' => 'Purchase order #PO-001 has been approved and is ready for processing',
                'data' => ['purchase_id' => 1, 'order_number' => 'PO-001'],
            ],
        ];

        foreach ($users as $user) {
            // Create 3-6 random notifications for each user
            $notificationCount = rand(3, 6);
            $selectedNotifications = array_rand($sampleNotifications, $notificationCount);
            
            if (!is_array($selectedNotifications)) {
                $selectedNotifications = [$selectedNotifications];
            }

            foreach ($selectedNotifications as $index) {
                $notification = $sampleNotifications[$index];
                $isRead = rand(0, 1) === 1; // Random read status
                
                Notification::create([
                    'user_id' => $user->id,
                    'type' => $notification['type'],
                    'title' => $notification['title'],
                    'message' => $notification['message'],
                    'data' => $notification['data'],
                    'read' => $isRead,
                    'read_at' => $isRead ? now()->subDays(rand(1, 7)) : null,
                    'created_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
}
