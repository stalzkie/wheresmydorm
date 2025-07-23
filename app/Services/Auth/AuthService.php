<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Services\Auth\Contracts\AuthServiceInterface;
use App\Services\Auth\Contracts\ProfileServiceInterface;
use Illuminate\Support\Facades\Hash;

class AuthService implements AuthServiceInterface
{
    public function __construct(
        private ProfileServiceInterface $profileService
    ) {}

    /**
     * Create a new user with basic information
     */
    public function createUser(array $userData): User
    {
        return User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
            'role' => $userData['role'] ?? null,
            'contact_no' => $userData['contact_no'] ?? null,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create a profile for the user based on their role
     */
    public function createUserProfile(User $user, array $profileData): void
    {
        match ($user->role) {
            'student' => $this->profileService->createStudentProfile($user, $profileData),
            'dorm' => $this->profileService->createDormProfile($user, $profileData),
            default => null, // Admin or no role doesn't need a profile
        };
    }

    /**
     * Complete a user's profile after initial registration
     */
    public function completeProfile(User $user, array $profileData): void
    {
        // Update user role if provided
        if (isset($profileData['role'])) {
            $user->update(['role' => $profileData['role']]);
            $user->refresh();
        }

        // Create or update profile based on role
        if ($user->role) {
            $this->createUserProfile($user, $profileData);
        }
    }

    /**
     * Get the appropriate redirect URL after authentication
     */
    public function getRedirectUrl(User $user): string
    {
        // If user doesn't have a role or complete profile, redirect to complete profile
        if (!$user->role || !$this->hasCompleteProfile($user)) {
            return route('auth.complete-profile');
        }

        // Redirect to appropriate dashboard based on role
        return $this->getDashboardRoute($user->role);
    }

    /**
     * Determine if a user has completed their profile
     */
    public function hasCompleteProfile(User $user): bool
    {
        return $this->profileService->hasCompleteProfile($user);
    }

    /**
     * Get the dashboard route for a specific role
     */
    public function getDashboardRoute(string $role): string
    {
        return match ($role) {
            'student' => route('student.dashboard'),
            'dorm' => route('dorm.dashboard'),
            'admin' => route('admin.dashboard'),
            default => route('dashboard'),
        };
    }
}
