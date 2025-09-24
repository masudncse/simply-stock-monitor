<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class AccountController extends Controller
{
    use AuthorizesRequests;

    protected AccountService $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-accounts');

        $accounts = Account::with(['parent', 'children'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->sub_type, function ($query, $subType) {
                $query->where('sub_type', $subType);
            })
            ->orderBy('code')
            ->paginate(20);

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'filters' => $request->only(['search', 'type', 'sub_type']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-accounts');

        $parentAccounts = Account::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('code')
            ->get();

        return Inertia::render('Accounts/Create', [
            'parentAccounts' => $parentAccounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request)
    {
        $account = $this->accountService->createAccount($request->validated());

        return redirect()->route('accounts.show', $account)
            ->with('success', 'Account created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        $this->authorize('view-accounts');

        $account->load(['parent', 'children', 'transactions' => function ($query) {
            $query->latest()->limit(20);
        }]);

        // Calculate account balance
        $balance = $this->accountService->calculateBalance($account);

        return Inertia::render('Accounts/Show', [
            'account' => $account,
            'balance' => $balance,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        $this->authorize('edit-accounts');

        $parentAccounts = Account::whereNull('parent_id')
            ->where('is_active', true)
            ->where('id', '!=', $account->id)
            ->orderBy('code')
            ->get();

        return Inertia::render('Accounts/Edit', [
            'account' => $account,
            'parentAccounts' => $parentAccounts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        $this->accountService->updateAccount($account, $request->validated());

        return redirect()->route('accounts.show', $account)
            ->with('success', 'Account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        try {
            $this->accountService->deleteAccount($account);
            
            return redirect()->route('accounts.index')
                ->with('success', 'Account deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Get trial balance
     */
    public function trialBalance()
    {
        $this->authorize('view-accounts');

        $trialBalance = $this->accountService->getTrialBalance();

        return Inertia::render('Accounts/TrialBalance', [
            'trialBalance' => $trialBalance,
        ]);
    }
}
