<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class CustomerController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-customers');

        $customers = Customer::when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('is_active', $status === 'active');
            });

        // Sorting functionality
        $sortBy = $request->get('sort_by', 'name'); // Default sort by name
        $sortDirection = $request->get('sort_direction', 'asc'); // Default ascending
        
        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['name', 'code', 'contact_person', 'phone', 'email', 'credit_limit', 'outstanding_amount', 'is_active', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'name';
        }
        
        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        
        // Apply sorting
        $customers = $customers->orderBy($sortBy, $sortDirection)->paginate(15)->appends($request->query());

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-customers');

        return Inertia::render('Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->validated());

        return redirect()->route('customers.show', $customer)
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $this->authorize('view-customers');

        $customer->load(['sales' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        $this->authorize('edit-customers');

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return redirect()->route('customers.show', $customer)
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $this->authorize('delete-customers');

        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    /**
     * Search customers for API (autocomplete/select)
     */
    public function searchCustomers(Request $request)
    {
        $search = $request->input('search', '');
        
        $customers = Customer::query()
            ->where('is_active', true)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name', 'asc')
            ->limit(50)  // Return max 50 results
            ->get(['id', 'name', 'code', 'email', 'phone']);
        
        return response()->json([
            'customers' => $customers
        ]);
    }
}
