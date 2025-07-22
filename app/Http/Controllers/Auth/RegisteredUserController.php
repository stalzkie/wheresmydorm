<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\CompleteProfileRequest;
use App\Models\User;
use App\Services\Auth\AuthService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private AuthService $authService
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

        $user = DB::transaction(function () use ($request, $validatedData) {
            return $this->authService->createUser(
                $validatedData,
                $request->file('profile_picture'),
                $request->file('cover_photo')
            );
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route($this->authService->getRedirectRoute($user));
    }

    /**
     * Show the complete profile page for social auth users.
     */
    public function completeProfile(): Response|RedirectResponse
    {
        $user = Auth::user();
        if ($user && $user->role) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('auth/complete-profile');
    }

    /**
     * Handle the complete profile form submission.
     */
    public function storeCompletedProfile(CompleteProfileRequest $request): RedirectResponse
    {
        $user = Auth::user();

        // Redirect if they somehow already have a role
        if ($user && $user->role) {
            return redirect()->route('dashboard');
        }

        $validatedData = $request->validated();

        DB::transaction(function () use ($user, $validatedData) {
            $this->authService->completeUserProfile($user, $validatedData);
        });

        // Force re-authentication to get updated user data
        Auth::login($user, true);
        $updatedUser = Auth::user();

        return redirect()->route($this->authService->getRedirectRoute($updatedUser));
    }
}
