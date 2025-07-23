<?php

namespace App\Http\Controllers\Dorm;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Mock data for now since we're focusing on the design
        $stats = [
            'totalPosts' => 3,
            'totalViews' => 1250,
            'totalBookings' => 8,
            'totalRevenue' => 45000,
            'averageRating' => 4.8,
            'recentBookings' => 2,
        ];

        // Mock recent posts
        $recentPosts = [
            [
                'id' => 1,
                'title' => 'Modern Studio Apartment near DLSU',
                'price' => 15000,
                'views' => 245,
                'status' => 'active',
                'created_at' => 'Dec 15, 2024',
                'images' => ['dorm1.jpg'],
            ],
            [
                'id' => 2,
                'title' => 'Cozy Dorm Room with WiFi',
                'price' => 8000,
                'views' => 189,
                'status' => 'active',
                'created_at' => 'Dec 10, 2024',
                'images' => ['dorm2.jpg'],
            ],
            [
                'id' => 3,
                'title' => 'Shared Apartment for Students',
                'price' => 12000,
                'views' => 156,
                'status' => 'draft',
                'created_at' => 'Dec 8, 2024',
                'images' => ['dorm3.jpg'],
            ],
        ];

        // Mock data for activity
        $recentMessages = 5;
        $upcomingCheckIns = 3;

        return Inertia::render('dorm/dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentMessages' => $recentMessages,
            'upcomingCheckIns' => $upcomingCheckIns,
        ]);
    }
}
