'use client';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type CompleteProfileForm = {
    role: 'student' | 'dorm';
    contact_no: string;

    school_name: string;
    age: string;
    address: string;
    guardian_name: string;
    guardian_contact_no: string;

    establishment_name: string;
    description: string;
    establishment_address: string;
    zip_code: string;
    contact_email: string;
    property_type: 'dormitory' | 'apartment' | 'bedspace' | 'homestay' | '';
    gender_policy: 'co-ed' | 'male_only' | 'female_only' | '';
    amenities: string[];
};

export default function CompleteProfile() {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    const { data, setData, processing, errors } = useForm<CompleteProfileForm>({
        role: 'student',
        contact_no: '',

        school_name: '',
        age: '',
        address: '',
        guardian_name: '',
        guardian_contact_no: '',

        establishment_name: '',
        description: '',
        establishment_address: '',
        zip_code: '',
        contact_email: auth.user.email,
        property_type: '',
        gender_policy: '',
        amenities: [],
    });

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        setData('amenities', checked ? [...data.amenities, amenity] : data.amenities.filter((a) => a !== amenity));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('=== FORM SUBMISSION STARTED ===');
        console.log('Form data:', data);
        console.log('Current errors:', errors);
        console.log('Route URL:', route('auth.store-profile'));

        // Prepare data based on role to avoid sending unnecessary fields
        let submitData: Partial<CompleteProfileForm> = {
            role: data.role,
            contact_no: data.contact_no,
        };

        if (data.role === 'student') {
            submitData = {
                ...submitData,
                school_name: data.school_name,
                age: data.age || undefined,
                address: data.address || undefined,
                guardian_name: data.guardian_name || undefined,
                guardian_contact_no: data.guardian_contact_no || undefined,
            };
        } else if (data.role === 'dorm') {
            submitData = {
                ...submitData,
                establishment_name: data.establishment_name,
                description: data.description || undefined,
                establishment_address: data.establishment_address || undefined,
                zip_code: data.zip_code || undefined,
                contact_email: data.contact_email || undefined,
                property_type: data.property_type || undefined,
                gender_policy: data.gender_policy || undefined,
                amenities: data.amenities.length > 0 ? data.amenities : undefined,
            };
        }

        console.log('Filtered submit data:', submitData);

        // Use Inertia router directly to send only filtered data
        router.post(route('auth.store-profile'), submitData, {
            onStart: () => {
                console.log('Request started...');
            },
            onSuccess: () => {
                console.log('=== FORM SUBMISSION SUCCESS ===');
            },
            onError: (errors: Record<string, string>) => {
                console.log('=== FORM SUBMISSION ERROR ===');
                console.log('Validation errors:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white p-6 md:p-10 dark:bg-gray-900">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-9 fill-current text-gray-900 dark:text-gray-100" />
                                </div>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">Complete Your Profile</h1>
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Welcome, {auth.user.name}! Please tell us who you are.
                                </p>
                            </div>
                        </div>

                        <Head title="Complete Profile" />

                        {/* Debug Information - Remove in production */}
                        <div className="mb-4 rounded-md border border-yellow-400 bg-yellow-100 p-4 dark:border-yellow-600 dark:bg-yellow-900">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Debug Info:</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Processing: {processing ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Current role: {data.role}</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Contact: {data.contact_no}</p>
                            {Object.keys(errors).length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold text-red-800 dark:text-red-200">Errors:</p>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <p key={key} className="text-sm text-red-700 dark:text-red-300">
                                            {key}: {message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            <div className="space-y-2">
                                <Label className="font-medium text-gray-900 dark:text-gray-100">I am a...</Label>
                                <Select value={data.role} onValueChange={(value: 'student' | 'dorm') => setData('role', value)}>
                                    <SelectTrigger className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                                        <SelectValue placeholder="Select your role" className="text-gray-900 dark:text-gray-100" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                        <SelectItem
                                            value="student"
                                            className="text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Student looking for a place
                                        </SelectItem>
                                        <SelectItem
                                            value="dorm"
                                            className="text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Dorm Manager / Owner
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_no" className="font-medium text-gray-900 dark:text-gray-100">
                                    Contact Number
                                </Label>
                                <Input
                                    id="contact_no"
                                    type="tel"
                                    required
                                    value={data.contact_no}
                                    onChange={(e) => setData('contact_no', e.target.value)}
                                    placeholder="e.g. 09123456789"
                                    className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                                <InputError message={errors.contact_no} />
                            </div>

                            <hr className="border-gray-300 dark:border-gray-600" />

                            {data.role === 'student' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Student Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="school_name" className="text-gray-900 dark:text-gray-100">
                                                School Name
                                            </Label>
                                            <Input
                                                id="school_name"
                                                required
                                                value={data.school_name}
                                                onChange={(e) => setData('school_name', e.target.value)}
                                                placeholder="University of Example"
                                                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                                            />
                                            <InputError message={errors.school_name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="age">Age (Optional)</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                value={data.age}
                                                onChange={(e) => setData('age', e.target.value)}
                                                placeholder="18"
                                            />
                                            <InputError message={errors.age} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Full Address (Optional)</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Your current home address"
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="guardian_name">Guardian's Name (Optional)</Label>
                                            <Input
                                                id="guardian_name"
                                                value={data.guardian_name}
                                                onChange={(e) => setData('guardian_name', e.target.value)}
                                            />
                                            <InputError message={errors.guardian_name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="guardian_contact_no">Guardian's Contact No. (Optional)</Label>
                                            <Input
                                                id="guardian_contact_no"
                                                type="tel"
                                                value={data.guardian_contact_no}
                                                onChange={(e) => setData('guardian_contact_no', e.target.value)}
                                            />
                                            <InputError message={errors.guardian_contact_no} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.role === 'dorm' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Dormitory Information</h3>
                                    <div className="grid gap-2">
                                        <Label htmlFor="establishment_name">Dorm / Establishment Name</Label>
                                        <Input
                                            id="establishment_name"
                                            required
                                            value={data.establishment_name}
                                            onChange={(e) => setData('establishment_name', e.target.value)}
                                        />
                                        <InputError message={errors.establishment_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            required
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Tell students what makes your place great..."
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="establishment_address">Full Address</Label>
                                        <Input
                                            id="establishment_address"
                                            required
                                            value={data.establishment_address}
                                            onChange={(e) => setData('establishment_address', e.target.value)}
                                            placeholder="e.g., #123 Narra St, Brgy. Villamonte, Bacolod City"
                                        />
                                        <InputError message={errors.establishment_address} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="zip_code">Zip Code</Label>
                                            <Input
                                                id="zip_code"
                                                required
                                                value={data.zip_code}
                                                onChange={(e) => setData('zip_code', e.target.value)}
                                                placeholder="6100"
                                            />
                                            <InputError message={errors.zip_code} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact_email">Public Contact Email</Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                required
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                placeholder="inquiries@yourdorm.com"
                                            />
                                            <InputError message={errors.contact_email} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="property_type">Property Type</Label>
                                            <Select
                                                value={data.property_type}
                                                onValueChange={(v: typeof data.property_type) => setData('property_type', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dormitory">Dormitory</SelectItem>
                                                    <SelectItem value="apartment">Apartment</SelectItem>
                                                    <SelectItem value="bedspace">Bedspace</SelectItem>
                                                    <SelectItem value="homestay">Homestay</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.property_type} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="gender_policy">Gender Policy</Label>
                                            <Select
                                                value={data.gender_policy}
                                                onValueChange={(v: typeof data.gender_policy) => setData('gender_policy', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select policy" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="co-ed">Co-Ed</SelectItem>
                                                    <SelectItem value="male_only">Male Only</SelectItem>
                                                    <SelectItem value="female_only">Female Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.gender_policy} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Amenities</Label>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border p-4 sm:grid-cols-3">
                                            {(['wifi', 'ac', 'laundry', 'cctv', 'cooking'] as const).map((amenity) => (
                                                <div key={amenity} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={amenity}
                                                        checked={data.amenities.includes(amenity)}
                                                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                                                    />
                                                    <Label htmlFor={amenity} className="text-sm font-medium capitalize">
                                                        {amenity === 'ac' ? 'Aircon' : amenity}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.amenities} />
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                                disabled={processing}
                                type="submit"
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Completing Registration...' : 'Complete Registration'}
                            </Button>

                            {/* Show submission errors if any */}
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-md border border-red-400 bg-red-100 p-4 dark:border-red-600 dark:bg-red-900">
                                    <h4 className="mb-2 font-semibold text-red-800 dark:text-red-200">Please fix the following errors:</h4>
                                    <ul className="list-inside list-disc space-y-1">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key} className="text-sm text-red-700 dark:text-red-300">
                                                <strong>{key.replace('_', ' ')}:</strong> {message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
