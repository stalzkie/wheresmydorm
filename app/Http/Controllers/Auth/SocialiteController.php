<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirect($provider)
    {
        Log::info("OAuth redirect initiated for provider: {$provider}");
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
    {
        Log::info("OAuth callback received for provider: {$provider}");

        try {
            // Handle the OAuth callback
            $socialUser = Socialite::driver($provider)->user();
            Log::info("OAuth user data received", [
                'email' => $socialUser->getEmail(),
                'name' => $socialUser->getName(),
                'provider' => $provider
            ]);
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error("OAuth InvalidStateException: " . $e->getMessage());
            return redirect()->route('register')->with('error', 'OAuth session expired. Please try signing up again.');
        } catch (\Exception $e) {
            Log::error("OAuth error: " . $e->getMessage());
            return redirect()->route('register')->with('error', 'OAuth authentication failed. Please try again.');
        }

        $user = User::firstOrNew(['email' => $socialUser->getEmail()]);

        if (!$user->exists) {
            Log::info("Creating new user from OAuth", ['email' => $socialUser->getEmail()]);
            $user->name = $socialUser->getName() ?? $socialUser->getNickname() ?? 'User';
            $user->password = Hash::make(Str::random(24));
            $user->email_verified_at = now();
            $user->profile_picture = $socialUser->getAvatar();
            $user->save();

            Auth::login($user);
            Log::info("New OAuth user logged in, redirecting to complete-profile");

            return redirect()->route('auth.complete-profile');
        }

        if (is_null($user->role)) {
            Auth::login($user);
            Log::info("Existing OAuth user without role, redirecting to complete-profile");
            return redirect()->route('auth.complete-profile');
        }

        Auth::login($user);
        Log::info("Existing OAuth user with role: {$user->role}, redirecting to dashboard");

        $url = match ($user->role) {
            'admin'   => 'admin.dashboard',
            'dorm'    => 'dorm.dashboard',
            default   => 'student.dashboard',
        };

        return redirect()->intended(route($url));
    }
}
