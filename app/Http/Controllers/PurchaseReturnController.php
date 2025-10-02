<?php

namespace App\Http\Controllers;

use App\Models\PurchaseReturn;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Product;
use App\Services\PurchaseReturnService;
use App\Http\Requests\StorePurchaseReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class PurchaseReturnController extends Controller
{
    use AuthorizesRequests;
    
    protected PurchaseReturnService $purchaseReturnService;

    public function __construct(PurchaseReturnService $purchaseReturnService)
    {
        $this->purchaseReturnService = $purchaseReturnService;
    }

    /**
     * Display a listing of purchase returns
     */
    public function index(Request $request)
    {
        $this->authorize('view-purchase-returns');

        $returns = PurchaseReturn::with(['purchase', 'supplier', 'warehouse', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('return_number', 'like', "%{$search}%")
                      ->orWhereHas('supplier', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->where('return_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->where('return_date', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15))
            ->appends($request->query());

        $suppliers = Supplier::where('is_active', true)->get();
        
        return Inertia::render('PurchaseReturns/Index', [
            'returns' => $returns,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new purchase return
     */
    public function create(Request $request)
    {
        $this->authorize('create-purchase-returns');

        $purchaseId = $request->get('purchase_id');
        $purchase = null;

        if ($purchaseId) {
            $purchase = Purchase::with(['supplier', 'warehouse', 'items.product'])->findOrFail($purchaseId);
        }

        $suppliers = Supplier::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('PurchaseReturns/Create', [
            'purchase' => $purchase,
            'suppliers' => $suppliers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created purchase return
     */
    public function store(StorePurchaseReturnRequest $request)
    {
        $validated = $request->validated();
        
        // Extract items from validated data
        $items = $validated['items'] ?? [];
        unset($validated['items']);
        
        $purchaseReturn = $this->purchaseReturnService->createPurchaseReturn(
            $validated,
            $items,
            $request->user()->id
        );

        return redirect()->route('purchase-returns.show', $purchaseReturn)
            ->with('success', 'Purchase return created successfully.');
    }

    /**
     * Display the specified purchase return
     */
    public function show(PurchaseReturn $purchaseReturn)
    {
        $this->authorize('view-purchase-returns');

        $purchaseReturn->load(['purchase', 'supplier', 'warehouse', 'items.product', 'createdBy']);

        return Inertia::render('PurchaseReturns/Show', [
            'purchaseReturn' => $purchaseReturn,
        ]);
    }

    /**
     * Approve a purchase return
     */
    public function approve(PurchaseReturn $purchaseReturn)
    {
        $this->authorize('approve-purchase-returns');

        $this->purchaseReturnService->approvePurchaseReturn($purchaseReturn);

        return redirect()->back()
            ->with('success', 'Purchase return approved successfully.');
    }

    /**
     * Remove the specified purchase return
     */
    public function destroy(PurchaseReturn $purchaseReturn)
    {
        $this->authorize('delete-purchase-returns');

        $this->purchaseReturnService->deletePurchaseReturn($purchaseReturn);

        return redirect()->route('purchase-returns.index')
            ->with('success', 'Purchase return deleted successfully.');
    }

    /**
     * Print debit note for purchase return
     */
    public function print(PurchaseReturn $purchaseReturn)
    {
        $purchaseReturn->load([
            'purchase',
            'supplier',
            'warehouse',
            'items.product',
            'createdBy'
        ]);

        return Inertia::render('Print/PurchaseReturn', [
            'purchaseReturn' => $purchaseReturn,
        ]);
    }
}
