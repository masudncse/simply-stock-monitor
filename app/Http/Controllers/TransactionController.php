<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class TransactionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-transactions');

        $transactions = Transaction::with(['account', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%")
                      ->orWhereHas('account', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                      });
            })
            ->when($request->account_id, function ($query, $accountId) {
                $query->where('account_id', $accountId);
            })
            ->when($request->reference_type, function ($query, $referenceType) {
                $query->where('reference_type', $referenceType);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('transaction_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('transaction_date', '<=', $dateTo);
            });

        // Sorting
        $sortBy = $request->get('sort_by', 'transaction_date');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSortColumns = ['transaction_date', 'debit', 'credit', 'created_at'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'transaction_date';
        }
        
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        $perPage = $request->get('per_page', 15);
        $transactions = $transactions->orderBy($sortBy, $sortDirection)->paginate($perPage)->appends($request->query());

        // Get accounts for filter
        $accounts = Account::where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name']);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'filters' => $request->only(['search', 'account_id', 'reference_type', 'date_from', 'date_to', 'sort_by', 'sort_direction', 'per_page']),
        ]);
    }
}

