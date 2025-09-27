<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\StockService;
use App\Http\Requests\StockAdjustmentRequest;
use App\Http\Requests\StockTransferRequest;
use App\Http\Requests\GetProductStockRequest;
use App\Http\Requests\GetStockHistoryRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class StockController extends Controller
{
    use AuthorizesRequests;
    
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-stock');

        $query = Stock::with(['product', 'warehouse']);

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Search by product name or SKU
        if ($request->filled('search')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%");
            });
        }

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'product_id'); // Default sort by product
        $sortDirection = $request->get('sort_direction', 'asc'); // Default ascending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['product_id', 'warehouse_id', 'quantity', 'batch', 'expiry_date', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'product_id';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        
        // Apply sorting
        $stocks = $query->orderBy($sortBy, $sortDirection)->paginate(15)->appends($request->query());

        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->get(['id', 'name', 'sku']);

        return Inertia::render('Stock/Index', [
            'stocks' => $stocks,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => $request->only(['warehouse_id', 'product_id', 'search', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show low stock products
     */
    public function lowStock()
    {
        $this->authorize('view-stock');

        $lowStockProducts = $this->stockService->getLowStockProducts();

        return Inertia::render('Stock/LowStock', [
            'products' => $lowStockProducts,
        ]);
    }

    /**
     * Show stock adjustment form
     */
    public function adjust()
    {
        $this->authorize('adjust-stock');

        $products = Product::where('is_active', true)->get(['id', 'name', 'sku']);
        $warehouses = Warehouse::where('is_active', true)->get();

        return Inertia::render('Stock/Adjust', [
            'products' => $products,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Process stock adjustment
     */
    public function processAdjustment(StockAdjustmentRequest $request)
    {
        $this->stockService->adjustStock(
            $request->product_id,
            $request->warehouse_id,
            $request->new_quantity,
            $request->batch,
            $request->reason
        );

        return redirect()->route('stock.index')
            ->with('success', 'Stock adjusted successfully.');
    }

    /**
     * Show stock transfer form
     */
    public function transfer()
    {
        $this->authorize('transfer-stock');

        $products = Product::where('is_active', true)->get(['id', 'name', 'sku']);
        $warehouses = Warehouse::where('is_active', true)->get();

        return Inertia::render('Stock/Transfer', [
            'products' => $products,
            'warehouses' => $warehouses,
        ]);
    }

    /**
     * Process stock transfer
     */
    public function processTransfer(StockTransferRequest $request)
    {
        try {
            $this->stockService->transferStock(
                $request->product_id,
                $request->from_warehouse_id,
                $request->to_warehouse_id,
                $request->quantity,
                $request->batch
            );

            return redirect()->route('stock.index')
                ->with('success', 'Stock transferred successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Get stock levels for a product
     */
    public function getProductStock(GetProductStockRequest $request)
    {
        $stockLevels = $this->stockService->getProductStock($request->product_id);

        return response()->json($stockLevels);
    }

    /**
     * Get stock history for a product
     */
    public function getStockHistory(GetStockHistoryRequest $request)
    {
        $query = Stock::where('product_id', $request->product_id)
            ->with(['warehouse', 'product']);

        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        $stocks = $query->orderBy('updated_at', 'desc')->get();

        return response()->json($stocks);
    }
}