import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Bell,
    BookmarkPlus,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    Heart,
    MapPin,
    MessageSquare,
    Search,
    Settings,
    Star,
    TrendingUp,
    XCircle,
} from 'lucide-react';

interface DormListing {
    id: number;
    name: string;
    location: string;
    price: number;
    rating: number;
    image: string;
    amenities: string[];
    distance: string;
    availability: 'available' | 'limited' | 'full';
}

interface Application {
    id: number;
    dormName: string;
    status: 'pending' | 'approved' | 'rejected';
    appliedDate: string;
    responseDate?: string;
}

export default function StudentDashboard() {
    // Mock data for demonstration
    const mockSavedListings: DormListing[] = [
        {
            id: 1,
            name: 'Modern Studio near DLSU',
            location: 'Malate, Manila',
            price: 15000,
            rating: 4.8,
            image: '/api/placeholder/300/200',
            amenities: ['wifi', 'ac', 'laundry', 'security'],
            distance: '0.5 km from DLSU',
            availability: 'available',
        },
        {
            id: 2,
            name: 'Cozy Dorm Room',
            location: 'Ermita, Manila',
            price: 8000,
            rating: 4.2,
            image: '/api/placeholder/300/200',
            amenities: ['wifi', 'laundry'],
            distance: '1.2 km from DLSU',
            availability: 'limited',
        },
    ];

    const mockApplications: Application[] = [
        {
            id: 1,
            dormName: 'Premium Student Residence',
            status: 'pending',
            appliedDate: '2024-12-20',
        },
        {
            id: 2,
            dormName: 'Budget-Friendly Dorm',
            status: 'approved',
            appliedDate: '2024-12-18',
            responseDate: '2024-12-22',
        },
        {
            id: 3,
            dormName: 'Luxury Apartments',
            status: 'rejected',
            appliedDate: '2024-12-15',
            responseDate: '2024-12-21',
        },
    ];

    const mockStats = {
        savedListings: 12,
        applications: 3,
        viewedListings: 45,
        messages: 8,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available':
                return 'bg-green-500';
            case 'limited':
                return 'bg-yellow-500';
            case 'full':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Student Dashboard', href: route('student.dashboard') }]}>
            <Head title="Student Dashboard" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl space-y-8 p-6">
                    {/* Header Section */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back! 👋</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">Find your perfect dorm and manage your applications</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </Button>
                            <Button variant="outline" size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Listings</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.savedListings}</p>
                                    </div>
                                    <Heart className="h-8 w-8 text-red-500" />
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <TrendingUp className="mr-1 h-4 w-4" />
                                    +2 this week
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.applications}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="mr-1 h-4 w-4" />1 pending
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Viewed Listings</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.viewedListings}</p>
                                    </div>
                                    <Search className="h-8 w-8 text-green-500" />
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <TrendingUp className="mr-1 h-4 w-4" />
                                    +12 this week
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.messages}</p>
                                    </div>
                                    <MessageSquare className="h-8 w-8 text-purple-500" />
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="mr-1 h-4 w-4" />3 unread
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Search */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Quick Search
                            </CardTitle>
                            <CardDescription>Find your perfect dorm room near your school</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <Input placeholder="Search by location, school, or dorm name..." className="w-full" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filters
                                    </Button>
                                    <Button>
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Application Status */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Application Status</CardTitle>
                                            <CardDescription>Track your dorm applications</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockApplications.map((application) => (
                                            <div key={application.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(application.status)}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{application.dormName}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(application.status)}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recommended Listings */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Recommended for You</CardTitle>
                                            <CardDescription>Based on your preferences and search history</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            See All
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {mockSavedListings.map((listing) => (
                                            <div key={listing.id} className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
                                                <div className="relative">
                                                    <img src={listing.image} alt={listing.name} className="h-48 w-full object-cover" />
                                                    <div className="absolute top-3 right-3">
                                                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                                                            <Heart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3">
                                                        <div className={`h-3 w-3 rounded-full ${getAvailabilityColor(listing.availability)}`} />
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">{listing.name}</h3>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">{listing.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4" />
                                                        {listing.location}
                                                    </div>
                                                    <div className="mb-3 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4" />
                                                        {listing.distance}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            ₱{listing.price.toLocaleString()}/month
                                                        </div>
                                                        <Button size="sm">View Details</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start" variant="outline">
                                        <Search className="mr-2 h-4 w-4" />
                                        Browse All Listings
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <BookmarkPlus className="mr-2 h-4 w-4" />
                                        My Saved Listings
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Messages
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Profile Settings
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <div className="text-sm">
                                                <p className="text-gray-900 dark:text-white">Viewed Modern Studio</p>
                                                <p className="text-gray-600 dark:text-gray-400">2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <div className="text-sm">
                                                <p className="text-gray-900 dark:text-white">Application approved</p>
                                                <p className="text-gray-600 dark:text-gray-400">1 day ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <div className="text-sm">
                                                <p className="text-gray-900 dark:text-white">Saved new listing</p>
                                                <p className="text-gray-600 dark:text-gray-400">2 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips & Help */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tips for Finding Your Dorm</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            <p className="text-gray-600 dark:text-gray-400">Consider proximity to your school for daily commute</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            <p className="text-gray-600 dark:text-gray-400">Check amenities that matter most to you</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            <p className="text-gray-600 dark:text-gray-400">Read reviews from other students</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
