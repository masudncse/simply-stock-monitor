<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create-expenses');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expense_number' => 'required|string|max:50|unique:expenses,expense_number',
            'account_id' => 'required|exists:accounts,id',
            'expense_date' => 'required|date',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|in:cash,bank,cheque,card',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ];
    }
}
