<?php

namespace App\Http\Controllers;

use App\Models\BankTransaction;
use App\Models\Account;
use App\Services\BankTransactionService;
use App\Http\Requests\StoreBankTransactionRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class BankTransactionController extends Controller
{
    use AuthorizesRequests;

    protected BankTransactionService $bankTransactionService;

    public function __construct(BankTransactionService $bankTransactionService)
    {
        $this->bankTransactionService = $bankTransactionService;
    }

    /**
     * Display a listing of bank transactions
     */
    public function index(Request $request)
    {
        $this->authorize('view-bank-transactions');

        $transactions = BankTransaction::with(['fromAccount', 'toAccount', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('transaction_number', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->transaction_type, function ($query, $type) {
                $query->where('transaction_type', $type);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->where('transaction_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->where('transaction_date', '<=', $dateTo);
            })
            ->orderBy('transaction_date', 'desc')
            ->paginate($request->get('per_page', 15))
            ->appends($request->query());

        // Get Cash and Bank accounts
        $cashAccounts = Account::where('code', 'LIKE', '1000%')
            ->where('is_active', true)
            ->get();
        $bankAccounts = Account::where('code', 'LIKE', '1100%')
            ->where('is_active', true)
            ->get();

        return Inertia::render('BankTransactions/Index', [
            'transactions' => $transactions,
            'cashAccounts' => $cashAccounts,
            'bankAccounts' => $bankAccounts,
            'filters' => $request->only(['search', 'transaction_type', 'date_from', 'date_to', 'per_page']),
        ]);
    }

    /**
     * Store a newly created bank transaction
     */
    public function store(StoreBankTransactionRequest $request)
    {
        $validated = $request->validated();

        $this->bankTransactionService->createBankTransaction($validated, $request->user()->id);

        return redirect()->route('bank-transactions.index')
            ->with('success', 'Bank transaction created successfully.');
    }

    /**
     * Remove the specified bank transaction
     */
    public function destroy(BankTransaction $bankTransaction)
    {
        $this->authorize('delete-bank-transactions');

        $this->bankTransactionService->deleteBankTransaction($bankTransaction);

        return redirect()->route('bank-transactions.index')
            ->with('success', 'Bank transaction deleted successfully.');
    }
}
