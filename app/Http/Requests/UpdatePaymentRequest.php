<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('edit-payments');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'voucher_number' => 'required|string|max:50|unique:payments,voucher_number,' . $this->payment->id,
            'voucher_type' => 'required|in:receipt,payment',
            'payment_date' => 'required|date',
            'account_id' => 'required|exists:accounts,id',
            'reference_type' => 'nullable|in:customer,supplier',
            'reference_id' => 'nullable|integer',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|in:cash,bank,cheque,card',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ];
    }
}
