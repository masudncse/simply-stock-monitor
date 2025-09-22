<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Supplier;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use AuthorizesRequests;

    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('view-payments');

        $payments = Payment::with(['account', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('voucher_number', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->voucher_type, function ($query, $type) {
                $query->where('voucher_type', $type);
            })
            ->when($request->account_id, function ($query, $accountId) {
                $query->where('account_id', $accountId);
            })
            ->when($request->date_from, function ($query, $date) {
                $query->where('payment_date', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->where('payment_date', '<=', $date);
            })
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        $accounts = Account::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'accounts' => $accounts,
            'filters' => $request->only(['search', 'voucher_type', 'account_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create-payments');

        $accounts = Account::where('is_active', true)->orderBy('code')->get();
        $customers = Customer::where('is_active', true)->orderBy('name')->get();
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Payments/Create', [
            'accounts' => $accounts,
            'customers' => $customers,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        $payment = $this->paymentService->createPayment($request->validated());

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $this->authorize('view-payments');

        $payment->load(['account', 'createdBy']);

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $this->authorize('edit-payments');

        $accounts = Account::where('is_active', true)->orderBy('code')->get();
        $customers = Customer::where('is_active', true)->orderBy('name')->get();
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Payments/Edit', [
            'payment' => $payment,
            'accounts' => $accounts,
            'customers' => $customers,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $this->authorize('edit-payments');

        $request->validate([
            'voucher_number' => 'required|string|max:50|unique:payments,voucher_number,' . $payment->id,
            'voucher_type' => 'required|in:receipt,payment',
            'payment_date' => 'required|date',
            'account_id' => 'required|exists:accounts,id',
            'reference_type' => 'nullable|in:customer,supplier',
            'reference_id' => 'nullable|integer',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|in:cash,bank,cheque,card',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $payment->update($request->all());

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $this->authorize('delete-payments');

        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
