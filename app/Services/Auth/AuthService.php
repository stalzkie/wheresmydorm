<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Services\Auth\Contracts\AuthServiceInterface;
use App\Services\Auth\Contracts\ProfileServiceInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
        Log::info('Creating profile for user role: ' . $user->role);

        match ($user->role) {
            'student' => $this->profileService->createStudentProfile($user, $profileData),
            'dorm' => $this->profileService->createDormProfile($user, $profileData),
            default => Log::info('No profile creation needed for role: ' . $user->role),
        };

        Log::info('Profile creation completed for user: ' . $user->email);
    }

    /**
     * Complete a user's profile after initial registration
     */
    public function completeProfile(User $user, array $profileData): void
    {
        Log::info('Starting completeProfile', [
            'user_id' => $user->id,
            'current_role' => $user->role,
            'profile_data_role' => $profileData['role'] ?? 'not set'
        ]);

        // Update user role if provided
        if (isset($profileData['role'])) {
            Log::info('Updating user role', ['from' => $user->role, 'to' => $profileData['role']]);
            $user->update(['role' => $profileData['role']]);
            Log::info('Role updated in database');
        }

        // Update contact number if provided
        if (isset($profileData['contact_no'])) {
            Log::info('Updating contact number');
            $user->update(['contact_no' => $profileData['contact_no']]);
        }

        // Reload the user to get the updated role
        Log::info('Refreshing user model');
        $user->refresh();
        Log::info('User refreshed', ['new_role' => $user->role]);

        // Create or update profile based on role
        if ($user->role) {
            Log::info('Creating user profile for role: ' . $user->role);
            $this->createUserProfile($user, $profileData);
        } else {
            Log::warning('User role is still null after update');
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
