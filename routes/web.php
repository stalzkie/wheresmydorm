<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = auth()->user();
    $redirectRoute = match ($user->role) {
        'admin' => 'admin.dashboard',
        'dorm' => 'dorm.dashboard',
        default => 'student.dashboard',
    };
    return redirect()->route($redirectRoute);
})->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('student/dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('dorm')->name('dorm.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dorm/dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
