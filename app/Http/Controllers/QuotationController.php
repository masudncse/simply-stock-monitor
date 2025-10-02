<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Services\SaleService;
use App\Services\TaxService;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuotationController extends Controller
{
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
        $quotations = Quotation::with(['customer', 'warehouse', 'creator'])
            ->when($request->search, function ($query, $search) {
                $query->where('quotation_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->where('quotation_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->where('quotation_date', '<=', $dateTo);
            });

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'created_at'); // Default sort by created_at
        $sortDirection = $request->get('sort_direction', 'desc'); // Default descending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['quotation_number', 'quotation_date', 'valid_until', 'total_amount', 'status', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        // Apply sorting
        $perPage = $request->get('per_page', 15);
        $quotations = $quotations->orderBy($sortBy, $sortDirection)->paginate($perPage)->appends($request->query());

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::where('is_active', true)->get(['id', 'name', 'code']);
        $warehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        $products = Product::with(['category'])->where('is_active', true)->get(['id', 'name', 'sku', 'price', 'unit', 'category_id']);

        return Inertia::render('Quotations/Create', [
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
            'taxRate' => TaxService::getTaxRate(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quotation_date' => 'required|date',
            'valid_until' => 'required|date|after:quotation_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'items.*.expiry_date' => 'nullable|date',
            'discount_type' => 'nullable|in:percentage,fixed',
            'discount_value' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate quotation number
            $quotationNumber = 'QUO-' . str_pad(Quotation::count() + 1, 6, '0', STR_PAD_LEFT);

            // Calculate totals
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $taxAmount = TaxService::calculateTaxAmount($subtotal);

            // Calculate discount
            $discountAmount = 0;
            if (!empty($validated['discount_type']) && !empty($validated['discount_value'])) {
                if ($validated['discount_type'] === 'percentage') {
                    $discountAmount = ($subtotal * $validated['discount_value']) / 100;
                } else {
                    $discountAmount = min($validated['discount_value'], $subtotal);
                }
            }

            $totalAmount = $subtotal + $taxAmount - $discountAmount;

            // Create quotation
            $quotation = Quotation::create([
                'quotation_number' => $quotationNumber,
                'customer_id' => $validated['customer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'quotation_date' => $validated['quotation_date'],
                'valid_until' => $validated['valid_until'],
                'notes' => $validated['notes'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'discount_type' => $validated['discount_type'],
                'discount_value' => $validated['discount_value'],
                'total_amount' => $totalAmount,
                'status' => 'draft',
                'created_by' => auth()->id(),
            ]);

            // Create quotation items
            foreach ($validated['items'] as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                    'batch' => $item['batch'],
                    'expiry_date' => $item['expiry_date'],
                ]);
            }
        });

        return redirect()->route('quotations.index')
            ->with('success', 'Quotation created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Quotation $quotation)
    {
        $quotation->load(['customer', 'warehouse', 'items.product', 'creator', 'approver', 'convertedSale']);

        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quotation $quotation)
    {
        if ($quotation->status !== 'draft') {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'Only draft quotations can be edited.');
        }

        $quotation->load(['items.product']);
        $customers = Customer::where('is_active', true)->get(['id', 'name', 'code']);
        $warehouses = Warehouse::where('is_active', true)->get(['id', 'name', 'code']);
        $products = Product::with(['category'])->where('is_active', true)->get(['id', 'name', 'sku', 'price', 'unit', 'category_id']);

        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'customers' => $customers,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quotation $quotation)
    {
        if ($quotation->status !== 'draft') {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'Only draft quotations can be edited.');
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quotation_date' => 'required|date',
            'valid_until' => 'required|date|after:quotation_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.batch' => 'nullable|string',
            'items.*.expiry_date' => 'nullable|date',
            'discount_type' => 'nullable|in:percentage,fixed',
            'discount_value' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($quotation, $validated) {
            // Calculate totals
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $taxAmount = TaxService::calculateTaxAmount($subtotal);

            // Calculate discount
            $discountAmount = 0;
            if (!empty($validated['discount_type']) && !empty($validated['discount_value'])) {
                if ($validated['discount_type'] === 'percentage') {
                    $discountAmount = ($subtotal * $validated['discount_value']) / 100;
                } else {
                    $discountAmount = min($validated['discount_value'], $subtotal);
                }
            }

            $totalAmount = $subtotal + $taxAmount - $discountAmount;

            // Update quotation
            $quotation->update([
                'customer_id' => $validated['customer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'quotation_date' => $validated['quotation_date'],
                'valid_until' => $validated['valid_until'],
                'notes' => $validated['notes'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'discount_type' => $validated['discount_type'],
                'discount_value' => $validated['discount_value'],
                'total_amount' => $totalAmount,
            ]);

            // Delete existing items and create new ones
            $quotation->items()->delete();
            foreach ($validated['items'] as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                    'batch' => $item['batch'],
                    'expiry_date' => $item['expiry_date'],
                ]);
            }
        });

        return redirect()->route('quotations.show', $quotation)
            ->with('success', 'Quotation updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quotation $quotation)
    {
        if ($quotation->status !== 'draft') {
            return redirect()->route('quotations.index')
                ->with('error', 'Only draft quotations can be deleted.');
        }

        $quotation->delete();

        return redirect()->route('quotations.index')
            ->with('success', 'Quotation deleted successfully!');
    }

    /**
     * Approve a quotation
     */
    public function approve(Quotation $quotation)
    {
        if ($quotation->status !== 'sent') {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'Only sent quotations can be approved.');
        }

        $quotation->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->route('quotations.show', $quotation)
            ->with('success', 'Quotation approved successfully!');
    }

    /**
     * Reject a quotation
     */
    public function reject(Quotation $quotation)
    {
        if ($quotation->status !== 'sent') {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'Only sent quotations can be rejected.');
        }

        $quotation->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->route('quotations.show', $quotation)
            ->with('success', 'Quotation rejected.');
    }

    /**
     * Convert approved quotation to sale
     */
    public function convertToSale(Quotation $quotation)
    {
        if (!$quotation->canBeConvertedToSale()) {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'This quotation cannot be converted to a sale.');
        }

        $sale = DB::transaction(function () use ($quotation) {
            // Prepare sale data
            $saleData = [
                'customer_id' => $quotation->customer_id,
                'warehouse_id' => $quotation->warehouse_id,
                'sale_date' => now()->toDateString(),
                'subtotal' => $quotation->subtotal,
                'tax_amount' => $quotation->tax_amount,
                'discount_amount' => $quotation->discount_amount,
                'total_amount' => $quotation->total_amount,
                'notes' => "Converted from Quotation: {$quotation->quotation_number}",
            ];

            // Prepare items
            $items = $quotation->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'batch' => $item->batch,
                ];
            })->toArray();

            // Create sale using service (generates invoice_number automatically)
            $sale = $this->saleService->createSale($saleData, $items, auth()->id());

            // Mark quotation as converted
            $quotation->update([
                'converted_to_sale_id' => $sale->id,
            ]);

            return $sale;
        });

        return redirect()->route('quotations.show', $quotation)
            ->with('success', 'Quotation converted to sale successfully!');
    }

    /**
     * Send quotation to customer
     */
    public function send(Quotation $quotation)
    {
        if ($quotation->status !== 'draft') {
            return redirect()->route('quotations.show', $quotation)
                ->with('error', 'Only draft quotations can be sent.');
        }

        $quotation->update(['status' => 'sent']);

        return redirect()->route('quotations.show', $quotation)
            ->with('success', 'Quotation sent to customer successfully!');
    }

    /**
     * Print a quotation
     */
    public function print(Quotation $quotation)
    {
        $quotation->load([
            'customer',
            'warehouse',
            'items.product',
            'creator',
            'approver'
        ]);

        return Inertia::render('Print/Quotation', [
            'quotation' => $quotation,
            'taxRate' => TaxService::getTaxRate(),
            'company' => CompanySetting::getSettings(),
        ]);
    }
}
