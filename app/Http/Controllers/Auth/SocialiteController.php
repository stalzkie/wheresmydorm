<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'No Name',
                'password' => bcrypt(Str::random(16)), // Dummy password
                'email_verified_at' => now(),
                'role' => 'student', // Default role
                'profile_picture' => $socialUser->getAvatar(),
            ]
        );

        Auth::login($user);

        return redirect()->intended(route('dashboard'));
    }
}
