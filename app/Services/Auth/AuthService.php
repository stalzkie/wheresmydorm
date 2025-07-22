<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\DormProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class AuthService
{
    /**
     * Create a new user with their profile
     */
    public function createUser(array $data, ?UploadedFile $profilePicture = null, ?UploadedFile $coverPhoto = null): User
    {
        // Handle profile picture upload
        $profilePicturePath = null;
        if ($profilePicture) {
            $profilePicturePath = $profilePicture->store('profile-pictures', 'public');
        }

        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'contact_no' => $data['contact_no'],
            'profile_picture' => $profilePicturePath,
        ]);

        // Create role-specific profile
        $this->createUserProfile($user, $data, $coverPhoto);

        return $user;
    }

    /**
     * Complete user profile for social auth users
     */
    public function completeUserProfile(User $user, array $data): void
    {
        $user->update(['role' => $data['role']]);
        $this->createUserProfile($user, $data);
    }

    /**
     * Create role-specific profile
     */
    private function createUserProfile(User $user, array $data, ?UploadedFile $coverPhoto = null): void
    {
        if ($data['role'] === 'student') {
            $this->createStudentProfile($user, $data);
        } elseif ($data['role'] === 'dorm') {
            $this->createDormProfile($user, $data, $coverPhoto);
        }
    }

    /**
     * Create student profile
     */
    private function createStudentProfile(User $user, array $data): void
    {
        StudentProfile::create([
            'user_id' => $user->getKey(),
            'school_name' => $data['school_name'],
            'age' => $data['age'] ?? null,
            'address' => $data['address'] ?? null,
            'guardian_name' => $data['guardian_name'] ?? null,
            'guardian_contact_no' => $data['guardian_contact_no'] ?? null,
        ]);
    }

    /**
     * Create dorm profile
     */
    private function createDormProfile(User $user, array $data, ?UploadedFile $coverPhoto = null): void
    {
        // Handle cover photo upload if provided via the main data array or separate parameter
        $coverPhotoPath = null;
        if ($coverPhoto) {
            $coverPhotoPath = $coverPhoto->store('cover-photos', 'public');
        }

        $amenities = $data['amenities'] ?? [];

        DormProfile::create([
            'user_id' => $user->getKey(),
            'establishment_name' => $data['establishment_name'] ?? 'My Dorm',
            'description' => $data['description'] ?? '',
            'establishment_address' => $data['establishment_address'] ?? 'TBD',
            'zip_code' => $data['zip_code'] ?? 'TBD',
            'contact_email' => $data['contact_email'] ?? $user->email,
            'cover_photo_path' => $coverPhotoPath,
            'property_type' => $data['property_type'] ?? 'dormitory',
            'gender_policy' => $data['gender_policy'] ?? 'co-ed',
            'has_wifi' => in_array('wifi', $amenities),
            'has_ac' => in_array('ac', $amenities),
            'has_laundry' => in_array('laundry', $amenities),
            'has_cctv' => in_array('cctv', $amenities),
            'allows_cooking' => in_array('cooking', $amenities),
        ]);
    }

    /**
     * Get redirect route based on user role
     */
    public function getRedirectRoute(User $user): string
    {
        return match ($user->role) {
            'admin' => 'admin.dashboard',
            'dorm' => 'dorm.dashboard',
            default => 'student.dashboard',
        };
    }
}
