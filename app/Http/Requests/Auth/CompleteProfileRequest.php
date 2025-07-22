<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteProfileRequest extends FormRequest
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
        $baseRules = [
            'role' => ['required', Rule::in(['student', 'dorm'])],
        ];

        $studentRules = [
            'school_name' => 'required_if:role,student|string|max:255',
            'age' => 'nullable|integer|min:16|max:100',
            'address' => 'nullable|string|max:500',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_contact_no' => 'nullable|string|max:20',
        ];

        $dormRules = [
            'establishment_name' => 'required_if:role,dorm|string|max:255',
            'description' => 'nullable|string|max:1000',
            'establishment_address' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'contact_email' => 'nullable|email|max:255',
            'property_type' => ['nullable', Rule::in(['dormitory', 'apartment', 'bedspace', 'homestay'])],
            'gender_policy' => ['nullable', Rule::in(['co-ed', 'male_only', 'female_only'])],
            'amenities' => 'nullable|array',
        ];

        return array_merge($baseRules, $studentRules, $dormRules);
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'school_name' => 'school name',
            'guardian_contact_no' => 'guardian contact number',
            'establishment_name' => 'establishment name',
            'establishment_address' => 'establishment address',
            'zip_code' => 'zip code',
            'contact_email' => 'contact email',
            'property_type' => 'property type',
            'gender_policy' => 'gender policy',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role.required' => 'Please select whether you are a student or dorm owner.',
            'school_name.required_if' => 'School name is required for students.',
            'establishment_name.required_if' => 'Establishment name is required for dorm owners.',
        ];
    }
}
