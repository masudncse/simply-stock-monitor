<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetProductByBarcodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view-products');
    }

    public function rules(): array
    {
        return [
            'barcode' => 'required|string',
        ];
    }
}
