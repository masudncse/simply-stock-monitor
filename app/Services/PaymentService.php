<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Create a new payment
     */
    public function createPayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $payment = Payment::create([
                ...$data,
                'created_by' => auth()->id(),
            ]);

            // Create corresponding transaction
            $this->createPaymentTransaction($payment);

            return $payment;
        });
    }

    /**
     * Update a payment
     */
    public function updatePayment(Payment $payment, array $data): Payment
    {
        return DB::transaction(function () use ($payment, $data) {
            // Delete existing transaction
            $this->deletePaymentTransaction($payment);

            // Update payment
            $payment->update($data);

            // Create new transaction
            $this->createPaymentTransaction($payment);

            return $payment;
        });
    }

    /**
     * Delete a payment
     */
    public function deletePayment(Payment $payment): bool
    {
        return DB::transaction(function () use ($payment) {
            // Delete corresponding transaction
            $this->deletePaymentTransaction($payment);

            return $payment->delete();
        });
    }

    /**
     * Create transaction for payment
     */
    private function createPaymentTransaction(Payment $payment): void
    {
        $account = Account::find($payment->account_id);
        
        if (!$account) {
            throw new \Exception('Account not found.');
        }

        $transactionData = [
            'account_id' => $payment->account_id,
            'transaction_date' => $payment->payment_date,
            'reference_type' => 'payment',
            'reference_id' => $payment->id,
            'description' => $payment->notes ?: "Payment - {$payment->voucher_number}",
            'created_by' => $payment->created_by,
        ];

        if ($payment->voucher_type === 'receipt') {
            // Receipt increases cash/bank (debit for assets)
            if (in_array($account->type, ['asset'])) {
                $transactionData['debit'] = $payment->amount;
                $transactionData['credit'] = 0;
            } else {
                $transactionData['debit'] = 0;
                $transactionData['credit'] = $payment->amount;
            }
        } else {
            // Payment decreases cash/bank (credit for assets)
            if (in_array($account->type, ['asset'])) {
                $transactionData['debit'] = 0;
                $transactionData['credit'] = $payment->amount;
            } else {
                $transactionData['debit'] = $payment->amount;
                $transactionData['credit'] = 0;
            }
        }

        Transaction::create($transactionData);
    }

    /**
     * Delete transaction for payment
     */
    private function deletePaymentTransaction(Payment $payment): void
    {
        Transaction::where('reference_type', 'payment')
            ->where('reference_id', $payment->id)
            ->delete();
    }

    /**
     * Get payment summary by account
     */
    public function getPaymentSummaryByAccount(int $accountId, string $dateFrom = null, string $dateTo = null): array
    {
        $query = Payment::where('account_id', $accountId);

        if ($dateFrom) {
            $query->where('payment_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('payment_date', '<=', $dateTo);
        }

        $receipts = $query->where('voucher_type', 'receipt')->sum('amount');
        $payments = $query->where('voucher_type', 'payment')->sum('amount');

        return [
            'receipts' => $receipts,
            'payments' => $payments,
            'net_amount' => $receipts - $payments,
        ];
    }
}
