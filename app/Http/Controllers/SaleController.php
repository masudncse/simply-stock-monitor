<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\SaleService;
use App\Services\TaxService;
use App\Http\Requests\StoreSaleRequest;
use App\Models\CompanySetting;
use App\Http\Requests\UpdateSaleRequest;
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

        $sales = Sale::with(['customer', 'warehouse', 'items.product'])
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
            });

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'created_at'); // Default sort by created_at
        $sortDirection = $request->get('sort_direction', 'desc'); // Default descending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['invoice_number', 'sale_date', 'total_amount', 'status', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        // Apply sorting
        $sales = $sales->orderBy($sortBy, $sortDirection)->paginate(15);

        $customers = Customer::where('is_active', true)->get();
        
        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'customer_id', 'sort_by', 'sort_direction']),
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
            'taxRate' => TaxService::getTaxRate(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        $sale = $this->saleService->createSale($request->validated());

        return redirect()->route('sales.show', $sale)
            ->with('success', 'Sale created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $this->authorize('view-sales');

        $sale->load(['customer', 'warehouse', 'items.product', 'createdBy']);

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

        $sale->load(['items.product']);
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
    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $this->saleService->updateSale($sale, $request->validated());

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

    /**
     * Print a sale invoice
     */
    public function print(Sale $sale)
    {
        $sale->load([
            'customer',
            'warehouse', 
            'items.product',
            'createdBy'
        ]);

        return Inertia::render('Print/Sale', [
            'sale' => $sale,
            'taxRate' => TaxService::getTaxRate(),
            'company' => CompanySetting::getSettings(),
        ]);
    }
}
