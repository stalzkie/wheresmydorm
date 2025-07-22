<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'student']);

    $this->actingAs($user);

    $this->get('/dashboard')->assertRedirect(route('student.dashboard'));
});

test('users without role are redirected to complete profile', function () {
    $user = User::factory()->create(['role' => null]);

    $this->actingAs($user);

    $this->get('/dashboard')->assertRedirect(route('auth.complete-profile'));
});
