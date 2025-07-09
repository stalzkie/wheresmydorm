<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Dorm Owner',
            'email' => 'dorm@example.com',
            'password' => bcrypt('password'),
            'role' => 'dorm', // Make sure your users table has a 'role' column
        ]);

        Post::create([
            'user_id' => $user->id,
            'title' => 'Dorm Near UST',
            'description' => 'Affordable dorm near Espana Blvd.',
            'price' => 5500,
            'amenities' => ['Wi-Fi', 'Aircon', 'Laundry'],
            'images' => ['/images/dorm1.jpg'],
        ]);
    }
}
