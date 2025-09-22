<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Stock;
use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new purchase order
     */
    public function createPurchase(array $purchaseData, array $items, int $userId): Purchase
    {
        return DB::transaction(function () use ($purchaseData, $items, $userId) {
            // Generate invoice number
            $invoiceNumber = $this->generateInvoiceNumber();

            $purchase = Purchase::create([
                'invoice_number' => $invoiceNumber,
                'supplier_id' => $purchaseData['supplier_id'],
                'warehouse_id' => $purchaseData['warehouse_id'],
                'purchase_date' => $purchaseData['purchase_date'],
                'due_date' => $purchaseData['due_date'] ?? null,
                'subtotal' => $purchaseData['subtotal'],
                'tax_amount' => $purchaseData['tax_amount'] ?? 0,
                'discount_amount' => $purchaseData['discount_amount'] ?? 0,
                'total_amount' => $purchaseData['total_amount'],
                'status' => 'draft',
                'notes' => $purchaseData['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Create purchase items
            foreach ($items as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'batch' => $item['batch'] ?? null,
                    'expiry_date' => $item['expiry_date'] ?? null,
                ]);
            }

            return $purchase;
        });
    }

    /**
     * Confirm/Complete a purchase order
     */
    public function confirmPurchase(int $purchaseId): Purchase
    {
        return DB::transaction(function () use ($purchaseId) {
            $purchase = Purchase::with('items')->findOrFail($purchaseId);

            if ($purchase->status !== 'draft') {
                throw new \Exception('Purchase order is not in draft status');
            }

            // Update stock for each item
            foreach ($purchase->items as $item) {
                $this->stockService->updateStock(
                    $item->product_id,
                    $purchase->warehouse_id,
                    $item->quantity,
                    $item->batch,
                    $item->expiry_date,
                    $item->unit_price
                );
            }

            // Update purchase status
            $purchase->status = 'completed';
            $purchase->save();

            // Create accounting transactions
            $this->createPurchaseTransactions($purchase);

            return $purchase;
        });
    }

    /**
     * Create accounting transactions for purchase
     */
    protected function createPurchaseTransactions(Purchase $purchase): void
    {
        // Debit: Inventory Account
        $inventoryAccount = Account::where('code', '1300')->first();
        if ($inventoryAccount) {
            Transaction::create([
                'account_id' => $inventoryAccount->id,
                'transaction_date' => $purchase->purchase_date,
                'reference_type' => 'purchase',
                'reference_id' => $purchase->id,
                'debit' => $purchase->total_amount,
                'credit' => 0,
                'description' => "Purchase from {$purchase->supplier->name}",
                'created_by' => $purchase->created_by,
            ]);
        }

        // Credit: Accounts Payable
        $payableAccount = Account::where('code', '2000')->first();
        if ($payableAccount) {
            Transaction::create([
                'account_id' => $payableAccount->id,
                'transaction_date' => $purchase->purchase_date,
                'reference_type' => 'purchase',
                'reference_id' => $purchase->id,
                'debit' => 0,
                'credit' => $purchase->total_amount,
                'description' => "Purchase from {$purchase->supplier->name}",
                'created_by' => $purchase->created_by,
            ]);
        }
    }

    /**
     * Generate unique invoice number
     */
    protected function generateInvoiceNumber(): string
    {
        $lastPurchase = Purchase::orderBy('id', 'desc')->first();
        $nextNumber = $lastPurchase ? $lastPurchase->id + 1 : 1;
        
        return 'PUR-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate purchase totals
     */
    public function calculateTotals(array $items, float $taxRate = 0, float $discountAmount = 0): array
    {
        $subtotal = array_sum(array_column($items, 'total_price'));
        $taxAmount = $subtotal * ($taxRate / 100);
        $totalAmount = $subtotal + $taxAmount - $discountAmount;

        return [
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
        ];
    }
}
