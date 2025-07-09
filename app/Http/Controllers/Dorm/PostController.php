<?php

namespace App\Http\Controllers\Dorm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Post;

class PostController extends Controller
{
    // ✅ Show post timeline with user profile
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

    // ✅ Show add post form
    public function create()
    {
        return Inertia::render('dorm/posts/add');
    }

    // ✅ Handle post submission
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'amenities'   => 'nullable|array',
            'images'      => 'nullable|array',
        ]);

        Post::create([
            'user_id'     => Auth::id(),
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? '',
            'price'       => $validated['price'],
            'amenities'   => json_encode($validated['amenities'] ?? []),
            'images'      => json_encode($validated['images'] ?? []),
        ]);

        return redirect()
            ->route('dorm.posts.history')
            ->with('success', 'Post created successfully.');
    }

    // ✅ Show single post
    public function show($id)
    {
        $post = Post::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        return Inertia::render('dorm/posts/show', [
            'post' => $this->formatPost($post)
        ]);
    }

    // ✅ Show post edit form
    public function edit($id)
    {
        $post = Post::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        return Inertia::render('dorm/posts/edit', [
            'post' => $this->formatPost($post)
        ]);
    }

    // ✅ Handle post update
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
            'images'      => 'nullable|array',
        ]);

        $post->update([
            'title'       => $validated['title'] ?? $post->title,
            'description' => $validated['description'] ?? $post->description,
            'price'       => $validated['price'] ?? $post->price,
            'amenities'   => json_encode($validated['amenities'] ?? json_decode($post->amenities, true)),
            'images'      => json_encode($validated['images'] ?? json_decode($post->images, true)),
        ]);

        return redirect()
            ->route('dorm.posts.history')
            ->with('success', 'Post updated.');
    }

    // ✅ Handle post deletion
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

    // 🔁 Shared formatting helper
    private function formatPost(Post $post): array
    {
        return [
            'id'          => $post->id,
            'title'       => $post->title,
            'description' => $post->description,
            'price'       => $post->price,
            'amenities'   => json_decode($post->amenities ?? '[]', true),
            'images'      => json_decode($post->images ?? '[]', true),
            'createdAt'   => $post->created_at->toDateTimeString(),
        ];
    }
}
