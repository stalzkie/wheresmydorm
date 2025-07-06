'use client';

// C:\xampp\htdocs\dormy-webapp\resources\js\pages\auth\complete-profile.tsx

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function CompleteProfile() {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    const { data, setData, post, processing, errors } = useForm({
        role: 'student',
        school_name: '',
        establishment_name: '',
    });

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

                {data.role === 'student' && (
                    <div className="grid gap-2">
                        <Label htmlFor="school_name">School Name</Label>
                        <Input id="school_name" value={data.school_name} onChange={(e) => setData('school_name', e.target.value)} required />
                        <InputError message={errors.school_name} />
                    </div>
                )}

                {data.role === 'dorm' && (
                    <div className="grid gap-2">
                        <Label htmlFor="establishment_name">Dorm / Establishment Name</Label>
                        <Input
                            id="establishment_name"
                            value={data.establishment_name}
                            onChange={(e) => setData('establishment_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.establishment_name} />
                    </div>
                )}
                {/* Add more fields here as needed */}

                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                </Button>
            </form>
        </AuthLayout>
    );
}
