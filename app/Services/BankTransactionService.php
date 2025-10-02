<?php

namespace App\Services;

use App\Models\BankTransaction;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class BankTransactionService
{
    /**
     * Create a new bank transaction
     */
    public function createBankTransaction(array $data, int $userId): BankTransaction
    {
        return DB::transaction(function () use ($data, $userId) {
            // Generate transaction number
            $transactionNumber = $this->generateTransactionNumber();

            $bankTransaction = BankTransaction::create([
                'transaction_number' => $transactionNumber,
                'transaction_type' => $data['transaction_type'],
                'from_account_id' => $data['from_account_id'],
                'to_account_id' => $data['to_account_id'],
                'transaction_date' => $data['transaction_date'],
                'amount' => $data['amount'],
                'reference_number' => $data['reference_number'] ?? null,
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Create accounting transactions
            $this->createAccountingTransactions($bankTransaction);

            return $bankTransaction;
        });
    }

    /**
     * Create accounting transactions for bank transaction
     */
    protected function createAccountingTransactions(BankTransaction $bankTransaction): void
    {
        $description = $this->getTransactionDescription($bankTransaction);

        // Debit: To Account (money increases)
        Transaction::create([
            'account_id' => $bankTransaction->to_account_id,
            'transaction_date' => $bankTransaction->transaction_date,
            'reference_type' => 'bank_transaction',
            'reference_id' => $bankTransaction->id,
            'debit' => $bankTransaction->amount,
            'credit' => 0,
            'description' => $description,
            'created_by' => $bankTransaction->created_by,
        ]);

        // Credit: From Account (money decreases)
        Transaction::create([
            'account_id' => $bankTransaction->from_account_id,
            'transaction_date' => $bankTransaction->transaction_date,
            'reference_type' => 'bank_transaction',
            'reference_id' => $bankTransaction->id,
            'debit' => 0,
            'credit' => $bankTransaction->amount,
            'description' => $description,
            'created_by' => $bankTransaction->created_by,
        ]);
    }

    /**
     * Get transaction description based on type
     */
    protected function getTransactionDescription(BankTransaction $bankTransaction): string
    {
        $fromAccount = $bankTransaction->fromAccount->name;
        $toAccount = $bankTransaction->toAccount->name;

        switch ($bankTransaction->transaction_type) {
            case 'deposit':
                return "Cash deposit to {$toAccount}";
            case 'withdraw':
                return "Cash withdrawal from {$fromAccount}";
            case 'transfer':
                return "Transfer from {$fromAccount} to {$toAccount}";
            default:
                return $bankTransaction->description ?? 'Bank transaction';
        }
    }

    /**
     * Generate unique transaction number
     */
    protected function generateTransactionNumber(): string
    {
        $lastTransaction = BankTransaction::orderBy('id', 'desc')->first();
        $nextNumber = $lastTransaction ? $lastTransaction->id + 1 : 1;
        
        return 'BT-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Delete a bank transaction
     */
    public function deleteBankTransaction(BankTransaction $bankTransaction): void
    {
        DB::transaction(function () use ($bankTransaction) {
            // Delete related accounting transactions
            Transaction::where('reference_type', 'bank_transaction')
                ->where('reference_id', $bankTransaction->id)
                ->delete();

            // Delete bank transaction
            $bankTransaction->delete();
        });
    }
}

