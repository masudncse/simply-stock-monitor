<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class SaleController extends Controller
{
    use AuthorizesRequests;
    
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-sales');

        $sales = Sale::with(['customer', 'warehouse', 'saleItems.product'])
            ->when($request->search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->customer_id, function ($query, $customerId) {
                $query->where('customer_id', $customerId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $customers = Customer::where('is_active', true)->get();
        
        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'customer_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-sales');

        $customers = Customer::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create-sales');

        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $sale = $this->saleService->createSale($request->all());

        return redirect()->route('sales.show', $sale)
            ->with('success', 'Sale created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $this->authorize('view-sales');

        $sale->load(['customer', 'warehouse', 'saleItems.product', 'createdBy']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $this->authorize('edit-sales');

        $sale->load(['saleItems.product']);
        $customers = Customer::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $this->authorize('edit-sales');

        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $this->saleService->updateSale($sale, $request->all());

        return redirect()->route('sales.show', $sale)
            ->with('success', 'Sale updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $this->authorize('delete-sales');

        $this->saleService->deleteSale($sale);

        return redirect()->route('sales.index')
            ->with('success', 'Sale deleted successfully.');
    }

    /**
     * Process a sale (approve)
     */
    public function process(Sale $sale)
    {
        $this->authorize('process-sales');

        $this->saleService->processSale($sale);

        return redirect()->back()
            ->with('success', 'Sale processed successfully.');
    }
}
