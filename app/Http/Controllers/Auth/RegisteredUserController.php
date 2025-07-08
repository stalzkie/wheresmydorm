<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\DormProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $baseRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'contact_no' => 'required|string|max:20',
            'role' => ['required', Rule::in(['student', 'dorm'])],
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        $studentRules = [
            'school_name' => 'required_if:role,student|string|max:255',
        ];

        $dormRules = [
            'establishment_name' => 'required_if:role,dorm|string|max:255',
            'description' => 'required_if:role,dorm|string|max:1000',
            'establishment_address' => 'required_if:role,dorm|string|max:255',
            'zip_code' => 'required_if:role,dorm|string|max:10',
            'contact_email' => 'required_if:role,dorm|email|max:255',
            'cover_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'property_type' => ['required_if:role,dorm', Rule::in(['dormitory', 'apartment', 'bedspace', 'homestay'])],
            'gender_policy' => ['required_if:role,dorm', Rule::in(['co-ed', 'male_only', 'female_only'])],
            'amenities' => 'required_if:role,dorm|array',
        ];

        $request->validate(array_merge($baseRules, $studentRules, $dormRules));

        $user = DB::transaction(function () use ($request) {
            $profilePicturePath = null;
            if ($request->hasFile('profile_picture')) {
                $profilePicturePath = $request->file('profile_picture')->store('profile-pictures', 'public');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'contact_no' => $request->contact_no,
                'profile_picture' => $profilePicturePath,
            ]);

            if ($request->role === 'student') {
                StudentProfile::create([
                    'user_id' => $user->id,
                    'school_name' => $request->school_name,
                ]);
            } elseif ($request->role === 'dorm') {
                $coverPhotoPath = null;
                if ($request->hasFile('cover_photo')) {
                    $coverPhotoPath = $request->file('cover_photo')->store('cover-photos', 'public');
                }

                $amenities = $request->input('amenities', []);

                DormProfile::create([
                    'user_id' => $user->id,
                    'establishment_name' => $request->establishment_name,
                    'description' => $request->description,
                    'establishment_address' => $request->establishment_address,
                    'zip_code' => $request->zip_code,
                    'contact_email' => $request->contact_email,
                    'cover_photo_path' => $coverPhotoPath,
                    'property_type' => $request->property_type,
                    'gender_policy' => $request->gender_policy,
                    'has_wifi' => in_array('wifi', $amenities),
                    'has_ac' => in_array('ac', $amenities),
                    'has_laundry' => in_array('laundry', $amenities),
                    'has_cctv' => in_array('cctv', $amenities),
                    'allows_cooking' => in_array('cooking', $amenities),
                ]);
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    public function completeProfile(): Response
    {
        if (auth()->user()->role) {
            return redirect(route('dashboard'));
        }
        return Inertia::render('auth/complete-profile');
    }

    public function storeCompletedProfile(Request $request): RedirectResponse
    {
        $user = auth()->user();

        // Redirect if they somehow already have a role.
        if ($user->role) {
            return redirect(route('dashboard'));
        }

        // Base validation for role
        $baseRules = [
            'role' => ['required', Rule::in(['student', 'dorm'])],
        ];

        // Role-specific validation
        $studentRules = [
            'school_name' => 'required_if:role,student|string|max:255',
        ];
        $dormRules = [
            'establishment_name' => 'required_if:role,dorm|string|max:255',
            // Add any other *required* fields for dorms here
        ];

        $request->validate(array_merge($baseRules, $studentRules, $dormRules));

        DB::transaction(function () use ($request, $user) {
            $user->role = $request->role;
            $user->save();

            if ($request->role === 'student') {
                StudentProfile::create([
                    'user_id' => $user->id,
                    'school_name' => $request->school_name,
                ]);
            } elseif ($request->role === 'dorm') {
                DormProfile::create([
                    'user_id' => $user->id,
                    'establishment_name' => $request->establishment_name,
                    'establishment_address' => 'TBD', 
                    'zip_code' => 'TBD',
                    'contact_email' => 'tbd@example.com', 
                    'property_type' => 'dormitory', 
                    'gender_policy' => 'co-ed', 
                ]);
            }
        });

        // Redirect to the correct dashboard
        $redirectRoute = match ($user->role) {
            'dorm' => 'dorm.dashboard',
            default => 'student.dashboard',
        };

        return redirect()->route($redirectRoute);
    }
}
