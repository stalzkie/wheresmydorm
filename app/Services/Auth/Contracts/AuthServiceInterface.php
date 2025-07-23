<?php

namespace App\Services\Auth\Contracts;

use App\Models\User;
use Illuminate\Http\RedirectResponse;

interface AuthServiceInterface
{
    /**
     * Create a new user with basic information
     */
    public function createUser(array $userData): User;

    /**
     * Create a profile for the user based on their role
     */
    public function createUserProfile(User $user, array $profileData): void;

    /**
     * Complete a user's profile after initial registration
     */
    public function completeProfile(User $user, array $profileData): void;

    /**
     * Get the appropriate redirect URL after authentication
     */
    public function getRedirectUrl(User $user): string;

    /**
     * Determine if a user has completed their profile
     */
    public function hasCompleteProfile(User $user): bool;

    /**
     * Get the dashboard route for a specific role
     */
    public function getDashboardRoute(string $role): string;
}
