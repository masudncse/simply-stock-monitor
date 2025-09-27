<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\PurchaseService;
use App\Services\TaxService;
use App\Http\Requests\StorePurchaseRequest;
use App\Models\CompanySetting;
use App\Http\Requests\UpdatePurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    use AuthorizesRequests;
    
    protected PurchaseService $purchaseService;

    public function __construct(PurchaseService $purchaseService)
    {
        $this->purchaseService = $purchaseService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-purchases');

        $purchases = Purchase::with(['supplier', 'warehouse', 'items.product'])
            ->when($request->search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                      ->orWhereHas('supplier', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->supplier_id, function ($query, $supplierId) {
                $query->where('supplier_id', $supplierId);
            });

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'created_at'); // Default sort by created_at
        $sortDirection = $request->get('sort_direction', 'desc'); // Default descending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['invoice_number', 'purchase_date', 'total_amount', 'status', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        // Apply sorting
        $purchases = $purchases->orderBy($sortBy, $sortDirection)->paginate(15);

        $suppliers = Supplier::where('is_active', true)->get();
        
        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'supplier_id', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-purchases');

        $suppliers = Supplier::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('Purchases/Create', [
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'products' => $products,
            'taxRate' => TaxService::getTaxRate(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequest $request)
    {
        $validated = $request->validated();
        
        // Extract items from validated data
        $items = $validated['items'] ?? [];
        unset($validated['items']); // Remove items from purchase data
        
        // Calculate total_price for each item if not present
        foreach ($items as &$item) {
            if (!isset($item['total_price'])) {
                $item['total_price'] = $item['quantity'] * $item['unit_price'];
            }
        }
        
        // Calculate totals
        $totals = $this->purchaseService->calculateTotals($items);
        
        // Add calculated totals to purchase data
        $validated['subtotal'] = $totals['subtotal'];
        $validated['tax_amount'] = $totals['tax_amount'];
        $validated['discount_amount'] = $totals['discount_amount'];
        $validated['total_amount'] = $totals['total_amount'];
        
        $purchase = $this->purchaseService->createPurchase(
            $validated,
            $items,
            $request->user()->id
        );

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        $this->authorize('view-purchases');

        $purchase->load(['supplier', 'warehouse', 'items.product', 'createdBy']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $this->authorize('edit-purchases');

        $purchase->load(['items.product']);
        $suppliers = Supplier::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase,
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $validated = $request->validated();
        
        // Extract items from validated data
        $items = $validated['items'] ?? null;
        if ($items !== null) {
            unset($validated['items']); // Remove items from purchase data
            
            // Calculate total_price for each item if not present
            foreach ($items as &$item) {
                if (!isset($item['total_price'])) {
                    $item['total_price'] = $item['quantity'] * $item['unit_price'];
                }
            }
            
            // Calculate totals for updated items
            $totals = $this->purchaseService->calculateTotals($items);
            
            // Add calculated totals to purchase data
            $validated['subtotal'] = $totals['subtotal'];
            $validated['tax_amount'] = $totals['tax_amount'];
            $validated['discount_amount'] = $totals['discount_amount'];
            $validated['total_amount'] = $totals['total_amount'];
        }
        
        $this->purchaseService->updatePurchase($purchase, $validated, $items);

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $this->authorize('delete-purchases');

        $this->purchaseService->deletePurchase($purchase);

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase deleted successfully.');
    }

    /**
     * Approve a purchase
     */
    public function approve(Purchase $purchase)
    {
        $this->authorize('approve-purchases');

        $this->purchaseService->approvePurchase($purchase);

        return redirect()->back()
            ->with('success', 'Purchase approved successfully.');
    }

    /**
     * Print a purchase invoice
     */
    public function print(Purchase $purchase)
    {
        $purchase->load([
            'supplier',
            'warehouse',
            'items.product',
            'createdBy'
        ]);

        return Inertia::render('Print/Purchase', [
            'purchase' => $purchase,
            'taxRate' => TaxService::getTaxRate(),
            'company' => CompanySetting::getSettings(),
        ]);
    }
}
