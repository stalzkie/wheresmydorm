<?php

namespace App\Services\Auth\Contracts;

use App\Models\User;

interface ProfileServiceInterface
{
    /**
     * Create a student profile for the user
     */
    public function createStudentProfile(User $user, array $data): void;

    /**
     * Create a dorm profile for the user
     */
    public function createDormProfile(User $user, array $data): void;

    /**
     * Update an existing student profile
     */
    public function updateStudentProfile(User $user, array $data): void;

    /**
     * Update an existing dorm profile
     */
    public function updateDormProfile(User $user, array $data): void;

    /**
     * Get profile data for a user
     */
    public function getProfileData(User $user): ?array;

    /**
     * Check if user has a complete profile
     */
    public function hasCompleteProfile(User $user): bool;
}
