<?php

namespace App\Services;

use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Models\Stock;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class SaleReturnService
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new sale return
     */
    public function createSaleReturn(array $returnData, array $items, int $userId): SaleReturn
    {
        return DB::transaction(function () use ($returnData, $items, $userId) {
            // Generate return number
            $returnNumber = $this->generateReturnNumber();

            $saleReturn = SaleReturn::create([
                'return_number' => $returnNumber,
                'sale_id' => $returnData['sale_id'],
                'customer_id' => $returnData['customer_id'] ?? null,
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
                SaleReturnItem::create([
                    'sale_return_id' => $saleReturn->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'batch' => $item['batch'] ?? null,
                ]);
            }

            return $saleReturn;
        });
    }

    /**
     * Approve a sale return
     */
    public function approveSaleReturn(SaleReturn $saleReturn): SaleReturn
    {
        if ($saleReturn->status !== 'draft' && $saleReturn->status !== 'pending') {
            throw new \Exception('Only draft or pending returns can be approved');
        }

        return DB::transaction(function () use ($saleReturn) {
            // Add returned items back to stock
            foreach ($saleReturn->items as $item) {
                $this->stockService->updateStock(
                    $item->product_id,
                    $saleReturn->warehouse_id,
                    $item->quantity, // Positive quantity to add back
                    $item->batch,
                    null,
                    $item->unit_price
                );
            }

            // Update status
            $saleReturn->status = 'approved';
            $saleReturn->save();

            // Create accounting transactions
            $this->createSaleReturnTransactions($saleReturn);

            return $saleReturn;
        });
    }

    /**
     * Create accounting transactions for sale return
     */
    protected function createSaleReturnTransactions(SaleReturn $saleReturn): void
    {
        $sale = $saleReturn->sale;

        // Debit: Sales Returns & Allowances (contra-revenue)
        $salesReturnsAccount = Account::where('code', '4100')->first();
        if ($salesReturnsAccount) {
            Transaction::create([
                'account_id' => $salesReturnsAccount->id,
                'transaction_date' => $saleReturn->return_date,
                'reference_type' => 'sale_return',
                'reference_id' => $saleReturn->id,
                'debit' => $saleReturn->total_amount,
                'credit' => 0,
                'description' => "Sale return #{$saleReturn->return_number}",
                'created_by' => $saleReturn->created_by,
            ]);
        }

        // Credit: Accounts Receivable (or Cash)
        if ($sale->customer_id) {
            $receivableAccount = Account::where('code', '1200')->first();
            if ($receivableAccount) {
                Transaction::create([
                    'account_id' => $receivableAccount->id,
                    'transaction_date' => $saleReturn->return_date,
                    'reference_type' => 'sale_return',
                    'reference_id' => $saleReturn->id,
                    'debit' => 0,
                    'credit' => $saleReturn->total_amount,
                    'description' => "Sale return #{$saleReturn->return_number}",
                    'created_by' => $saleReturn->created_by,
                ]);
            }
        }

        // Debit: Inventory (add back inventory value)
        $inventoryAccount = Account::where('code', '1300')->first();
        if ($inventoryAccount) {
            $inventoryValue = $saleReturn->items->sum(function ($item) {
                return $item->quantity * $item->product->cost_price;
            });

            Transaction::create([
                'account_id' => $inventoryAccount->id,
                'transaction_date' => $saleReturn->return_date,
                'reference_type' => 'sale_return',
                'reference_id' => $saleReturn->id,
                'debit' => $inventoryValue,
                'credit' => 0,
                'description' => "Inventory increase from return",
                'created_by' => $saleReturn->created_by,
            ]);
        }

        // Credit: Cost of Goods Sold (reverse COGS)
        $cogsAccount = Account::where('code', '5000')->first();
        if ($cogsAccount) {
            $inventoryValue = $saleReturn->items->sum(function ($item) {
                return $item->quantity * $item->product->cost_price;
            });

            Transaction::create([
                'account_id' => $cogsAccount->id,
                'transaction_date' => $saleReturn->return_date,
                'reference_type' => 'sale_return',
                'reference_id' => $saleReturn->id,
                'debit' => 0,
                'credit' => $inventoryValue,
                'description' => "COGS reversal for return",
                'created_by' => $saleReturn->created_by,
            ]);
        }
    }

    /**
     * Generate unique return number
     */
    protected function generateReturnNumber(): string
    {
        $lastReturn = SaleReturn::orderBy('id', 'desc')->first();
        $nextNumber = $lastReturn ? $lastReturn->id + 1 : 1;
        
        return 'SR-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Process refund for sale return
     */
    public function processRefund(SaleReturn $saleReturn, array $refundData): SaleReturn
    {
        if ($saleReturn->refund_status === 'completed') {
            throw new \Exception('Refund already processed');
        }

        return DB::transaction(function () use ($saleReturn, $refundData) {
            // Update refund details
            $saleReturn->update([
                'refund_status' => 'completed',
                'refund_method' => $refundData['refund_method'],
                'refund_date' => $refundData['refund_date'],
                'refunded_amount' => $refundData['refunded_amount'],
            ]);

            // Create refund transaction if cash/bank refund
            if (in_array($refundData['refund_method'], ['cash', 'bank'])) {
                $this->createRefundTransaction($saleReturn, $refundData);
            }

            return $saleReturn;
        });
    }

    /**
     * Create refund transaction (for cash/bank refunds)
     */
    protected function createRefundTransaction(SaleReturn $saleReturn, array $refundData): void
    {
        $accountCode = $refundData['refund_method'] === 'cash' ? '1000' : '1100';
        $account = Account::where('code', $accountCode)->first();

        if ($account) {
            Transaction::create([
                'account_id' => $account->id,
                'transaction_date' => $refundData['refund_date'],
                'reference_type' => 'sale_return_refund',
                'reference_id' => $saleReturn->id,
                'debit' => 0,
                'credit' => $refundData['refunded_amount'],
                'description' => "Refund for return #{$saleReturn->return_number} ({$refundData['refund_method']})",
                'created_by' => auth()->id(),
            ]);
        }
    }

    /**
     * Delete a sale return
     */
    public function deleteSaleReturn(SaleReturn $saleReturn): void
    {
        if ($saleReturn->status === 'approved') {
            throw new \Exception('Cannot delete approved sale return');
        }

        DB::transaction(function () use ($saleReturn) {
            $saleReturn->items()->delete();
            $saleReturn->delete();
        });
    }
}


