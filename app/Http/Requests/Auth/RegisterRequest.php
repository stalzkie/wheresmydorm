<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'contact_no' => 'required|string|max:20',
            'role' => ['required', Rule::in(['student', 'dorm'])],
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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
            'description' => 'required_if:role,dorm|string|max:1000',
            'establishment_address' => 'required_if:role,dorm|string|max:255',
            'zip_code' => 'required_if:role,dorm|string|max:10',
            'contact_email' => 'required_if:role,dorm|email|max:255',
            'cover_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'property_type' => ['required_if:role,dorm', Rule::in(['dormitory', 'apartment', 'bedspace', 'homestay'])],
            'gender_policy' => ['required_if:role,dorm', Rule::in(['co-ed', 'male_only', 'female_only'])],
            'amenities' => 'required_if:role,dorm|array',
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
            'contact_no' => 'contact number',
            'school_name' => 'school name',
            'guardian_contact_no' => 'guardian contact number',
            'establishment_name' => 'establishment name',
            'establishment_address' => 'establishment address',
            'zip_code' => 'zip code',
            'contact_email' => 'contact email',
            'cover_photo' => 'cover photo',
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
            'description.required_if' => 'Description is required for dorm owners.',
            'establishment_address.required_if' => 'Establishment address is required for dorm owners.',
            'zip_code.required_if' => 'Zip code is required for dorm owners.',
            'contact_email.required_if' => 'Contact email is required for dorm owners.',
            'property_type.required_if' => 'Property type is required for dorm owners.',
            'gender_policy.required_if' => 'Gender policy is required for dorm owners.',
            'amenities.required_if' => 'Please select at least one amenity for your dorm.',
        ];
    }
}
