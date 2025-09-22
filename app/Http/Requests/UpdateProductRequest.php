<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->can('edit-products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product');
        
        return [
            'sku' => 'required|string|max:255|unique:products,sku,' . $productId,
            'barcode' => 'nullable|string|max:255|unique:products,barcode,' . $productId,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'unit' => 'required|string|max:50',
            'min_stock' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'sku.required' => 'SKU is required',
            'sku.unique' => 'SKU already exists',
            'barcode.unique' => 'Barcode already exists',
            'name.required' => 'Product name is required',
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'price.required' => 'Price is required',
            'price.min' => 'Price must be greater than or equal to 0',
            'cost_price.required' => 'Cost price is required',
            'cost_price.min' => 'Cost price must be greater than or equal to 0',
        ];
    }
}
