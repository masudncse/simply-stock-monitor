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

        $query = Sale::with(['customer', 'warehouse', 'saleItems.product']);

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
            'total_amount' => $sales->sum('total_amount'),
            'total_tax' => $sales->sum('tax_amount'),
            'total_discount' => $sales->sum('discount_amount'),
            'net_amount' => $sales->sum('total_amount') - $sales->sum('discount_amount'),
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

        $query = Purchase::with(['supplier', 'warehouse', 'purchaseItems.product']);

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
            'total_amount' => $purchases->sum('total_amount'),
            'total_tax' => $purchases->sum('tax_amount'),
            'total_discount' => $purchases->sum('discount_amount'),
            'net_amount' => $purchases->sum('total_amount') - $purchases->sum('discount_amount'),
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
}