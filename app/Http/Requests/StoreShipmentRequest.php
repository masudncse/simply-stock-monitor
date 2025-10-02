<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create-shipments');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sale_id' => 'required|exists:sales,id',
            'courier_id' => 'nullable|exists:couriers,id',
            'courier_service' => 'nullable|string|max:255',
            'tracking_number' => 'nullable|string|max:255',
            'shipping_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:shipping_date',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'recipient_address' => 'required|string',
            'recipient_city' => 'nullable|string|max:100',
            'recipient_district' => 'nullable|string|max:100',
            'recipient_postal_code' => 'nullable|string|max:20',
            'number_of_packages' => 'required|integer|min:1',
            'total_weight' => 'nullable|numeric|min:0',
            'package_dimensions' => 'nullable|string|max:100',
            'shipping_cost' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,picked_up,in_transit,out_for_delivery,delivered,cancelled,returned',
            'notes' => 'nullable|string',
            'special_instructions' => 'nullable|string',
        ];
    }
}
