<?php

namespace App\Http\Controllers;

use App\Models\SaleReturn;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Models\Product;
use App\Services\SaleReturnService;
use App\Http\Requests\StoreSaleReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class SaleReturnController extends Controller
{
    use AuthorizesRequests;
    
    protected SaleReturnService $saleReturnService;

    public function __construct(SaleReturnService $saleReturnService)
    {
        $this->saleReturnService = $saleReturnService;
    }

    /**
     * Display a listing of sale returns
     */
    public function index(Request $request)
    {
        $this->authorize('view-sale-returns');

        $returns = SaleReturn::with(['sale', 'customer', 'warehouse', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('return_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
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

        $customers = Customer::where('is_active', true)->get();
        
        return Inertia::render('SaleReturns/Index', [
            'returns' => $returns,
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new sale return
     */
    public function create(Request $request)
    {
        $this->authorize('create-sale-returns');

        $saleId = $request->get('sale_id');
        $sale = null;

        if ($saleId) {
            $sale = Sale::with(['customer', 'warehouse', 'items.product'])->findOrFail($saleId);
        }

        $customers = Customer::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();
        $products = Product::where('is_active', true)->with('category')->get();

        return Inertia::render('SaleReturns/Create', [
            'sale' => $sale,
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created sale return
     */
    public function store(StoreSaleReturnRequest $request)
    {
        $validated = $request->validated();
        
        // Extract items from validated data
        $items = $validated['items'] ?? [];
        unset($validated['items']);
        
        $saleReturn = $this->saleReturnService->createSaleReturn(
            $validated,
            $items,
            $request->user()->id
        );

        return redirect()->route('sale-returns.show', $saleReturn)
            ->with('success', 'Sale return created successfully.');
    }

    /**
     * Display the specified sale return
     */
    public function show(SaleReturn $saleReturn)
    {
        $this->authorize('view-sale-returns');

        $saleReturn->load(['sale', 'customer', 'warehouse', 'items.product', 'createdBy']);

        return Inertia::render('SaleReturns/Show', [
            'saleReturn' => $saleReturn,
        ]);
    }

    /**
     * Approve a sale return
     */
    public function approve(SaleReturn $saleReturn)
    {
        $this->authorize('approve-sale-returns');

        $this->saleReturnService->approveSaleReturn($saleReturn);

        return redirect()->back()
            ->with('success', 'Sale return approved successfully.');
    }

    /**
     * Remove the specified sale return
     */
    public function destroy(SaleReturn $saleReturn)
    {
        $this->authorize('delete-sale-returns');

        $this->saleReturnService->deleteSaleReturn($saleReturn);

        return redirect()->route('sale-returns.index')
            ->with('success', 'Sale return deleted successfully.');
    }

    /**
     * Print credit note for sale return
     */
    public function print(SaleReturn $saleReturn)
    {
        $saleReturn->load([
            'sale',
            'customer',
            'warehouse',
            'items.product',
            'createdBy'
        ]);

        return Inertia::render('Print/SaleReturn', [
            'saleReturn' => $saleReturn,
        ]);
    }

    /**
     * Process refund for sale return
     */
    public function processRefund(Request $request, SaleReturn $saleReturn)
    {
        $this->authorize('approve-sale-returns');

        $validated = $request->validate([
            'refund_method' => 'required|in:cash,bank,credit_account',
            'refund_date' => 'required|date',
            'refunded_amount' => 'required|numeric|min:0',
        ]);

        $this->saleReturnService->processRefund($saleReturn, $validated);

        return redirect()->back()
            ->with('success', 'Refund processed successfully.');
    }
}
