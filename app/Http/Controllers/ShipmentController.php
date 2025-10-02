<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\Sale;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of shipments.
     */
    public function index(Request $request)
    {
        $this->authorize('view-shipments');

        $shipments = Shipment::with(['sale', 'customer', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('shipment_number', 'like', "%{$search}%")
                      ->orWhere('tracking_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->courier_service, function ($query, $courier) {
                $query->where('courier_service', $courier);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('shipping_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('shipping_date', '<=', $dateTo);
            });

        $sortBy = $request->get('sort_by', 'shipping_date');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSortColumns = ['shipment_number', 'shipping_date', 'expected_delivery_date', 'status'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'shipping_date';
        }
        
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        $perPage = $request->get('per_page', 15);
        $shipments = $shipments->orderBy($sortBy, $sortDirection)->paginate($perPage)->appends($request->query());

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
            'filters' => $request->only(['search', 'status', 'courier_service', 'date_from', 'date_to', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new shipment.
     */
    public function create(Request $request)
    {
        $this->authorize('create-shipments');

        $sale = null;
        if ($request->sale_id) {
            $sale = Sale::with(['customer', 'items.product'])->findOrFail($request->sale_id);
        }

        return Inertia::render('Shipments/Create', [
            'sale' => $sale,
        ]);
    }

    /**
     * Store a newly created shipment.
     */
    public function store(Request $request)
    {
        $this->authorize('create-shipments');

        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'courier_service' => 'required|string|max:255',
            'tracking_number' => 'nullable|string|max:255',
            'shipping_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:shipping_date',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'recipient_address' => 'required|string',
            'recipient_city' => 'nullable|string|max:100',
            'recipient_district' => 'nullable|string|max:100',
            'recipient_postal_code' => 'nullable|string|max:20',
            'number_of_packages' => 'required|integer|min:1',
            'total_weight' => 'nullable|numeric|min:0',
            'package_dimensions' => 'nullable|string|max:100',
            'shipping_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'special_instructions' => 'nullable|string',
        ]);

        $sale = Sale::with('customer')->findOrFail($validated['sale_id']);
        
        $validated['shipment_number'] = Shipment::generateShipmentNumber();
        $validated['customer_id'] = $sale->customer_id;
        $validated['created_by'] = auth()->id();

        $shipment = Shipment::create($validated);

        return redirect()->route('shipments.show', $shipment)
            ->with('success', 'Shipment created successfully.');
    }

    /**
     * Display the specified shipment.
     */
    public function show(Shipment $shipment)
    {
        $this->authorize('view-shipments');

        $shipment->load(['sale.items.product', 'customer', 'createdBy']);

        return Inertia::render('Shipments/Show', [
            'shipment' => $shipment,
        ]);
    }

    /**
     * Update shipment status.
     */
    public function updateStatus(Request $request, Shipment $shipment)
    {
        $this->authorize('edit-shipments');

        $validated = $request->validate([
            'status' => 'required|in:pending,picked_up,in_transit,out_for_delivery,delivered,cancelled,returned',
            'actual_delivery_date' => 'nullable|date',
        ]);

        $shipment->update($validated);

        // If status is delivered, update actual delivery date
        if ($validated['status'] === 'delivered' && !$shipment->actual_delivery_date) {
            $shipment->update(['actual_delivery_date' => now()]);
        }

        return back()->with('success', 'Shipment status updated successfully.');
    }

    /**
     * Update the specified shipment.
     */
    public function update(Request $request, Shipment $shipment)
    {
        $this->authorize('edit-shipments');

        $validated = $request->validate([
            'courier_service' => 'required|string|max:255',
            'tracking_number' => 'nullable|string|max:255',
            'shipping_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:shipping_date',
            'status' => 'required|in:pending,picked_up,in_transit,out_for_delivery,delivered,cancelled,returned',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'recipient_address' => 'required|string',
            'recipient_city' => 'nullable|string|max:100',
            'recipient_district' => 'nullable|string|max:100',
            'recipient_postal_code' => 'nullable|string|max:20',
            'number_of_packages' => 'required|integer|min:1',
            'total_weight' => 'nullable|numeric|min:0',
            'package_dimensions' => 'nullable|string|max:100',
            'shipping_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'special_instructions' => 'nullable|string',
        ]);

        $shipment->update($validated);

        return redirect()->route('shipments.show', $shipment)
            ->with('success', 'Shipment updated successfully.');
    }

    /**
     * Remove the specified shipment.
     */
    public function destroy(Shipment $shipment)
    {
        $this->authorize('delete-shipments');

        if (in_array($shipment->status, ['delivered'])) {
            return back()->with('error', 'Cannot delete delivered shipments.');
        }

        $shipment->delete();

        return redirect()->route('shipments.index')
            ->with('success', 'Shipment deleted successfully.');
    }

    /**
     * Print shipping label.
     */
    public function print(Shipment $shipment)
    {
        $this->authorize('view-shipments');

        $shipment->load(['sale.items.product', 'customer', 'createdBy']);

        return Inertia::render('Shipments/Print', [
            'shipment' => $shipment,
        ]);
    }
}

