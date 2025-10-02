<?php

namespace App\Services;

use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\Stock;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class PurchaseReturnService
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new purchase return
     */
    public function createPurchaseReturn(array $returnData, array $items, int $userId): PurchaseReturn
    {
        return DB::transaction(function () use ($returnData, $items, $userId) {
            // Generate return number
            $returnNumber = $this->generateReturnNumber();

            $purchaseReturn = PurchaseReturn::create([
                'return_number' => $returnNumber,
                'purchase_id' => $returnData['purchase_id'],
                'supplier_id' => $returnData['supplier_id'] ?? null,
                'warehouse_id' => $returnData['warehouse_id'],
                'return_date' => $returnData['return_date'],
                'subtotal' => $returnData['subtotal'],
                'tax_amount' => $returnData['tax_amount'] ?? 0,
                'total_amount' => $returnData['total_amount'],
                'status' => 'draft',
                'reason' => $returnData['reason'] ?? null,
                'notes' => $returnData['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Create return items
            foreach ($items as $item) {
                PurchaseReturnItem::create([
                    'purchase_return_id' => $purchaseReturn->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'batch' => $item['batch'] ?? null,
                ]);
            }

            return $purchaseReturn;
        });
    }

    /**
     * Approve a purchase return
     */
    public function approvePurchaseReturn(PurchaseReturn $purchaseReturn): PurchaseReturn
    {
        if ($purchaseReturn->status !== 'draft' && $purchaseReturn->status !== 'pending') {
            throw new \Exception('Only draft or pending returns can be approved');
        }

        return DB::transaction(function () use ($purchaseReturn) {
            // Remove returned items from stock
            foreach ($purchaseReturn->items as $item) {
                $stock = Stock::where('product_id', $item->product_id)
                    ->where('warehouse_id', $purchaseReturn->warehouse_id)
                    ->where('batch', $item->batch)
                    ->first();

                if ($stock && $stock->qty >= $item->quantity) {
                    $stock->qty -= $item->quantity;
                    $stock->save();
                } else {
                    throw new \Exception("Insufficient stock for product {$item->product->name}");
                }
            }

            // Update status
            $purchaseReturn->status = 'approved';
            $purchaseReturn->save();

            // Create accounting transactions
            $this->createPurchaseReturnTransactions($purchaseReturn);

            return $purchaseReturn;
        });
    }

    /**
     * Create accounting transactions for purchase return
     */
    protected function createPurchaseReturnTransactions(PurchaseReturn $purchaseReturn): void
    {
        // Debit: Accounts Payable (reduce what we owe)
        $payableAccount = Account::where('code', '2000')->first();
        if ($payableAccount) {
            Transaction::create([
                'account_id' => $payableAccount->id,
                'transaction_date' => $purchaseReturn->return_date,
                'reference_type' => 'purchase_return',
                'reference_id' => $purchaseReturn->id,
                'debit' => $purchaseReturn->total_amount,
                'credit' => 0,
                'description' => "Purchase return #{$purchaseReturn->return_number}",
                'created_by' => $purchaseReturn->created_by,
            ]);
        }

        // Credit: Inventory (reduce inventory value)
        $inventoryAccount = Account::where('code', '1300')->first();
        if ($inventoryAccount) {
            Transaction::create([
                'account_id' => $inventoryAccount->id,
                'transaction_date' => $purchaseReturn->return_date,
                'reference_type' => 'purchase_return',
                'reference_id' => $purchaseReturn->id,
                'debit' => 0,
                'credit' => $purchaseReturn->total_amount,
                'description' => "Inventory reduction from return",
                'created_by' => $purchaseReturn->created_by,
            ]);
        }
    }

    /**
     * Generate unique return number
     */
    protected function generateReturnNumber(): string
    {
        $lastReturn = PurchaseReturn::orderBy('id', 'desc')->first();
        $nextNumber = $lastReturn ? $lastReturn->id + 1 : 1;
        
        return 'PR-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Delete a purchase return
     */
    public function deletePurchaseReturn(PurchaseReturn $purchaseReturn): void
    {
        if ($purchaseReturn->status === 'approved') {
            throw new \Exception('Cannot delete approved purchase return');
        }

        DB::transaction(function () use ($purchaseReturn) {
            $purchaseReturn->items()->delete();
            $purchaseReturn->delete();
        });
    }
}

