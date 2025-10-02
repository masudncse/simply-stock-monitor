<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Stock;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;

class SaleService
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new sale
     */
    public function createSale(array $saleData, array $items, int $userId): Sale
    {
        return DB::transaction(function () use ($saleData, $items, $userId) {
            // Generate invoice number
            $invoiceNumber = $this->generateInvoiceNumber();

            // Check if approval is required
            $requireApproval = SystemSetting::get('require_approval_for_sales', false);
            $initialStatus = $requireApproval ? 'pending' : 'draft';

            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,
                'customer_id' => $saleData['customer_id'] ?? null,
                'warehouse_id' => $saleData['warehouse_id'],
                'sale_date' => $saleData['sale_date'],
                'subtotal' => $saleData['subtotal'],
                'tax_amount' => $saleData['tax_amount'] ?? 0,
                'discount_amount' => $saleData['discount_amount'] ?? 0,
                'total_amount' => $saleData['total_amount'],
                'status' => $initialStatus,
                'payment_status' => 'pending',
                'notes' => $saleData['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Create sale items
            foreach ($items as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'batch' => $item['batch'] ?? null,
                ]);
            }

            return $sale;
        });
    }

    /**
     * Process/Complete a sale
     */
    public function processSale(int $saleId): Sale
    {
        return DB::transaction(function () use ($saleId) {
            $sale = Sale::with('items')->findOrFail($saleId);

            if ($sale->status !== 'draft') {
                throw new \Exception('Sale is not in draft status');
            }

            // Check stock availability and reduce stock
            foreach ($sale->items as $item) {
                $this->reduceStockForSale($item, $sale->warehouse_id);
            }

            // Update sale status
            $sale->status = 'completed';
            $sale->save();

            // Create accounting transactions
            $this->createSaleTransactions($sale);

            return $sale;
        });
    }

    /**
     * Reduce stock for sale item
     */
    protected function reduceStockForSale(SaleItem $item, int $warehouseId): void
    {
        $stock = Stock::where('product_id', $item->product_id)
            ->where('warehouse_id', $warehouseId)
            ->where('batch', $item->batch)
            ->first();

        if (!$stock || $stock->qty < $item->quantity) {
            $product = \App\Models\Product::find($item->product_id);
            $productName = $product ? $product->name : "Unknown Product";
            $availableQty = $stock ? $stock->qty : 0;
            
            throw new InsufficientStockException(
                $item->product_id,
                $productName,
                $item->quantity,
                $availableQty
            );
        }

        $stock->qty -= $item->quantity;
        $stock->save();
    }

    /**
     * Create accounting transactions for sale
     */
    protected function createSaleTransactions(Sale $sale): void
    {
        // Debit: Accounts Receivable (if customer) or Cash
        if ($sale->customer_id) {
            $receivableAccount = Account::where('code', '1200')->first();
            if ($receivableAccount) {
                Transaction::create([
                    'account_id' => $receivableAccount->id,
                    'transaction_date' => $sale->sale_date,
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'debit' => $sale->total_amount,
                    'credit' => 0,
                    'description' => "Sale to {$sale->customer->name}",
                    'created_by' => $sale->created_by,
                ]);
            }
        } else {
            $cashAccount = Account::where('code', '1000')->first();
            if ($cashAccount) {
                Transaction::create([
                    'account_id' => $cashAccount->id,
                    'transaction_date' => $sale->sale_date,
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'debit' => $sale->total_amount,
                    'credit' => 0,
                    'description' => "Cash sale",
                    'created_by' => $sale->created_by,
                ]);
            }
        }

        // Credit: Sales Revenue
        $salesAccount = Account::where('code', '4000')->first();
        if ($salesAccount) {
            Transaction::create([
                'account_id' => $salesAccount->id,
                'transaction_date' => $sale->sale_date,
                'reference_type' => 'sale',
                'reference_id' => $sale->id,
                'debit' => 0,
                'credit' => $sale->total_amount,
                'description' => "Sale revenue",
                'created_by' => $sale->created_by,
            ]);
        }

        // Debit: Cost of Goods Sold
        $cogsAccount = Account::where('code', '5000')->first();
        if ($cogsAccount) {
            $totalCost = $sale->items->sum(function ($item) {
                return $item->quantity * $item->product->cost_price;
            });

            Transaction::create([
                'account_id' => $cogsAccount->id,
                'transaction_date' => $sale->sale_date,
                'reference_type' => 'sale',
                'reference_id' => $sale->id,
                'debit' => $totalCost,
                'credit' => 0,
                'description' => "Cost of goods sold",
                'created_by' => $sale->created_by,
            ]);
        }

        // Credit: Inventory
        $inventoryAccount = Account::where('code', '1300')->first();
        if ($inventoryAccount) {
            $totalCost = $sale->items->sum(function ($item) {
                return $item->quantity * $item->product->cost_price;
            });

            Transaction::create([
                'account_id' => $inventoryAccount->id,
                'transaction_date' => $sale->sale_date,
                'reference_type' => 'sale',
                'reference_id' => $sale->id,
                'debit' => 0,
                'credit' => $totalCost,
                'description' => "Inventory reduction",
                'created_by' => $sale->created_by,
            ]);
        }
    }

    /**
     * Generate unique invoice number
     */
    protected function generateInvoiceNumber(): string
    {
        $lastSale = Sale::orderBy('id', 'desc')->first();
        $nextNumber = $lastSale ? $lastSale->id + 1 : 1;
        
        return 'SAL-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate sale totals
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

    /**
     * Process payment for sale
     */
    public function processPayment(int $saleId, float $amount, string $paymentMode = 'cash'): void
    {
        DB::transaction(function () use ($saleId, $amount, $paymentMode) {
            $sale = Sale::findOrFail($saleId);
            
            $sale->paid_amount += $amount;
            
            if ($sale->paid_amount >= $sale->total_amount) {
                $sale->payment_status = 'paid';
            } elseif ($sale->paid_amount > 0) {
                $sale->payment_status = 'partial';
            }
            
            $sale->save();
        });
    }

    /**
     * Approve a sale
     */
    public function approveSale(Sale $sale): Sale
    {
        if ($sale->status !== 'pending') {
            throw new \Exception('Only pending sales can be approved');
        }

        return DB::transaction(function () use ($sale) {
            // Check stock availability and reduce stock
            foreach ($sale->items as $item) {
                $this->reduceStockForSale($item, $sale->warehouse_id);
            }

            // Update sale status
            $sale->status = 'approved';
            $sale->save();

            // Create accounting transactions
            $this->createSaleTransactions($sale);

            return $sale;
        });
    }

    /**
     * Update a sale
     */
    public function updateSale(Sale $sale, array $saleData, array $items = null): Sale
    {
        return DB::transaction(function () use ($sale, $saleData, $items) {
            // Update sale data
            $sale->update($saleData);

            // Update items if provided
            if ($items !== null) {
                // Delete existing items
                $sale->items()->delete();

                // Create new items
                foreach ($items as $itemData) {
                    $sale->items()->create([
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                        'batch' => $itemData['batch'] ?? null,
                    ]);
                }
            }

            return $sale->fresh(['items.product']);
        });
    }

    /**
     * Delete a sale
     */
    public function deleteSale(Sale $sale): void
    {
        if ($sale->status === 'approved' || $sale->status === 'completed') {
            throw new \Exception('Cannot delete approved or completed sale');
        }

        DB::transaction(function () use ($sale) {
            $sale->items()->delete();
            $sale->delete();
        });
    }
}
