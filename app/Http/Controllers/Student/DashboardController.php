<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Mock data for now - TODO: Replace with real data from database
        $stats = [
            'savedListings' => 12,
            'applications' => 3,
            'viewedListings' => 45,
            'messages' => 8,
        ];

        // Mock recent searches
        $recentSearches = [
            'Near DLSU Manila',
            'Budget friendly dorms',
            'Female only dorms Malate',
            'Studio apartments Manila',
        ];

        // Mock saved listings
        $savedListings = [
            [
                'id' => 1,
                'name' => 'Modern Studio near DLSU',
                'location' => 'Malate, Manila',
                'price' => 15000,
                'rating' => 4.8,
                'image' => '/storage/dorms/modern-studio.jpg',
                'amenities' => ['WiFi', 'AC', 'Laundry', 'Security'],
                'distance' => '0.5 km from DLSU',
                'availability' => 'available',
            ],
            [
                'id' => 2,
                'name' => 'Cozy Dorm Room',
                'location' => 'Ermita, Manila',
                'price' => 8000,
                'rating' => 4.2,
                'image' => '/storage/dorms/cozy-dorm.jpg',
                'amenities' => ['WiFi', 'Laundry'],
                'distance' => '1.2 km from DLSU',
                'availability' => 'limited',
            ],
            [
                'id' => 3,
                'name' => 'Budget Student House',
                'location' => 'Paco, Manila',
                'price' => 6500,
                'rating' => 3.9,
                'image' => '/storage/dorms/budget-house.jpg',
                'amenities' => ['WiFi', 'Cooking Area'],
                'distance' => '2.1 km from DLSU',
                'availability' => 'available',
            ],
        ];

        // Mock applications
        $applications = [
            [
                'id' => 1,
                'dormName' => 'Premium Student Residence',
                'status' => 'pending',
                'appliedDate' => '2024-12-20',
                'responseDate' => null,
            ],
            [
                'id' => 2,
                'dormName' => 'Budget-Friendly Dorm',
                'status' => 'approved',
                'appliedDate' => '2024-12-18',
                'responseDate' => '2024-12-22',
            ],
            [
                'id' => 3,
                'dormName' => 'Luxury Apartments',
                'status' => 'rejected',
                'appliedDate' => '2024-12-15',
                'responseDate' => '2024-12-21',
            ],
        ];

        // Mock recommendations
        $recommendations = [
            [
                'id' => 4,
                'name' => 'Student-Friendly Apartment',
                'location' => 'Taft Avenue, Manila',
                'price' => 12000,
                'rating' => 4.5,
                'image' => '/storage/dorms/student-apartment.jpg',
                'amenities' => ['WiFi', 'AC', 'Kitchen', 'Study Area'],
                'distance' => '0.8 km from DLSU',
                'availability' => 'available',
            ],
            [
                'id' => 5,
                'name' => 'Female Only Dorm',
                'location' => 'Harrison Street, Manila',
                'price' => 9500,
                'rating' => 4.3,
                'image' => '/storage/dorms/female-dorm.jpg',
                'amenities' => ['WiFi', 'Security', 'Laundry'],
                'distance' => '1.5 km from DLSU',
                'availability' => 'limited',
            ],
        ];

        // Mock recent activity
        $recentActivity = [
            [
                'type' => 'view',
                'description' => 'Viewed Modern Studio',
                'timestamp' => '2 hours ago',
                'color' => 'blue',
            ],
            [
                'type' => 'approval',
                'description' => 'Application approved',
                'timestamp' => '1 day ago',
                'color' => 'green',
            ],
            [
                'type' => 'save',
                'description' => 'Saved new listing',
                'timestamp' => '2 days ago',
                'color' => 'red',
            ],
            [
                'type' => 'message',
                'description' => 'New message from landlord',
                'timestamp' => '3 days ago',
                'color' => 'purple',
            ],
        ];

        return Inertia::render('student/dashboard', [
            'stats' => $stats,
            'recentSearches' => $recentSearches,
            'savedListings' => $savedListings,
            'applications' => $applications,
            'recommendations' => $recommendations,
            'recentActivity' => $recentActivity,
        ]);
    }
}
