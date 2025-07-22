'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
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

    const { data, setData, post, processing, errors } = useForm<CompleteProfileForm>({
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
        post(route('auth.store-profile'));
    };

    return (
        <AuthLayout title="Complete Your Profile" description={`Welcome, ${auth.user.name}! Please tell us who you are.`}>
            <Head title="Complete Profile" />
            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label>I am a...</Label>
                    <Select value={data.role} onValueChange={(value: 'student' | 'dorm') => setData('role', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student looking for a place</SelectItem>
                            <SelectItem value="dorm">Dorm Manager / Owner</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact_no">Contact Number</Label>
                    <Input
                        id="contact_no"
                        type="tel"
                        required
                        value={data.contact_no}
                        onChange={(e) => setData('contact_no', e.target.value)}
                        placeholder="e.g. 09123456789"
                    />
                    <InputError message={errors.contact_no} />
                </div>

                <hr />

                {data.role === 'student' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Student Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="school_name">School Name</Label>
                                <Input
                                    id="school_name"
                                    required
                                    value={data.school_name}
                                    onChange={(e) => setData('school_name', e.target.value)}
                                    placeholder="University of Example"
                                />
                                <InputError message={errors.school_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="age">Age (Optional)</Label>
                                <Input id="age" type="number" value={data.age} onChange={(e) => setData('age', e.target.value)} placeholder="18" />
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
                                <Input id="guardian_name" value={data.guardian_name} onChange={(e) => setData('guardian_name', e.target.value)} />
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
                                <Select value={data.property_type} onValueChange={(v: typeof data.property_type) => setData('property_type', v)}>
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
                                <Select value={data.gender_policy} onValueChange={(v: typeof data.gender_policy) => setData('gender_policy', v)}>
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

                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                </Button>
            </form>
        </AuthLayout>
    );
}
