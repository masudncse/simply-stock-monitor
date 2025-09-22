<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetStockHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view-stock');
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ];
    }
}
