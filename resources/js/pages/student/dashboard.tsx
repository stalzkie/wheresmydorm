import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function StudentDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Student Dashboard', href: route('student.dashboard') }]}>
            <Head title="Student Dashboard" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Welcome, Student!</h1>
            </div>
        </AppLayout>
    );
}
