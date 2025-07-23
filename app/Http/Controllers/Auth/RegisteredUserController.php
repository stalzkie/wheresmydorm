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
        $user = Auth::user();

        // Redirect if they already have a complete profile
        if ($user && $this->authService->hasCompleteProfile($user)) {
            return redirect($this->authService->getRedirectUrl($user));
        }

        $validatedData = $request->validated();

        DB::transaction(function () use ($user, $validatedData) {
            $this->authService->completeProfile($user, $validatedData);
        });

        // Get updated user data
        $updatedUser = Auth::user();

        return redirect($this->authService->getRedirectUrl($updatedUser));
    }
}
