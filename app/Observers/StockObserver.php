<?php

namespace App\Observers;

use App\Models\Stock;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class StockObserver
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the Stock "created" event.
     */
    public function created(Stock $stock): void
    {
        $this->checkExpiredProduct($stock);
    }

    /**
     * Handle the Stock "updated" event.
     */
    public function updated(Stock $stock): void
    {
        // Check if quantity was changed
        if ($stock->wasChanged('qty')) {
            $this->checkLowStock($stock);
        }

        // Check if expiry date was changed
        if ($stock->wasChanged('expiry_date')) {
            $this->checkExpiredProduct($stock);
        }
    }

    /**
     * Handle the Stock "deleted" event.
     */
    public function deleted(Stock $stock): void
    {
        // No action needed on delete
    }

    /**
     * Handle the Stock "restored" event.
     */
    public function restored(Stock $stock): void
    {
        $this->checkLowStock($stock);
        $this->checkExpiredProduct($stock);
    }

    /**
     * Handle the Stock "force deleted" event.
     */
    public function forceDeleted(Stock $stock): void
    {
        // No action needed on force delete
    }

    /**
     * Check for low stock alert
     */
    private function checkLowStock(Stock $stock): void
    {
        try {
            // Check if this product is now low on stock
            $this->notificationService->createLowStockNotificationForProduct($stock->product_id);
        } catch (\Exception $e) {
            Log::error('Error checking low stock in observer: ' . $e->getMessage());
        }
    }

    /**
     * Check for expired product alert
     */
    private function checkExpiredProduct(Stock $stock): void
    {
        try {
            // Check if this stock is expired
            if ($stock->expiry_date && $stock->expiry_date < now() && $stock->qty > 0) {
                $this->notificationService->createExpiredProductNotificationForStock($stock->id);
            }
        } catch (\Exception $e) {
            Log::error('Error checking expired product in observer: ' . $e->getMessage());
        }
    }
}
