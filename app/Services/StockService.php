<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Update stock quantity for a product in a warehouse
     */
    public function updateStock(int $productId, int $warehouseId, float $quantity, ?string $batch = null, ?string $expiryDate = null, ?float $costPrice = null): Stock
    {
        return DB::transaction(function () use ($productId, $warehouseId, $quantity, $batch, $expiryDate, $costPrice) {
            $stock = Stock::where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->where('batch', $batch)
                ->first();

            if ($stock) {
                $stock->qty += $quantity;
                if ($costPrice) {
                    $stock->cost_price = $costPrice;
                }
                $stock->save();
            } else {
                $stock = Stock::create([
                    'product_id' => $productId,
                    'warehouse_id' => $warehouseId,
                    'qty' => $quantity,
                    'batch' => $batch,
                    'expiry_date' => $expiryDate,
                    'cost_price' => $costPrice ?? 0,
                ]);
            }

            return $stock;
        });
    }

    /**
     * Transfer stock between warehouses
     */
    public function transferStock(int $productId, int $fromWarehouseId, int $toWarehouseId, float $quantity, ?string $batch = null): array
    {
        return DB::transaction(function () use ($productId, $fromWarehouseId, $toWarehouseId, $quantity, $batch) {
            // Check if source warehouse has enough stock
            $sourceStock = Stock::where('product_id', $productId)
                ->where('warehouse_id', $fromWarehouseId)
                ->where('batch', $batch)
                ->first();

            if (!$sourceStock || $sourceStock->qty < $quantity) {
                throw new \Exception('Insufficient stock in source warehouse');
            }

            // Reduce stock from source warehouse
            $sourceStock->qty -= $quantity;
            $sourceStock->save();

            // Add stock to destination warehouse
            $destinationStock = $this->updateStock(
                $productId,
                $toWarehouseId,
                $quantity,
                $batch,
                $sourceStock->expiry_date,
                $sourceStock->cost_price
            );

            return [
                'source_stock' => $sourceStock,
                'destination_stock' => $destinationStock,
            ];
        });
    }

    /**
     * Get current stock for a product across all warehouses
     */
    public function getProductStock(int $productId): array
    {
        return Stock::where('product_id', $productId)
            ->with(['warehouse', 'product'])
            ->get()
            ->groupBy('warehouse.name')
            ->map(function ($stocks) {
                return $stocks->sum('qty');
            })
            ->toArray();
    }

    /**
     * Get low stock products
     */
    public function getLowStockProducts(): array
    {
        return Product::whereHas('stocks', function ($query) {
            $query->selectRaw('SUM(qty) as total_qty')
                ->groupBy('product_id')
                ->havingRaw('SUM(qty) <= products.min_stock');
        })->with(['stocks.warehouse'])->get();
    }

    /**
     * Adjust stock manually (for corrections)
     */
    public function adjustStock(int $productId, int $warehouseId, float $newQuantity, ?string $batch = null, ?string $reason = null): Stock
    {
        return DB::transaction(function () use ($productId, $warehouseId, $newQuantity, $batch, $reason) {
            $stock = Stock::where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->where('batch', $batch)
                ->first();

            if ($stock) {
                $stock->qty = $newQuantity;
                $stock->save();
            } else {
                $stock = Stock::create([
                    'product_id' => $productId,
                    'warehouse_id' => $warehouseId,
                    'qty' => $newQuantity,
                    'batch' => $batch,
                ]);
            }

            // Log the adjustment (you can create a stock adjustment log table)
            // StockAdjustment::create([...]);

            return $stock;
        });
    }
}
