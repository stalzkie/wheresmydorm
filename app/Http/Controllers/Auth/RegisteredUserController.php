<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\CompleteProfileRequest;
use App\Models\User;
use App\Services\Auth\Contracts\AuthServiceInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private AuthServiceInterface $authService
    ) {}

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        $user = DB::transaction(function () use ($validatedData) {
            $user = $this->authService->createUser($validatedData);

            // Create profile if role is provided
            if (isset($validatedData['role'])) {
                $this->authService->createUserProfile($user, $validatedData);
            }

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect($this->authService->getRedirectUrl($user));
    }

    /**
     * Show the complete profile page for social auth users.
     */
    public function completeProfile(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user && $this->authService->hasCompleteProfile($user)) {
            return redirect($this->authService->getRedirectUrl($user));
        }

        return Inertia::render('auth/complete-profile');
    }

    /**
     * Handle the complete profile form submission.
     */
    public function storeCompletedProfile(CompleteProfileRequest $request): RedirectResponse
    {
        // Log that we received the request
        Log::info('=== COMPLETE PROFILE REQUEST RECEIVED ===');
        Log::info('Request method: ' . $request->method());
        Log::info('Request URL: ' . $request->url());

        $user = Auth::user();
        Log::info('Current user: ' . ($user ? $user->email : 'not authenticated'));

        // Redirect if they already have a complete profile
        if ($user && $this->authService->hasCompleteProfile($user)) {
            Log::info('User already has complete profile, redirecting');
            return redirect($this->authService->getRedirectUrl($user));
        }

        $validatedData = $request->validated();

        // Debug logging
        Log::info('Completing profile for user: ' . $user->email);
        Log::info('Raw request data:', $request->all());
        Log::info('Validated profile data:', $validatedData);

        DB::transaction(function () use ($user, $validatedData) {
            $this->authService->completeProfile($user, $validatedData);
        });

        // Get the user fresh from database with updated relationships
        $updatedUser = User::with(['studentProfile', 'dormProfile'])->find($user->getAuthIdentifier());

        // Debug logging
        Log::info('User role after profile completion: ' . $updatedUser->role);
        Log::info('Has complete profile: ' . ($this->authService->hasCompleteProfile($updatedUser) ? 'yes' : 'no'));

        $redirectUrl = $this->authService->getRedirectUrl($updatedUser);
        Log::info('Redirecting to: ' . $redirectUrl);

        return redirect($redirectUrl);
    }
}
