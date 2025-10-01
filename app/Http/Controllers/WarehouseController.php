<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-warehouses');

        $query = Warehouse::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%")
                  ->orWhere('contact_person', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'name');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        // Validate sort column
        $allowedSortColumns = ['name', 'code', 'contact_person', 'phone', 'email', 'is_active', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'name';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        
        // Apply sorting and pagination
        $perPage = $request->get('per_page', 15);
        $warehouses = $query->orderBy($sortBy, $sortDirection)->paginate($perPage)->appends($request->query());

        return Inertia::render('Warehouses/Index', [
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-warehouses');

        return Inertia::render('Warehouses/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWarehouseRequest $request)
    {
        $this->authorize('create-warehouses');

        $warehouse = Warehouse::create($request->validated());

        return redirect()->route('warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {
        $this->authorize('view-warehouses');

        // Load related data
        $warehouse->load(['stocks.product', 'purchases', 'sales']);

        return Inertia::render('Warehouses/Show', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse)
    {
        $this->authorize('edit-warehouses');

        return Inertia::render('Warehouses/Edit', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse)
    {
        $this->authorize('edit-warehouses');

        $warehouse->update($request->validated());

        return redirect()->route('warehouses.index')
            ->with('success', 'Warehouse updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {
        $this->authorize('delete-warehouses');

        // Check if warehouse has associated data
        if ($warehouse->stocks()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete warehouse with existing stock records.');
        }

        if ($warehouse->purchases()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete warehouse with existing purchase records.');
        }

        if ($warehouse->sales()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete warehouse with existing sales records.');
        }

        $warehouse->delete();

        return redirect()->route('warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }
}