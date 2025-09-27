<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanySettingsRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_id' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
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
            'name.required' => 'Company name is required.',
            'name.max' => 'Company name may not be greater than 255 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'Email address may not be greater than 255 characters.',
            'phone.max' => 'Phone number may not be greater than 20 characters.',
            'address.max' => 'Address may not be greater than 500 characters.',
            'city.max' => 'City may not be greater than 100 characters.',
            'state.max' => 'State may not be greater than 100 characters.',
            'postal_code.max' => 'Postal code may not be greater than 20 characters.',
            'country.max' => 'Country may not be greater than 100 characters.',
            'tax_id.max' => 'Tax ID may not be greater than 50 characters.',
            'website.url' => 'Please provide a valid website URL.',
            'website.max' => 'Website URL may not be greater than 255 characters.',
        ];
    }
}
