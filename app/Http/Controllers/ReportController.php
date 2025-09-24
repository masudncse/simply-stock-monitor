<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the reports dashboard
     */
    public function index()
    {
        $this->authorize('view-reports');

        return Inertia::render('Reports/Index');
    }

    /**
     * Stock Report
     */
    public function stockReport(Request $request)
    {
        $this->authorize('view-reports');

        $query = Stock::with(['product', 'warehouse'])
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->where('products.is_active', true);

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $query->where('stocks.warehouse_id', $request->warehouse_id);
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('products.category_id', $request->category_id);
        }

        // Filter by low stock
        if ($request->filled('low_stock') && $request->low_stock) {
            $query->whereRaw('stocks.qty <= products.min_stock');
        }

        $stocks = $query->select('stocks.*')
            ->orderBy('products.name')
            ->get();

        // Calculate total valuation
        $totalValuation = $stocks->sum(function ($stock) {
            return $stock->qty * $stock->cost_price;
        });

        $warehouses = \App\Models\Warehouse::where('is_active', true)->get();
        $categories = \App\Models\Category::where('is_active', true)->get();

        return Inertia::render('Reports/StockReport', [
            'stocks' => $stocks,
            'totalValuation' => $totalValuation,
            'warehouses' => $warehouses,
            'categories' => $categories,
            'filters' => $request->only(['warehouse_id', 'category_id', 'low_stock']),
        ]);
    }

    /**
     * Sales Report
     */
    public function salesReport(Request $request)
    {
        $this->authorize('view-reports');

        $query = Sale::with(['customer', 'warehouse', 'items.product']);

        // Date range filter
        if ($request->filled('date_from')) {
            $query->where('sale_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('sale_date', '<=', $request->date_to);
        }

        // Customer filter
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Warehouse filter
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        $sales = $query->orderBy('sale_date', 'desc')->get();

        // Calculate summary
        $summary = [
            'total_sales' => $sales->count(),
            'total_amount' => (float) $sales->sum('total_amount'),
            'total_tax' => (float) $sales->sum('tax_amount'),
            'total_discount' => (float) $sales->sum('discount_amount'),
            'net_amount' => (float) ($sales->sum('total_amount') - $sales->sum('discount_amount')),
        ];

        $customers = Customer::where('is_active', true)->get();
        $warehouses = \App\Models\Warehouse::where('is_active', true)->get();

        return Inertia::render('Reports/SalesReport', [
            'sales' => $sales,
            'summary' => $summary,
            'customers' => $customers,
            'warehouses' => $warehouses,
            'filters' => $request->only(['date_from', 'date_to', 'customer_id', 'warehouse_id']),
        ]);
    }

    /**
     * Purchase Report
     */
    public function purchaseReport(Request $request)
    {
        $this->authorize('view-reports');

        $query = Purchase::with(['supplier', 'warehouse', 'items.product']);

        // Date range filter
        if ($request->filled('date_from')) {
            $query->where('purchase_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('purchase_date', '<=', $request->date_to);
        }

        // Supplier filter
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Warehouse filter
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        $purchases = $query->orderBy('purchase_date', 'desc')->get();

        // Calculate summary
        $summary = [
            'total_purchases' => $purchases->count(),
            'total_amount' => (float) $purchases->sum('total_amount'),
            'total_tax' => (float) $purchases->sum('tax_amount'),
            'total_discount' => (float) $purchases->sum('discount_amount'),
            'net_amount' => (float) ($purchases->sum('total_amount') - $purchases->sum('discount_amount')),
        ];

        $suppliers = Supplier::where('is_active', true)->get();
        $warehouses = \App\Models\Warehouse::where('is_active', true)->get();

        return Inertia::render('Reports/PurchaseReport', [
            'purchases' => $purchases,
            'summary' => $summary,
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'filters' => $request->only(['date_from', 'date_to', 'supplier_id', 'warehouse_id']),
        ]);
    }

    /**
     * Profit & Loss Report
     */
    public function profitLossReport(Request $request)
    {
        $this->authorize('view-reports');

        $dateFrom = $request->date_from ?: Carbon::now()->startOfMonth();
        $dateTo = $request->date_to ?: Carbon::now()->endOfMonth();

        // Calculate revenue
        $revenue = Sale::whereBetween('sale_date', [$dateFrom, $dateTo])
            ->sum('total_amount');

        // Calculate cost of goods sold
        $cogs = Sale::whereBetween('sale_date', [$dateFrom, $dateTo])
            ->with('items.product')
            ->get()
            ->sum(function ($sale) {
                return $sale->items->sum(function ($item) {
                    return $item->quantity * $item->product->cost_price;
                });
            });

        // Calculate expenses
        $expenses = Transaction::whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->whereHas('account', function ($query) {
                $query->where('type', 'expense');
            })
            ->sum('debit');

        // Calculate gross profit
        $grossProfit = $revenue - $cogs;

        // Calculate net profit
        $netProfit = $grossProfit - $expenses;

        $summary = [
            'revenue' => (float) $revenue,
            'cost_of_goods_sold' => (float) $cogs,
            'gross_profit' => (float) $grossProfit,
            'expenses' => (float) $expenses,
            'net_profit' => (float) $netProfit,
            'gross_profit_margin' => $revenue > 0 ? ($grossProfit / $revenue) * 100 : 0,
            'net_profit_margin' => $revenue > 0 ? ($netProfit / $revenue) * 100 : 0,
        ];

        return Inertia::render('Reports/ProfitLossReport', [
            'summary' => $summary,
            'filters' => $request->only(['date_from', 'date_to']),
        ]);
    }

    /**
     * Customer Outstanding Report
     */
    public function customerOutstandingReport(Request $request)
    {
        $this->authorize('view-reports');

        $query = Customer::with(['sales' => function ($query) {
            $query->where('payment_status', '!=', 'paid');
        }]);

        if ($request->filled('customer_id')) {
            $query->where('id', $request->customer_id);
        }

        $customers = $query->get()->map(function ($customer) {
            $outstandingAmount = $customer->sales->sum(function ($sale) {
                return $sale->total_amount - $sale->paid_amount;
            });

            return [
                'customer' => $customer,
                'outstanding_amount' => $outstandingAmount,
                'credit_limit' => $customer->credit_limit,
                'available_credit' => $customer->credit_limit - $outstandingAmount,
            ];
        })->filter(function ($item) {
            return $item['outstanding_amount'] > 0;
        });

        $totalOutstanding = $customers->sum('outstanding_amount');

        return Inertia::render('Reports/CustomerOutstandingReport', [
            'customers' => $customers,
            'totalOutstanding' => $totalOutstanding,
            'filters' => $request->only(['customer_id']),
        ]);
    }

    /**
     * Supplier Outstanding Report
     */
    public function supplierOutstandingReport(Request $request)
    {
        $this->authorize('view-reports');

        $query = Supplier::with(['purchases' => function ($query) {
            $query->where('status', '!=', 'paid');
        }]);

        if ($request->filled('supplier_id')) {
            $query->where('id', $request->supplier_id);
        }

        $suppliers = $query->get()->map(function ($supplier) {
            $outstandingAmount = $supplier->purchases->sum(function ($purchase) {
                return $purchase->total_amount - $purchase->paid_amount;
            });

            return [
                'supplier' => $supplier,
                'outstanding_amount' => $outstandingAmount,
                'credit_limit' => $supplier->credit_limit,
                'available_credit' => $supplier->credit_limit - $outstandingAmount,
            ];
        })->filter(function ($item) {
            return $item['outstanding_amount'] > 0;
        });

        $totalOutstanding = $suppliers->sum('outstanding_amount');

        return Inertia::render('Reports/SupplierOutstandingReport', [
            'suppliers' => $suppliers,
            'totalOutstanding' => $totalOutstanding,
            'filters' => $request->only(['supplier_id']),
        ]);
    }
}