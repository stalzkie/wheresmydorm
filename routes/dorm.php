<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])
    ->prefix('dorm')
    ->name('dorm.')
    ->group(function () {
        // ✅ Only the posts history page
        Route::get('posts', fn () => Inertia::render('dorm/posts/history'))->name('posts.history');
        Route::get('/dorm/posts/create', [PostController::class, 'create'])->name('dorm.posts.create');

    });
