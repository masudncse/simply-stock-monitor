<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class CheckStockAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:check-alerts {--cleanup : Also cleanup old notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for low stock and expired product alerts and create notifications';

    /**
     * The notification service instance.
     *
     * @var NotificationService
     */
    protected $notificationService;

    /**
     * Create a new command instance.
     */
    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking stock alerts...');

        // Check for low stock alerts
        $this->info('Checking for low stock items...');
        $lowStockCount = $this->notificationService->createLowStockNotifications();
        $this->info("Created {$lowStockCount} low stock notifications");

        // Check for expired products
        $this->info('Checking for expired products...');
        $expiredCount = $this->notificationService->createExpiredProductNotifications();
        $this->info("Created {$expiredCount} expired product notifications");

        // Cleanup old notifications if requested
        if ($this->option('cleanup')) {
            $this->info('Cleaning up old notifications...');
            $cleanupCount = $this->notificationService->cleanupOldNotifications();
            $this->info("Cleaned up {$cleanupCount} old notifications");
        }

        // Show statistics
        $stats = $this->notificationService->getNotificationStats();
        $this->info('Notification Statistics:');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Notifications', $stats['total_notifications']],
                ['Unread Notifications', $stats['unread_notifications']],
                ['Low Stock Alerts', $stats['low_stock_notifications']],
                ['Expired Product Alerts', $stats['expired_product_notifications']],
            ]
        );

        $this->info('Stock alerts check completed successfully!');
        return 0;
    }
}
