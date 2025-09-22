<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetProductStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view-stock');
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
        ];
    }
}
