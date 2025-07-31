<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        Log::info('EnsureProfileComplete middleware check', [
            'user_id' => $user ? $user->id : 'no user',
            'user_role' => $user ? $user->role : 'no role',
            'request_path' => $request->path()
        ]);

        if ($user && (is_null($user->role) || !$this->hasCompleteProfile($user))) {
            Log::info('Redirecting to complete-profile from middleware');
            return redirect()->route('auth.complete-profile');
        }

        return $next($request);
    }

    /**
     * Check if user has a complete profile
     */
    private function hasCompleteProfile($user): bool
    {
        if (!$user->role) {
            return false;
        }

        switch ($user->role) {
            case 'student':
                return $user->studentProfile && $user->studentProfile->school_name;
            case 'dorm':
                return $user->dormProfile && $user->dormProfile->establishment_name;
            case 'admin':
                return true;
            default:
                return false;
        }
    }
}
