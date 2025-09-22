<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\PurchaseService;
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

        $purchases = Purchase::with(['supplier', 'warehouse', 'purchaseItems.product'])
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
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $suppliers = Supplier::where('is_active', true)->get();
        
        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'supplier_id']),
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
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create-purchases');

        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'purchase_date' => 'required|date',
            'due_date' => 'nullable|date|after:purchase_date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'items.*.expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $purchase = $this->purchaseService->createPurchase($request->all());

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        $this->authorize('view-purchases');

        $purchase->load(['supplier', 'warehouse', 'purchaseItems.product', 'createdBy']);

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

        $purchase->load(['purchaseItems.product']);
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
    public function update(Request $request, Purchase $purchase)
    {
        $this->authorize('edit-purchases');

        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'purchase_date' => 'required|date',
            'due_date' => 'nullable|date|after:purchase_date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'items.*.expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $this->purchaseService->updatePurchase($purchase, $request->all());

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
}
