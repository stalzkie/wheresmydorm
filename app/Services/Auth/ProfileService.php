<?php

namespace App\Services\Auth;

use App\Models\DormProfile;
use App\Models\StudentProfile;
use App\Models\User;
use App\Services\Auth\Contracts\ProfileServiceInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileService implements ProfileServiceInterface
{
    /**
     * Create a student profile for the user
     */
    public function createStudentProfile(User $user, array $data): void
    {
        Log::info('Creating student profile for user: ' . $user->email, $data);

        $profile = StudentProfile::create([
            'user_id' => $user->getKey(),
            'school_name' => $data['school_name'],
            'age' => $data['age'] ?? null,
            'address' => $data['address'] ?? null,
            'guardian_name' => $data['guardian_name'] ?? null,
            'guardian_contact_no' => $data['guardian_contact_no'] ?? null,
        ]);

        Log::info('Student profile created with ID: ' . $profile->getKey());
    }

    /**
     * Create a dorm profile for the user
     */
    public function createDormProfile(User $user, array $data): void
    {
        Log::info('Creating dorm profile for user: ' . $user->email, $data);

        // Process amenities array into individual boolean fields
        $amenities = $data['amenities'] ?? [];

        $profile = DormProfile::create([
            'user_id' => $user->getKey(),
            'establishment_name' => $data['establishment_name'],
            'description' => $data['description'] ?? null,
            'establishment_address' => $data['establishment_address'],
            'zip_code' => $data['zip_code'],
            'contact_email' => $data['contact_email'] ?? $user->email,
            'cover_photo_path' => $data['cover_photo_path'] ?? null,
            'property_type' => $data['property_type'] ?? 'dormitory',
            'gender_policy' => $data['gender_policy'] ?? 'co-ed',
            'has_wifi' => in_array('wifi', $amenities),
            'has_ac' => in_array('ac', $amenities),
            'has_laundry' => in_array('laundry', $amenities),
            'has_cctv' => in_array('cctv', $amenities),
            'allows_cooking' => in_array('cooking', $amenities),
        ]);

        Log::info('Dorm profile created with ID: ' . $profile->getKey());
    }

    /**
     * Update an existing student profile
     */
    public function updateStudentProfile(User $user, array $data): void
    {
        $profile = $user->studentProfile;

        if (!$profile) {
            $this->createStudentProfile($user, $data);
            return;
        }

        $profile->update([
            'school_name' => $data['school_name'] ?? $profile->school_name,
            'age' => $data['age'] ?? $profile->age,
            'address' => $data['address'] ?? $profile->address,
            'guardian_name' => $data['guardian_name'] ?? $profile->guardian_name,
            'guardian_contact_no' => $data['guardian_contact_no'] ?? $profile->guardian_contact_no,
        ]);
    }

    /**
     * Update an existing dorm profile
     */
    public function updateDormProfile(User $user, array $data): void
    {
        $profile = $user->dormProfile;

        if (!$profile) {
            $this->createDormProfile($user, $data);
            return;
        }

        // Process amenities array into individual boolean fields
        $amenities = $data['amenities'] ?? [];

        $profile->update([
            'establishment_name' => $data['establishment_name'] ?? $profile->establishment_name,
            'description' => $data['description'] ?? $profile->description,
            'establishment_address' => $data['establishment_address'] ?? $profile->establishment_address,
            'zip_code' => $data['zip_code'] ?? $profile->zip_code,
            'contact_email' => $data['contact_email'] ?? $profile->contact_email,
            'cover_photo_path' => $data['cover_photo_path'] ?? $profile->cover_photo_path,
            'property_type' => $data['property_type'] ?? $profile->property_type,
            'gender_policy' => $data['gender_policy'] ?? $profile->gender_policy,
            'has_wifi' => isset($data['amenities']) ? in_array('wifi', $amenities) : $profile->has_wifi,
            'has_ac' => isset($data['amenities']) ? in_array('ac', $amenities) : $profile->has_ac,
            'has_laundry' => isset($data['amenities']) ? in_array('laundry', $amenities) : $profile->has_laundry,
            'has_cctv' => isset($data['amenities']) ? in_array('cctv', $amenities) : $profile->has_cctv,
            'allows_cooking' => isset($data['amenities']) ? in_array('cooking', $amenities) : $profile->allows_cooking,
        ]);
    }

    /**
     * Get profile data for a user
     */
    public function getProfileData(User $user): ?array
    {
        switch ($user->role) {
            case 'student':
                $profile = $user->studentProfile;
                return $profile ? [
                    'school_name' => $profile->school_name,
                    'age' => $profile->age,
                    'address' => $profile->address,
                    'guardian_name' => $profile->guardian_name,
                    'guardian_contact_no' => $profile->guardian_contact_no,
                ] : null;

            case 'dorm':
                $profile = $user->dormProfile;
                return $profile ? [
                    'establishment_name' => $profile->establishment_name,
                    'description' => $profile->description,
                    'establishment_address' => $profile->establishment_address,
                    'zip_code' => $profile->zip_code,
                    'contact_email' => $profile->contact_email,
                    'cover_photo_path' => $profile->cover_photo_path,
                    'property_type' => $profile->property_type,
                    'gender_policy' => $profile->gender_policy,
                    'has_wifi' => $profile->has_wifi,
                    'has_ac' => $profile->has_ac,
                    'has_laundry' => $profile->has_laundry,
                    'has_cctv' => $profile->has_cctv,
                    'allows_cooking' => $profile->allows_cooking,
                ] : null;

            default:
                return null;
        }
    }

    /**
     * Check if user has a complete profile
     */
    public function hasCompleteProfile(User $user): bool
    {
        Log::info('Checking if user has complete profile', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role
        ]);

        if (!$user->role) {
            Log::info('User has no role, profile incomplete');
            return false;
        }

        switch ($user->role) {
            case 'student':
                $profile = $user->studentProfile;
                $isComplete = $profile && $profile->school_name;
                Log::info('Student profile check', [
                    'has_profile' => !!$profile,
                    'has_school_name' => $profile ? !!$profile->school_name : false,
                    'is_complete' => $isComplete
                ]);
                return $isComplete;

            case 'dorm':
                $profile = $user->dormProfile;
                $isComplete = $profile && $profile->establishment_name;
                Log::info('Dorm profile check', [
                    'has_profile' => !!$profile,
                    'has_establishment_name' => $profile ? !!$profile->establishment_name : false,
                    'is_complete' => $isComplete
                ]);
                return $isComplete;

            case 'admin':
                Log::info('Admin user, profile considered complete');
                return true; // Admins don't need additional profile

            default:
                Log::info('Unknown role, profile incomplete');
                return false;
        }
    }
}
