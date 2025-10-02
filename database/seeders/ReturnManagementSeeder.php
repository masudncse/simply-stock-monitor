<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\SaleReturn;
use App\Models\PurchaseReturn;
use App\Models\User;
use App\Services\SaleReturnService;
use App\Services\PurchaseReturnService;
use App\Services\StockService;

class ReturnManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stockService = new StockService();
        $saleReturnService = new SaleReturnService($stockService);
        $purchaseReturnService = new PurchaseReturnService($stockService);
        
        $adminUser = User::first();

        if (!$adminUser) {
            $this->command->warn('Admin user not found. Skipping return management seeder.');
            return;
        }

        // Create sample sale returns
        $approvedSales = Sale::where('status', 'approved')
            ->orWhere('status', 'completed')
            ->with('items')
            ->limit(2)
            ->get();

        foreach ($approvedSales as $sale) {
            if ($sale->items->count() === 0) continue;

            // Return first item from the sale
            $firstItem = $sale->items->first();
            
            $returnData = [
                'sale_id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'warehouse_id' => $sale->warehouse_id,
                'return_date' => now()->toDateString(),
                'reason' => 'defective',
                'notes' => 'Sample return - Product was defective',
                'subtotal' => $firstItem->unit_price * 1,
                'tax_amount' => 0,
                'total_amount' => $firstItem->unit_price * 1,
            ];

            $items = [
                [
                    'product_id' => $firstItem->product_id,
                    'quantity' => 1,
                    'unit_price' => $firstItem->unit_price,
                    'total_price' => $firstItem->unit_price * 1,
                    'batch' => $firstItem->batch,
                ]
            ];

            try {
                $saleReturnService->createSaleReturn($returnData, $items, $adminUser->id);
            } catch (\Exception $e) {
                $this->command->warn("Could not create sale return: " . $e->getMessage());
            }
        }

        // Create sample purchase returns
        $approvedPurchases = Purchase::where('status', 'approved')
            ->with('items')
            ->limit(2)
            ->get();

        foreach ($approvedPurchases as $purchase) {
            if ($purchase->items->count() === 0) continue;

            // Return first item from the purchase
            $firstItem = $purchase->items->first();
            
            $returnData = [
                'purchase_id' => $purchase->id,
                'supplier_id' => $purchase->supplier_id,
                'warehouse_id' => $purchase->warehouse_id,
                'return_date' => now()->toDateString(),
                'reason' => 'quality_issue',
                'notes' => 'Sample return - Quality did not meet standards',
                'subtotal' => $firstItem->unit_price * 1,
                'tax_amount' => 0,
                'total_amount' => $firstItem->unit_price * 1,
            ];

            $items = [
                [
                    'product_id' => $firstItem->product_id,
                    'quantity' => 1,
                    'unit_price' => $firstItem->unit_price,
                    'total_price' => $firstItem->unit_price * 1,
                    'batch' => $firstItem->batch,
                ]
            ];

            try {
                $purchaseReturnService->createPurchaseReturn($returnData, $items, $adminUser->id);
            } catch (\Exception $e) {
                $this->command->warn("Could not create purchase return: " . $e->getMessage());
            }
        }

        $this->command->info('Return management sample data seeded successfully!');
    }
}
