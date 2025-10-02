<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SystemSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'low_stock_threshold' => 'required|integer|min:1|max:1000',
            'auto_generate_invoice' => 'required|boolean',
            'require_approval_for_purchases' => 'required|boolean',
            'require_approval_for_sales' => 'required|boolean',
            'enable_barcode_scanning' => 'required|boolean',
            'enable_inventory_tracking' => 'required|boolean',
            'enable_multi_warehouse' => 'required|boolean',
            'default_tax_rate' => 'required|numeric|min:0|max:100',
            'default_currency' => 'required|string|max:3',
            'backup_frequency' => 'required|in:daily,weekly,monthly',
            'barcode_format' => 'required|in:CODE128,EAN13,QR',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'low_stock_threshold.required' => 'Low stock threshold is required.',
            'low_stock_threshold.integer' => 'Low stock threshold must be a number.',
            'low_stock_threshold.min' => 'Low stock threshold must be at least 1.',
            'low_stock_threshold.max' => 'Low stock threshold may not be greater than 1000.',
            'auto_generate_invoice.required' => 'Auto generate invoice setting is required.',
            'auto_generate_invoice.boolean' => 'Auto generate invoice must be true or false.',
            'require_approval_for_purchases.required' => 'Purchase approval setting is required.',
            'require_approval_for_purchases.boolean' => 'Purchase approval must be true or false.',
            'require_approval_for_sales.required' => 'Sales approval setting is required.',
            'require_approval_for_sales.boolean' => 'Sales approval must be true or false.',
            'enable_barcode_scanning.required' => 'Barcode scanning setting is required.',
            'enable_barcode_scanning.boolean' => 'Barcode scanning must be true or false.',
            'enable_inventory_tracking.required' => 'Inventory tracking setting is required.',
            'enable_inventory_tracking.boolean' => 'Inventory tracking must be true or false.',
            'enable_multi_warehouse.required' => 'Multi warehouse setting is required.',
            'enable_multi_warehouse.boolean' => 'Multi warehouse must be true or false.',
            'default_tax_rate.required' => 'Default tax rate is required.',
            'default_tax_rate.numeric' => 'Default tax rate must be a number.',
            'default_tax_rate.min' => 'Default tax rate must be at least 0.',
            'default_tax_rate.max' => 'Default tax rate may not be greater than 100.',
            'default_currency.required' => 'Default currency is required.',
            'default_currency.max' => 'Default currency may not be greater than 3 characters.',
            'backup_frequency.required' => 'Backup frequency is required.',
            'backup_frequency.in' => 'Backup frequency must be daily, weekly, or monthly.',
        ];
    }
}
