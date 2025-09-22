<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    /**
     * Create a new expense
     */
    public function createExpense(array $data): Expense
    {
        return DB::transaction(function () use ($data) {
            $expense = Expense::create([
                ...$data,
                'created_by' => auth()->id(),
            ]);

            // Create corresponding transaction
            $this->createExpenseTransaction($expense);

            return $expense;
        });
    }

    /**
     * Update an expense
     */
    public function updateExpense(Expense $expense, array $data): Expense
    {
        return DB::transaction(function () use ($expense, $data) {
            // Delete existing transaction
            $this->deleteExpenseTransaction($expense);

            // Update expense
            $expense->update($data);

            // Create new transaction
            $this->createExpenseTransaction($expense);

            return $expense;
        });
    }

    /**
     * Delete an expense
     */
    public function deleteExpense(Expense $expense): bool
    {
        return DB::transaction(function () use ($expense) {
            // Delete corresponding transaction
            $this->deleteExpenseTransaction($expense);

            return $expense->delete();
        });
    }

    /**
     * Create transaction for expense
     */
    private function createExpenseTransaction(Expense $expense): void
    {
        $account = Account::find($expense->account_id);
        
        if (!$account) {
            throw new \Exception('Account not found.');
        }

        $transactionData = [
            'account_id' => $expense->account_id,
            'transaction_date' => $expense->expense_date,
            'reference_type' => 'expense',
            'reference_id' => $expense->id,
            'description' => $expense->description,
            'created_by' => $expense->created_by,
        ];

        // Expense increases expense account (debit for expense accounts)
        if ($account->type === 'expense') {
            $transactionData['debit'] = $expense->amount;
            $transactionData['credit'] = 0;
        } else {
            // If expense is recorded against non-expense account
            $transactionData['debit'] = $expense->amount;
            $transactionData['credit'] = 0;
        }

        Transaction::create($transactionData);
    }

    /**
     * Delete transaction for expense
     */
    private function deleteExpenseTransaction(Expense $expense): void
    {
        Transaction::where('reference_type', 'expense')
            ->where('reference_id', $expense->id)
            ->delete();
    }

    /**
     * Get expense summary by category
     */
    public function getExpenseSummaryByCategory(string $dateFrom = null, string $dateTo = null): array
    {
        $query = Expense::query();

        if ($dateFrom) {
            $query->where('expense_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('expense_date', '<=', $dateTo);
        }

        return $query->selectRaw('category, SUM(amount) as total_amount, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('total_amount', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Get expense summary by account
     */
    public function getExpenseSummaryByAccount(string $dateFrom = null, string $dateTo = null): array
    {
        $query = Expense::with('account');

        if ($dateFrom) {
            $query->where('expense_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('expense_date', '<=', $dateTo);
        }

        return $query->selectRaw('account_id, SUM(amount) as total_amount, COUNT(*) as count')
            ->groupBy('account_id')
            ->orderBy('total_amount', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Get monthly expense trend
     */
    public function getMonthlyExpenseTrend(int $year = null): array
    {
        $year = $year ?: date('Y');
        
        return Expense::selectRaw('MONTH(expense_date) as month, SUM(amount) as total_amount')
            ->whereYear('expense_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }
}
