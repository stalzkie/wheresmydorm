'use client';

import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    contact_no: string;
    profile_picture: File | null;
    role: 'student' | 'dorm' | '';

    // Student fields
    school_name: string;
    age: string;
    address: string;
    guardian_name: string;
    guardian_contact_no: string;

    // Dorm fields
    establishment_name: string;
    description: string;
    establishment_address: string;
    zip_code: string;
    contact_email: string;
    cover_photo: File | null;
    property_type: 'dormitory' | 'apartment' | 'bedspace' | 'homestay' | '';
    gender_policy: 'co-ed' | 'male_only' | 'female_only' | '';
    amenities: string[];
};

const AMENITIES = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'ac', label: 'Aircon' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'cctv', label: 'CCTV' },
    { value: 'cooking', label: 'Cooking' },
] as const;

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        contact_no: '',
        profile_picture: null,
        role: '',

        // Student fields
        school_name: '',
        age: '',
        address: '',
        guardian_name: '',
        guardian_contact_no: '',

        // Dorm fields
        establishment_name: '',
        description: '',
        establishment_address: '',
        zip_code: '',
        contact_email: '',
        cover_photo: null,
        property_type: '',
        gender_policy: '',
        amenities: [],
    });

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        const updatedAmenities = checked ? [...data.amenities, amenity] : data.amenities.filter((item) => item !== amenity);
        setData('amenities', updatedAmenities);
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Create a clean submission object with only relevant fields
        const submitData: Record<string, any> = {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            contact_no: data.contact_no,
            role: data.role,
        };

        // Add profile picture if selected
        if (data.profile_picture) {
            submitData.profile_picture = data.profile_picture;
        }

        // Add role-specific fields ONLY for the selected role
        if (data.role === 'student') {
            submitData.school_name = data.school_name;
            if (data.age) submitData.age = data.age;
            if (data.address) submitData.address = data.address;
            if (data.guardian_name) submitData.guardian_name = data.guardian_name;
            if (data.guardian_contact_no) submitData.guardian_contact_no = data.guardian_contact_no;
        } else if (data.role === 'dorm') {
            submitData.establishment_name = data.establishment_name;
            submitData.description = data.description;
            submitData.establishment_address = data.establishment_address;
            submitData.zip_code = data.zip_code;
            submitData.contact_email = data.contact_email;
            submitData.property_type = data.property_type;
            submitData.gender_policy = data.gender_policy;
            submitData.amenities = data.amenities;

            // Add cover photo if selected
            if (data.cover_photo) {
                submitData.cover_photo = data.cover_photo;
            }
        }

        console.log('Submitting registration form with data:', submitData);

        post(route('register'), submitData, {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors: Record<string, string>) => {
                console.log('Registration errors:', errors);
            },
            onSuccess: () => {
                console.log('Registration successful!');
            },
        });
    };

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1:
                return data.role !== '';
            case 2:
                return data.name && data.email && data.password && data.password_confirmation && data.contact_no;
            case 3:
                if (data.role === 'student') {
                    return data.school_name;
                }
                return (
                    data.establishment_name &&
                    data.description &&
                    data.establishment_address &&
                    data.zip_code &&
                    data.contact_email &&
                    data.property_type &&
                    data.gender_policy
                );
            default:
                return false;
        }
    };

    const renderStepIndicator = () => (
        <div className="mb-8 flex justify-center">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            currentStep > i + 1
                                ? 'bg-green-500 text-white'
                                : currentStep === i + 1
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        {currentStep > i + 1 ? '✓' : i + 1}
                    </div>
                    {i < totalSteps - 1 && <div className={`mx-2 h-1 w-16 ${currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Who are you?</h3>
                <Select value={data.role} onValueChange={(value: 'student' | 'dorm') => setData('role', value)}>
                    <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                        <SelectItem value="student" className="dark:text-gray-100 dark:focus:bg-gray-600">
                            I'm a Student looking for a place
                        </SelectItem>
                        <SelectItem value="dorm" className="dark:text-gray-100 dark:focus:bg-gray-600">
                            I'm a Dorm Manager / Owner
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.role} />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account Details</h3>

            <div className="grid gap-4">
                <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Full Name
                    </Label>
                    <Input
                        id="name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                        className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="contact_no" className="text-gray-700 dark:text-gray-300">
                        Contact Number
                    </Label>
                    <Input
                        id="contact_no"
                        type="tel"
                        required
                        value={data.contact_no}
                        onChange={(e) => setData('contact_no', e.target.value)}
                        placeholder="e.g. 09123456789"
                        className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                    <InputError message={errors.contact_no} />
                </div>

                <div>
                    <Label htmlFor="profile_picture" className="text-gray-700 dark:text-gray-300">
                        Profile Picture (Optional)
                    </Label>
                    <Input
                        id="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('profile_picture', e.target.files?.[0] || null)}
                        className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 file:dark:bg-gray-600 file:dark:text-gray-100"
                    />
                    <InputError message={errors.profile_picture} />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {data.role === 'student' ? 'Student Information' : 'Dormitory Information'}
            </h3>

            {data.role === 'student' ? (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="school_name" className="text-gray-700 dark:text-gray-300">
                            School Name
                        </Label>
                        <Input
                            id="school_name"
                            required
                            value={data.school_name}
                            onChange={(e) => setData('school_name', e.target.value)}
                            placeholder="University of Example"
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.school_name} />
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-600 dark:text-gray-400">Additional Details (Optional)</h4>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                                    Age
                                </Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={data.age}
                                    onChange={(e) => setData('age', e.target.value)}
                                    placeholder="e.g. 18"
                                    className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                                <InputError message={errors.age} />
                            </div>
                            <div>
                                <Label htmlFor="guardian_name" className="text-gray-700 dark:text-gray-300">
                                    Guardian's Name
                                </Label>
                                <Input
                                    id="guardian_name"
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                    placeholder="Parent/Guardian name"
                                    className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                                <InputError message={errors.guardian_name} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                                Permanent Address
                            </Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Your home address"
                                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div>
                            <Label htmlFor="guardian_contact_no" className="text-gray-700 dark:text-gray-300">
                                Guardian's Contact No.
                            </Label>
                            <Input
                                id="guardian_contact_no"
                                type="tel"
                                value={data.guardian_contact_no}
                                onChange={(e) => setData('guardian_contact_no', e.target.value)}
                                placeholder="Parent/Guardian contact"
                                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            <InputError message={errors.guardian_contact_no} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="establishment_name" className="text-gray-700 dark:text-gray-300">
                            Dorm / Establishment Name
                        </Label>
                        <Input
                            id="establishment_name"
                            required
                            value={data.establishment_name}
                            onChange={(e) => setData('establishment_name', e.target.value)}
                            placeholder="Your dorm name"
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.establishment_name} />
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Tell students what makes your place great..."
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="establishment_address" className="text-gray-700 dark:text-gray-300">
                            Full Address
                        </Label>
                        <Input
                            id="establishment_address"
                            required
                            value={data.establishment_address}
                            onChange={(e) => setData('establishment_address', e.target.value)}
                            placeholder="e.g., #123 Narra St, Brgy. Villamonte, Bacolod City"
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <InputError message={errors.establishment_address} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="zip_code" className="text-gray-700 dark:text-gray-300">
                                Zip Code
                            </Label>
                            <Input
                                id="zip_code"
                                required
                                value={data.zip_code}
                                onChange={(e) => setData('zip_code', e.target.value)}
                                placeholder="6100"
                                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            <InputError message={errors.zip_code} />
                        </div>
                        <div>
                            <Label htmlFor="contact_email" className="text-gray-700 dark:text-gray-300">
                                Public Contact Email
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                required
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                placeholder="inquiries@yourdorm.com"
                                className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            <InputError message={errors.contact_email} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="property_type" className="text-gray-700 dark:text-gray-300">
                                Property Type
                            </Label>
                            <Select value={data.property_type} onValueChange={(v: typeof data.property_type) => setData('property_type', v)}>
                                <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                                    <SelectItem value="dormitory" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Dormitory
                                    </SelectItem>
                                    <SelectItem value="apartment" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Apartment
                                    </SelectItem>
                                    <SelectItem value="bedspace" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Bedspace
                                    </SelectItem>
                                    <SelectItem value="homestay" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Homestay
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.property_type} />
                        </div>
                        <div>
                            <Label htmlFor="gender_policy" className="text-gray-700 dark:text-gray-300">
                                Gender Policy
                            </Label>
                            <Select value={data.gender_policy} onValueChange={(v: typeof data.gender_policy) => setData('gender_policy', v)}>
                                <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                                    <SelectValue placeholder="Select policy" />
                                </SelectTrigger>
                                <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                                    <SelectItem value="co-ed" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Co-Ed
                                    </SelectItem>
                                    <SelectItem value="male_only" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Male Only
                                    </SelectItem>
                                    <SelectItem value="female_only" className="dark:text-gray-100 dark:focus:bg-gray-600">
                                        Female Only
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender_policy} />
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-700 dark:text-gray-300">Amenities</Label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3 dark:border-gray-600 dark:bg-gray-700">
                            {AMENITIES.map((amenity) => (
                                <div key={amenity.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={amenity.value}
                                        checked={data.amenities.includes(amenity.value)}
                                        onCheckedChange={(checked) => handleAmenityChange(amenity.value, checked as boolean)}
                                        className="dark:border-gray-500 dark:data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor={amenity.value} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {amenity.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.amenities} />
                    </div>

                    <div>
                        <Label htmlFor="cover_photo" className="text-gray-700 dark:text-gray-300">
                            Cover Photo (Optional)
                        </Label>
                        <Input
                            id="cover_photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('cover_photo', e.target.files?.[0] || null)}
                            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 file:dark:bg-gray-600 file:dark:text-gray-100"
                        />
                        <InputError message={errors.cover_photo} />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AuthLayout title="Create an account" description="Join our community of students and dorm owners">
            <Head title="Register" />

            {renderStepIndicator()}

            {/* Display global errors for better debugging */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/30">
                    <h3 className="mb-2 text-sm font-medium text-red-800 dark:text-red-100">Please fix the following errors:</h3>
                    <ul className="space-y-1 text-sm text-red-700 dark:text-red-200">
                        {Object.entries(errors).map(([field, message]) => (
                            <li key={field}>
                                <strong className="dark:text-red-100">{field}:</strong> <span className="dark:text-red-200">{message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={submit} className="space-y-6">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" onClick={prevStep} disabled={processing}>
                                Previous
                            </Button>
                        )}

                        <div className="ml-auto">
                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={nextStep} disabled={!canProceedToNextStep()}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing || !canProceedToNextStep()}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
