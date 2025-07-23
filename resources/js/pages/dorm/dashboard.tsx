import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Calendar, DollarSign, Eye, Heart, MessageSquare, Plus, Star, Users } from 'lucide-react';

interface DashboardStats {
    totalPosts: number;
    totalViews: number;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    recentBookings: number;
}

interface RecentPost {
    id: number;
    title: string;
    price: number;
    views: number;
    status: 'active' | 'inactive' | 'draft';
    created_at: string;
    images: string[];
}

interface PageProps extends SharedData {
    stats: DashboardStats;
    recentPosts: RecentPost[];
    recentMessages: number;
    upcomingCheckIns: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dorm/dashboard',
    },
];

export default function DormDashboard() {
    const { auth, stats, recentPosts, recentMessages, upcomingCheckIns } = usePage<PageProps>().props;
    const user = auth.user;

    const quickActions = [
        {
            title: 'Add New Listing',
            description: 'Create a new dorm listing',
            href: route('dorm.posts.create'),
            icon: Plus,
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            title: 'View Messages',
            description: `${recentMessages} unread messages`,
            href: route('dorm.messages.index'),
            icon: MessageSquare,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            title: 'Manage Posts',
            description: 'Edit your listings',
            href: route('dorm.posts.history'),
            icon: Building2,
            color: 'bg-purple-500 hover:bg-purple-600',
        },
        {
            title: 'Analytics',
            description: 'View detailed insights',
            href: route('dorm.analytics.revenue'),
            icon: Eye,
            color: 'bg-orange-500 hover:bg-orange-600',
        },
    ];

    const statCards = [
        {
            title: 'Total Listings',
            value: stats.totalPosts,
            icon: Building2,
            description: 'Active property listings',
            trend: '+2 this month',
            color: 'text-blue-600',
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
            description: 'Profile and listing views',
            trend: '+12% from last month',
            color: 'text-green-600',
        },
        {
            title: 'Bookings',
            value: stats.totalBookings,
            icon: Calendar,
            description: 'Total bookings received',
            trend: `${stats.recentBookings} pending`,
            color: 'text-purple-600',
        },
        {
            title: 'Revenue',
            value: `₱${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: 'Total earnings',
            trend: 'Last 30 days',
            color: 'text-emerald-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dorm Dashboard" />

            <div className="space-y-6 p-6">
                {/* Welcome Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user.name}!</h1>
                        <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your dorm business today.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {stats.averageRating > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Star className="h-4 w-4 fill-current" />
                                {stats.averageRating.toFixed(1)} Rating
                            </div>
                        )}
                        <Badge variant="secondary" className="text-sm">
                            {user.role === 'dorm' ? 'Dorm Owner' : 'Property Manager'}
                        </Badge>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={index} href={action.href}>
                                <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`rounded-lg p-3 text-white ${action.color}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{action.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</p>
                                    <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">{stat.trend}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Posts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Recent Listings
                            </CardTitle>
                            <CardDescription>Your most recent property listings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentPosts.length > 0 ? (
                                recentPosts.slice(0, 3).map((post) => (
                                    <div key={post.id} className="flex items-center gap-4 rounded-lg border p-3">
                                        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800">
                                            {post.images?.[0] && (
                                                <img
                                                    src={`/storage/${post.images[0]}`}
                                                    alt={post.title}
                                                    className="h-full w-full rounded-lg object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-gray-900 dark:text-gray-100">{post.title}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span>₱{post.price.toLocaleString()}</span>
                                                <span>•</span>
                                                <span>{post.views} views</span>
                                            </div>
                                        </div>
                                        <Badge variant={post.status === 'active' ? 'default' : post.status === 'inactive' ? 'secondary' : 'outline'}>
                                            {post.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600 dark:text-gray-400">No listings yet</p>
                                    <Link href={route('dorm.posts.create')}>
                                        <Button className="mt-2" size="sm">
                                            Create Your First Listing
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {recentPosts.length > 3 && (
                                <Link href={route('dorm.posts.history')}>
                                    <Button variant="outline" className="w-full">
                                        View All Listings
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activity Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Activity Overview
                            </CardTitle>
                            <CardDescription>Recent activity and notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">New Messages</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">You have {recentMessages} unread messages</p>
                                    </div>
                                </div>
                                <Link href={route('dorm.messages.index')}>
                                    <Button size="sm" variant="outline">
                                        View
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">Upcoming Check-ins</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{upcomingCheckIns} students checking in this week</p>
                                    </div>
                                </div>
                                <Link href={route('dorm.transactions.history')}>
                                    <Button size="sm" variant="outline">
                                        View
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                                        <Heart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">Reviews</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} average rating` : 'No reviews yet'}
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" disabled>
                                    View
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
