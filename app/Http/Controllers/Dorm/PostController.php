<?php

namespace App\Http\Controllers\Dorm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Post;
use Carbon\Carbon;

class PostController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $posts = Post::where('user_id', $user->id)->latest()->get();

        return Inertia::render('dorm/posts/history', [
            'auth' => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
            'posts' => $posts->map(fn ($post) => [
                'id'          => $post->id,
                'title'       => $post->title,
                'description' => $post->description,
                'price'       => $post->price,
                'amenities'   => is_array($post->amenities) ? $post->amenities : json_decode($post->amenities ?? '[]', true),
                'images'      => is_array($post->images) ? $post->images : json_decode($post->images ?? '[]', true),
                'createdAt'   => $post->created_at->toDateTimeString(),
            ])
        ]);
    }

    public function create()
    {
        return Inertia::render('dorm/posts/add');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'amenities'   => 'nullable|array',
            'images'      => 'nullable|array|max:10',
            'images.*'    => 'file|image|max:10240',
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('uploads', 'public');
            }
        }

        Post::create([
            'user_id'     => Auth::id(),
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? '',
            'price'       => $validated['price'],
            'amenities'   => $validated['amenities'] ?? [],
            'images'      => $images,
        ]);

        return redirect()
            ->route('dorm.posts.history')
            ->with('success', 'Post created successfully.');
    }

    public function show($id)
    {
        $user = Auth::user();

        $post = Post::with(['user', 'reviews.user'])
                    ->where('id', $id)
                    ->where('user_id', $user->id)
                    ->firstOrFail();

        $reviews = $post->reviews->map(fn ($review) => [
            'id'          => $review->id,
            'user'        => ['name' => $review->user->name ?? 'Anonymous'],
            'rating'      => $review->rating,
            'description' => $review->description,
            'date'        => Carbon::parse($review->created_at)->toFormattedDateString(),
        ]);

        return Inertia::render('dorm/posts/view', [
            'auth' => ['user' => $user],
            'post' => [
                'id'            => $post->id,
                'title'         => $post->title,
                'description'   => $post->description,
                'price'         => $post->price,
                'images'        => is_array($post->images) ? $post->images : json_decode($post->images ?? '[]', true),
                'amenities'     => is_array($post->amenities) ? $post->amenities : json_decode($post->amenities ?? '[]', true),
                'createdAt'     => $post->created_at->toDateTimeString(),
                'establishment' => $post->establishment_name ?? 'Unknown',
                'host'          => $post->user->name,
                'impressions'   => $post->impressions ?? 0,
                'engagements'   => $post->engagements ?? 0,
                'averageRating' => round($post->reviews->avg('rating'), 1),
                'reviewCount'   => $post->reviews->count(),
                'location'      => [
                    'lat' => $post->latitude ?? 14.5995,
                    'lng' => $post->longitude ?? 120.9842,
                ],
                'reviews'       => $reviews
            ]
        ]);
    }

    public function edit($id)
    {
        $post = Post::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        return Inertia::render('dorm/posts/edit', [
            'post' => $this->formatPost($post)
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = Post::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric|min:0',
            'amenities'   => 'nullable|array',
            'images'      => 'nullable|array|max:10',
            'images.*'    => 'file|image|max:10240',
        ]);

        $images = $post->images;

        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('uploads', 'public');
            }
        }

        $post->update([
            'title'       => $validated['title'] ?? $post->title,
            'description' => $validated['description'] ?? $post->description,
            'price'       => $validated['price'] ?? $post->price,
            'amenities'   => $validated['amenities'] ?? $post->amenities,
            'images'      => $images,
        ]);

        return redirect()
            ->route('dorm.posts.history')
            ->with('success', 'Post updated.');
    }

    public function destroy($id)
    {
        $post = Post::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        $post->delete();

        return redirect()
            ->route('dorm.posts.history')
            ->with('success', 'Post deleted.');
    }

    private function formatPost(Post $post): array
    {
        return [
            'id'          => $post->id,
            'title'       => $post->title,
            'description' => $post->description,
            'price'       => $post->price,
            'amenities'   => is_array($post->amenities) ? $post->amenities : json_decode($post->amenities ?? '[]', true),
            'images'      => is_array($post->images) ? $post->images : json_decode($post->images ?? '[]', true),
            'createdAt'   => $post->created_at->toDateTimeString(),
        ];
    }
}
