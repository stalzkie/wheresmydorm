import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: route('admin.dashboard') }]}>
            <Head title="Admin Dashboard" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Welcome, Admin!</h1>
                <p className="mt-2 text-gray-600">Manage the dorm platform from here.</p>
            </div>
        </AppLayout>
    );
}
