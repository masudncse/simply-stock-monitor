<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class AccountingService
{
    /**
     * Create double-entry transactions
     */
    public function createTransaction(array $debitAccount, array $creditAccount, float $amount, string $description, string $referenceType = null, int $referenceId = null, int $userId = null): array
    {
        return DB::transaction(function () use ($debitAccount, $creditAccount, $amount, $description, $referenceType, $referenceId, $userId) {
            $transactions = [];

            // Debit transaction
            $transactions[] = Transaction::create([
                'account_id' => $debitAccount['account_id'],
                'transaction_date' => $debitAccount['date'] ?? now()->toDateString(),
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'debit' => $amount,
                'credit' => 0,
                'description' => $description,
                'created_by' => $userId ?? auth()->id(),
            ]);

            // Credit transaction
            $transactions[] = Transaction::create([
                'account_id' => $creditAccount['account_id'],
                'transaction_date' => $creditAccount['date'] ?? now()->toDateString(),
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'debit' => 0,
                'credit' => $amount,
                'description' => $description,
                'created_by' => $userId ?? auth()->id(),
            ]);

            return $transactions;
        });
    }

    /**
     * Process payment voucher
     */
    public function processPayment(array $paymentData, int $userId): Payment
    {
        return DB::transaction(function () use ($paymentData, $userId) {
            $voucherNumber = $this->generateVoucherNumber($paymentData['voucher_type']);

            $payment = Payment::create([
                'voucher_number' => $voucherNumber,
                'voucher_type' => $paymentData['voucher_type'],
                'payment_date' => $paymentData['payment_date'],
                'account_id' => $paymentData['account_id'],
                'reference_type' => $paymentData['reference_type'] ?? null,
                'reference_id' => $paymentData['reference_id'] ?? null,
                'amount' => $paymentData['amount'],
                'payment_mode' => $paymentData['payment_mode'],
                'reference_number' => $paymentData['reference_number'] ?? null,
                'notes' => $paymentData['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Create accounting transactions
            $this->createPaymentTransactions($payment);

            return $payment;
        });
    }

    /**
     * Create accounting transactions for payment
     */
    protected function createPaymentTransactions(Payment $payment): void
    {
        if ($payment->voucher_type === 'payment') {
            // Payment: Debit the account being paid from, Credit Cash/Bank
            $this->createTransaction(
                ['account_id' => $payment->account_id, 'date' => $payment->payment_date],
                ['account_id' => $this->getCashAccountId(), 'date' => $payment->payment_date],
                $payment->amount,
                "Payment: {$payment->notes}",
                'payment',
                $payment->id,
                $payment->created_by
            );
        } else {
            // Receipt: Debit Cash/Bank, Credit the account receiving payment
            $this->createTransaction(
                ['account_id' => $this->getCashAccountId(), 'date' => $payment->payment_date],
                ['account_id' => $payment->account_id, 'date' => $payment->payment_date],
                $payment->amount,
                "Receipt: {$payment->notes}",
                'payment',
                $payment->id,
                $payment->created_by
            );
        }
    }

    /**
     * Generate trial balance
     */
    public function generateTrialBalance(string $startDate = null, string $endDate = null): array
    {
        $query = Transaction::query();

        if ($startDate) {
            $query->where('transaction_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('transaction_date', '<=', $endDate);
        }

        $transactions = $query->with('account')->get();

        $trialBalance = [];
        foreach ($transactions as $transaction) {
            $accountId = $transaction->account_id;
            $accountName = $transaction->account->name;

            if (!isset($trialBalance[$accountId])) {
                $trialBalance[$accountId] = [
                    'account_name' => $accountName,
                    'debit' => 0,
                    'credit' => 0,
                ];
            }

            $trialBalance[$accountId]['debit'] += $transaction->debit;
            $trialBalance[$accountId]['credit'] += $transaction->credit;
        }

        return $trialBalance;
    }

    /**
     * Generate profit and loss statement
     */
    public function generateProfitLoss(string $startDate, string $endDate): array
    {
        $incomeAccounts = Account::where('type', 'income')->pluck('id');
        $expenseAccounts = Account::where('type', 'expense')->pluck('id');

        $income = Transaction::whereIn('account_id', $incomeAccounts)
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('credit');

        $expenses = Transaction::whereIn('account_id', $expenseAccounts)
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('debit');

        $netProfit = $income - $expenses;

        return [
            'total_income' => $income,
            'total_expenses' => $expenses,
            'net_profit' => $netProfit,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ];
    }

    /**
     * Generate balance sheet
     */
    public function generateBalanceSheet(string $asOfDate): array
    {
        $assets = $this->getAccountBalances('asset', $asOfDate);
        $liabilities = $this->getAccountBalances('liability', $asOfDate);
        $equity = $this->getAccountBalances('equity', $asOfDate);

        $totalAssets = array_sum(array_column($assets, 'balance'));
        $totalLiabilities = array_sum(array_column($liabilities, 'balance'));
        $totalEquity = array_sum(array_column($equity, 'balance'));

        return [
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equity,
            'totals' => [
                'total_assets' => $totalAssets,
                'total_liabilities' => $totalLiabilities,
                'total_equity' => $totalEquity,
            ],
            'as_of_date' => $asOfDate,
        ];
    }

    /**
     * Get account balances for a specific type
     */
    protected function getAccountBalances(string $type, string $asOfDate): array
    {
        $accounts = Account::where('type', $type)->get();
        $balances = [];

        foreach ($accounts as $account) {
            $debit = Transaction::where('account_id', $account->id)
                ->where('transaction_date', '<=', $asOfDate)
                ->sum('debit');

            $credit = Transaction::where('account_id', $account->id)
                ->where('transaction_date', '<=', $asOfDate)
                ->sum('credit');

            $balance = $debit - $credit;

            if ($balance != 0) {
                $balances[] = [
                    'account_name' => $account->name,
                    'account_code' => $account->code,
                    'balance' => abs($balance),
                    'type' => $balance > 0 ? 'debit' : 'credit',
                ];
            }
        }

        return $balances;
    }

    /**
     * Generate voucher number
     */
    protected function generateVoucherNumber(string $type): string
    {
        $prefix = $type === 'payment' ? 'PAY' : 'REC';
        $lastPayment = Payment::where('voucher_type', $type)->orderBy('id', 'desc')->first();
        $nextNumber = $lastPayment ? $lastPayment->id + 1 : 1;
        
        return $prefix . '-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get cash account ID
     */
    protected function getCashAccountId(): int
    {
        $cashAccount = Account::where('code', '1000')->first();
        return $cashAccount ? $cashAccount->id : 1;
    }
}
