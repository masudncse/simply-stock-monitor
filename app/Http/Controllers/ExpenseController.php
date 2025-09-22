<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Account;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

    protected ExpenseService $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-expenses');

        $expenses = Expense::with(['account', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('expense_number', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->account_id, function ($query, $accountId) {
                $query->where('account_id', $accountId);
            })
            ->when($request->date_from, function ($query, $date) {
                $query->where('expense_date', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->where('expense_date', '<=', $date);
            })
            ->orderBy('expense_date', 'desc')
            ->paginate(15);

        $accounts = Account::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'accounts' => $accounts,
            'filters' => $request->only(['search', 'category', 'account_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-expenses');

        $accounts = Account::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Expenses/Create', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $expense = $this->expenseService->createExpense($request->validated());

        return redirect()->route('expenses.show', $expense)
            ->with('success', 'Expense recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        $this->authorize('view-expenses');

        $expense->load(['account', 'createdBy']);

        return Inertia::render('Expenses/Show', [
            'expense' => $expense,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        $this->authorize('edit-expenses');

        $accounts = Account::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->expenseService->updateExpense($expense, $request->validated());

        return redirect()->route('expenses.show', $expense)
            ->with('success', 'Expense updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $this->authorize('delete-expenses');

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted successfully.');
    }
}
