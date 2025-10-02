<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourierRequest;
use App\Http\Requests\UpdateCourierRequest;
use App\Models\Courier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Courier::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status);
        }

        // Sorting
        $sortField = $request->get('sort_field', 'name');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $couriers = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('Couriers/Index', [
            'couriers' => $couriers,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Couriers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourierRequest $request): RedirectResponse
    {
        Courier::create($request->validated());

        return redirect()->route('couriers.index')
            ->with('success', 'Courier created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Courier $courier): Response
    {
        $courier->load(['shipments' => function ($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('Couriers/Show', [
            'courier' => $courier,
            'shipmentsCount' => $courier->shipments()->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Courier $courier): Response
    {
        return Inertia::render('Couriers/Edit', [
            'courier' => $courier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourierRequest $request, Courier $courier): RedirectResponse
    {
        $courier->update($request->validated());

        return redirect()->route('couriers.index')
            ->with('success', 'Courier updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Courier $courier): RedirectResponse
    {
        // Check if courier has shipments
        if ($courier->shipments()->count() > 0) {
            return redirect()->route('couriers.index')
                ->with('error', 'Cannot delete courier with existing shipments.');
        }

        $courier->delete();

        return redirect()->route('couriers.index')
            ->with('success', 'Courier deleted successfully.');
    }

    /**
     * Get active couriers for dropdown
     */
    public function getActiveCouriers(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Courier::where('is_active', true);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $couriers = $query->orderBy('name')
            ->get(['id', 'name', 'code', 'phone', 'email', 'base_rate', 'per_kg_rate', 'is_active']);

        return response()->json($couriers);
    }
}
