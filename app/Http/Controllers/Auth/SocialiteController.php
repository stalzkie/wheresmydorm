<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
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

        $user = User::firstOrNew(['email' => $socialUser->getEmail()]);

        if (!$user->exists) {
            $user->name = $socialUser->getName() ?? $socialUser->getNickname() ?? 'User';
            $user->password = Hash::make(Str::random(24));
            $user->email_verified_at = now();
            $user->profile_picture = $socialUser->getAvatar();
            $user->save();

            Auth::login($user);

            return redirect()->route('auth.complete-profile');
        }

        if (is_null($user->role)) {
            Auth::login($user);
            return redirect()->route('auth.complete-profile');
        }

        Auth::login($user);

        $url = match ($user->role) {
            'admin'   => 'admin.dashboard',
            'dorm'    => 'dorm.dashboard',
            default   => 'student.dashboard',
        };

        return redirect()->intended(route($url));
    }
}
