<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Stock;
use App\Models\Product;
use App\Models\User;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create low stock notifications for all users
     */
    public function createLowStockNotifications(): int
    {
        $createdCount = 0;
        
        try {
            // Get the low stock threshold from system settings
            $lowStockThreshold = (int) SystemSetting::get('low_stock_threshold', 10);
            
            // Find all products with low stock across all warehouses
            $lowStockItems = Stock::select([
                    'stocks.*',
                    'products.name as product_name',
                    'warehouses.name as warehouse_name',
                    DB::raw('SUM(stocks.qty) as total_qty'),
                    DB::raw($lowStockThreshold . ' as threshold')
                ])
                ->join('products', 'stocks.product_id', '=', 'products.id')
                ->join('warehouses', 'stocks.warehouse_id', '=', 'warehouses.id')
                ->where('products.is_active', true)
                ->groupBy('stocks.product_id')
                ->havingRaw('SUM(stocks.qty) <= ?', [$lowStockThreshold])
                ->get();

            // Get all active users
            $users = User::where('is_active', true)->get();

            foreach ($lowStockItems as $stock) {
                // Create notification for each user
                foreach ($users as $user) {
                    // Check if notification already exists for this product and user
                    $existingNotification = Notification::where('user_id', $user->id)
                        ->where('type', 'low_stock')
                        ->whereJsonContains('data->product_id', $stock->product_id)
                        ->where('read', false)
                        ->whereDate('created_at', today())
                        ->first();

                    if (!$existingNotification) {
                        Notification::create([
                            'user_id' => $user->id,
                            'type' => 'low_stock',
                            'title' => 'Low Stock Alert',
                            'message' => "{$stock->product_name} is running low. Current stock: {$stock->total_qty}, Threshold: {$lowStockThreshold}",
                            'data' => [
                                'product_id' => $stock->product_id,
                                'product_name' => $stock->product_name,
                                'current_stock' => $stock->total_qty,
                                'threshold' => $lowStockThreshold,
                                'warehouse_name' => $stock->warehouse_name,
                                'severity' => 'warning'
                            ],
                            'read' => false,
                        ]);
                        $createdCount++;
                    }
                }
            }

            Log::info("Created {$createdCount} low stock notifications");
            return $createdCount;

        } catch (\Exception $e) {
            Log::error('Error creating low stock notifications: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Create expired product notifications for all users
     */
    public function createExpiredProductNotifications(): int
    {
        $createdCount = 0;
        
        try {
            // Find expired products (stocks with expiry_date in the past and qty > 0)
            $expiredStocks = Stock::select([
                    'stocks.*',
                    'products.name as product_name',
                    'warehouses.name as warehouse_name'
                ])
                ->join('products', 'stocks.product_id', '=', 'products.id')
                ->join('warehouses', 'stocks.warehouse_id', '=', 'warehouses.id')
                ->where('products.is_active', true)
                ->whereNotNull('stocks.expiry_date')
                ->where('stocks.expiry_date', '<', now())
                ->where('stocks.qty', '>', 0)
                ->get();

            // Get all active users
            $users = User::where('is_active', true)->get();

            foreach ($expiredStocks as $stock) {
                // Create notification for each user
                foreach ($users as $user) {
                    // Check if notification already exists for this stock batch and user
                    $existingNotification = Notification::where('user_id', $user->id)
                        ->where('type', 'expired_product')
                        ->whereJsonContains('data->stock_id', $stock->id)
                        ->where('read', false)
                        ->whereDate('created_at', today())
                        ->first();

                    if (!$existingNotification) {
                        $daysExpired = now()->diffInDays($stock->expiry_date);
                        
                        Notification::create([
                            'user_id' => $user->id,
                            'type' => 'expired_product',
                            'title' => 'Expired Product Alert',
                            'message' => "{$stock->product_name} (Batch: {$stock->batch}) expired {$daysExpired} day(s) ago on {$stock->expiry_date->format('M j, Y')} in {$stock->warehouse_name}. Quantity: {$stock->qty}",
                            'data' => [
                                'stock_id' => $stock->id,
                                'product_id' => $stock->product_id,
                                'product_name' => $stock->product_name,
                                'batch' => $stock->batch,
                                'expiry_date' => $stock->expiry_date->format('Y-m-d'),
                                'qty' => $stock->qty,
                                'warehouse_name' => $stock->warehouse_name,
                                'days_expired' => $daysExpired,
                                'severity' => 'warning'
                            ],
                            'read' => false,
                        ]);
                        $createdCount++;
                    }
                }
            }

            Log::info("Created {$createdCount} expired product notifications");
            return $createdCount;

        } catch (\Exception $e) {
            Log::error('Error creating expired product notifications: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Create low stock notification for a specific product (event-based)
     */
    public function createLowStockNotificationForProduct(int $productId, int $userId = null): bool
    {
        try {
            $product = Product::with('stocks.warehouse')->find($productId);
            if (!$product || !$product->is_active) {
                return false;
            }

            // Get the low stock threshold from system settings
            $lowStockThreshold = (int) SystemSetting::get('low_stock_threshold', 10);
            $totalStock = $product->stocks->sum('qty');
            
            if ($totalStock <= $lowStockThreshold) {
                // If no specific user, create for all active users
                $users = $userId ? User::where('id', $userId)->get() : User::where('is_active', true)->get();
                
                foreach ($users as $user) {
                    // Check if notification already exists
                    $existingNotification = Notification::where('user_id', $user->id)
                        ->where('type', 'low_stock')
                        ->whereJsonContains('data->product_id', $productId)
                        ->where('read', false)
                        ->where('created_at', '>', now()->subHours(1)) // Prevent spam within 1 hour
                        ->first();

                    if (!$existingNotification) {
                        Notification::create([
                            'user_id' => $user->id,
                            'type' => 'low_stock',
                            'title' => 'Low Stock Alert',
                            'message' => "{$product->name} is running low. Current stock: {$totalStock}, Threshold: {$lowStockThreshold}",
                            'data' => [
                                'product_id' => $productId,
                                'product_name' => $product->name,
                                'current_stock' => $totalStock,
                                'threshold' => $lowStockThreshold,
                                'severity' => 'warning'
                            ],
                            'read' => false,
                        ]);
                    }
                }
                return true;
            }
            
            return false;

        } catch (\Exception $e) {
            Log::error('Error creating low stock notification for product: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create expired product notification for a specific stock (event-based)
     */
    public function createExpiredProductNotificationForStock(int $stockId, int $userId = null): bool
    {
        try {
            $stock = Stock::with(['product', 'warehouse'])->find($stockId);
            if (!$stock || !$stock->product->is_active || !$stock->expiry_date || $stock->expiry_date >= now() || $stock->qty <= 0) {
                return false;
            }

            // If no specific user, create for all active users
            $users = $userId ? User::where('id', $userId)->get() : User::where('is_active', true)->get();
            
            foreach ($users as $user) {
                // Check if notification already exists
                $existingNotification = Notification::where('user_id', $user->id)
                    ->where('type', 'expired_product')
                    ->whereJsonContains('data->stock_id', $stockId)
                    ->where('read', false)
                    ->where('created_at', '>', now()->subHours(1)) // Prevent spam within 1 hour
                    ->first();

                if (!$existingNotification) {
                    $daysExpired = now()->diffInDays($stock->expiry_date);
                    
                    Notification::create([
                        'user_id' => $user->id,
                        'type' => 'expired_product',
                        'title' => 'Expired Product Alert',
                        'message' => "{$stock->product->name} (Batch: {$stock->batch}) expired {$daysExpired} day(s) ago on {$stock->expiry_date->format('M j, Y')} in {$stock->warehouse->name}. Quantity: {$stock->qty}",
                        'data' => [
                            'stock_id' => $stockId,
                            'product_id' => $stock->product_id,
                            'product_name' => $stock->product->name,
                            'batch' => $stock->batch,
                            'expiry_date' => $stock->expiry_date->format('Y-m-d'),
                            'qty' => $stock->qty,
                            'warehouse_name' => $stock->warehouse->name,
                            'days_expired' => $daysExpired,
                            'severity' => 'warning'
                        ],
                        'read' => false,
                    ]);
                }
            }
            return true;

        } catch (\Exception $e) {
            Log::error('Error creating expired product notification for stock: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Clean up old notifications (older than 30 days)
     */
    public function cleanupOldNotifications(): int
    {
        try {
            $deletedCount = Notification::where('created_at', '<', now()->subDays(30))->delete();
            Log::info("Cleaned up {$deletedCount} old notifications");
            return $deletedCount;
        } catch (\Exception $e) {
            Log::error('Error cleaning up old notifications: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get notification statistics
     */
    public function getNotificationStats(): array
    {
        return [
            'total_notifications' => Notification::count(),
            'unread_notifications' => Notification::where('read', false)->count(),
            'low_stock_notifications' => Notification::where('type', 'low_stock')->where('read', false)->count(),
            'expired_product_notifications' => Notification::where('type', 'expired_product')->where('read', false)->count(),
        ];
    }
}
