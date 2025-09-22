<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class AccountService
{
    /**
     * Create a new account
     */
    public function createAccount(array $data): Account
    {
        return DB::transaction(function () use ($data) {
            $account = Account::create($data);
            
            // Create opening balance transaction if opening_balance is provided
            if (isset($data['opening_balance']) && $data['opening_balance'] != 0) {
                $this->createOpeningBalanceTransaction($account, $data['opening_balance']);
            }
            
            return $account;
        });
    }

    /**
     * Update an account
     */
    public function updateAccount(Account $account, array $data): Account
    {
        return DB::transaction(function () use ($account, $data) {
            $account->update($data);
            
            // Handle opening balance changes
            if (isset($data['opening_balance'])) {
                $this->updateOpeningBalanceTransaction($account, $data['opening_balance']);
            }
            
            return $account;
        });
    }

    /**
     * Delete an account
     */
    public function deleteAccount(Account $account): bool
    {
        return DB::transaction(function () use ($account) {
            // Check if account has transactions
            if ($account->transactions()->count() > 0) {
                throw new \Exception('Cannot delete account with existing transactions.');
            }

            // Check if account has child accounts
            if ($account->childAccounts()->count() > 0) {
                throw new \Exception('Cannot delete account with child accounts.');
            }

            return $account->delete();
        });
    }

    /**
     * Calculate account balance
     */
    public function calculateBalance(Account $account): float
    {
        $debitTotal = $account->transactions()->sum('debit');
        $creditTotal = $account->transactions()->sum('credit');
        
        return $debitTotal - $creditTotal;
    }

    /**
     * Get trial balance
     */
    public function getTrialBalance(): array
    {
        $accounts = Account::with('transactions')->get();
        $trialBalance = [];

        foreach ($accounts as $account) {
            $balance = $this->calculateBalance($account);
            
            if ($balance != 0) {
                $trialBalance[] = [
                    'account' => $account,
                    'debit' => $balance > 0 ? $balance : 0,
                    'credit' => $balance < 0 ? abs($balance) : 0,
                ];
            }
        }

        return $trialBalance;
    }

    /**
     * Create opening balance transaction
     */
    private function createOpeningBalanceTransaction(Account $account, float $openingBalance): void
    {
        if ($openingBalance == 0) {
            return;
        }

        $transactionData = [
            'account_id' => $account->id,
            'transaction_date' => now(),
            'reference_type' => 'opening_balance',
            'reference_id' => $account->id,
            'description' => 'Opening Balance',
            'created_by' => auth()->id(),
        ];

        if ($openingBalance > 0) {
            // For assets, positive opening balance is debit
            if (in_array($account->type, ['asset', 'expense'])) {
                $transactionData['debit'] = $openingBalance;
                $transactionData['credit'] = 0;
            } else {
                // For liabilities, equity, income, positive opening balance is credit
                $transactionData['debit'] = 0;
                $transactionData['credit'] = $openingBalance;
            }
        } else {
            // For negative opening balance
            if (in_array($account->type, ['asset', 'expense'])) {
                $transactionData['debit'] = 0;
                $transactionData['credit'] = abs($openingBalance);
            } else {
                $transactionData['debit'] = abs($openingBalance);
                $transactionData['credit'] = 0;
            }
        }

        Transaction::create($transactionData);
    }

    /**
     * Update opening balance transaction
     */
    private function updateOpeningBalanceTransaction(Account $account, float $openingBalance): void
    {
        // Delete existing opening balance transaction
        $account->transactions()
            ->where('reference_type', 'opening_balance')
            ->where('reference_id', $account->id)
            ->delete();

        // Create new opening balance transaction
        $this->createOpeningBalanceTransaction($account, $openingBalance);
    }
}
