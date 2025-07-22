<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Dorm\PostController;
use App\Models\Post;

/*
|--------------------------------------------------------------------------
| Web Routes (Inertia Only)
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified', 'profile.complete'])->get('/dashboard', function () {
    $user = auth()->user();
    $redirectRoute = match ($user->role) {
        'admin' => 'admin.dashboard',
        'dorm' => 'dorm.dashboard',
        default => 'student.dashboard',
    };
    return redirect()->route($redirectRoute);
})->name('dashboard');

// ==============================
// ✅ ADMIN DASHBOARD
// ==============================
Route::middleware(['auth', 'verified', 'profile.complete'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('admin/dashboard'))->name('dashboard');
});

// ==============================
// ✅ STUDENT DASHBOARD
// ==============================
Route::middleware(['auth', 'verified', 'profile.complete'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('student/dashboard'))->name('dashboard');
});

// ==============================
// ✅ DORM INERTIA PAGES
// ==============================
Route::middleware(['auth', 'verified', 'profile.complete'])->prefix('dorm')->name('dorm.')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('dorm/dashboard'))->name('dashboard');

    // ✅ Dorm Post Routes (uses PostController)
    Route::get('posts', [PostController::class, 'index'])->name('posts.history');
    Route::get('posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('posts/{id}', [PostController::class, 'show'])->name('posts.show');
    Route::get('posts/{id}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::put('posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // ✅ Other dorm modules
    Route::get('transactions', fn() => Inertia::render('dorm/transactions/history'))->name('transactions.history');
    Route::get('messages', fn() => Inertia::render('dorm/messaging/index'))->name('messages.index');
    Route::get('analytics/revenue', fn() => Inertia::render('dorm/analytics/revenue'))->name('analytics.revenue');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/student.php';
// require __DIR__ . '/admin.php';
