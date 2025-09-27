<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Services\SaleService;
use App\Http\Requests\ProcessPOSRequest;
use App\Http\Requests\GetProductByBarcodeRequest;
use App\Exceptions\InsufficientStockException;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class POSController extends Controller
{
    use AuthorizesRequests;
    
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    /**
     * Display the POS interface
     */
    public function index()
    {
        $this->authorize('create-sales');

        $products = Product::where('is_active', true)
            ->with(['images' => function($query) {
                $query->where('is_primary', true)->limit(1);
            }])
            ->select('id', 'name', 'sku', 'price', 'unit')
            ->get();

        return Inertia::render('POS/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Process a sale from POS
     */
    public function processSale(ProcessPOSRequest $request)
    {
        // Get or create customer
        $customer = null;
        if ($request->customer_name && $request->customer_name !== 'Walk-in Customer') {
            $customer = Customer::firstOrCreate(
                ['name' => $request->customer_name],
                [
                    'code' => 'CUS-' . str_pad(Customer::count() + 1, 4, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]
            );
        }

        // Get default warehouse
        $warehouse = Warehouse::where('is_active', true)->first();
        if (!$warehouse) {
            return redirect()->back()->with('error', 'No active warehouse found.');
        }

        // Prepare sale data
        $saleData = [
            'customer_id' => $customer?->id,
            'warehouse_id' => $warehouse->id,
            'sale_date' => now()->toDateString(),
            'subtotal' => $request->subtotal,
            'tax_amount' => $request->tax_amount,
            'discount_amount' => 0,
            'total_amount' => $request->total_amount,
            'paid_amount' => $request->total_amount, // POS sales are typically paid immediately
            'status' => 'completed',
            'payment_status' => 'paid',
            'notes' => 'POS Sale',
        ];

        try {
            // Create sale using service
            $sale = $this->saleService->createSale($saleData, $request->items, auth()->id());
            
            // Process the sale immediately for POS
            $this->saleService->processSale($sale->id);

            return redirect()->route('pos.index')
                ->with('success', "Sale completed successfully! Invoice: {$sale->invoice_number}");
        } catch (InsufficientStockException $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'An error occurred while processing the sale: ' . $e->getMessage());
        }
    }

    /**
     * Get products for POS search
     */
    public function searchProducts(Request $request)
    {
        $this->authorize('create-sales');

        $query = Product::where('is_active', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('barcode', 'like', "%{$request->search}%");
            });
        }

        return $query->with(['images' => function($query) {
                $query->where('is_primary', true)->limit(1);
            }])
            ->select('id', 'name', 'sku', 'price', 'unit')->limit(20)->get();
    }

    /**
     * Get product by barcode
     */
    public function getProductByBarcode(GetProductByBarcodeRequest $request)
    {
        $product = Product::where('barcode', $request->barcode)
            ->where('is_active', true)
            ->with(['images' => function($query) {
                $query->where('is_primary', true)->limit(1);
            }])
            ->select('id', 'name', 'sku', 'price', 'unit')
            ->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }
}