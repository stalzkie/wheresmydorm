import { Head, usePage, Link } from '@inertiajs/react';
import type { DormPost, User } from '@/types/dorm';

interface PageProps {
  auth: {
    user: User;
  };
  posts: DormPost[];
  [key: string]: unknown; // ✅ Ensures compatibility with Inertia
}

export default function PostHistory() {
  const { props } = usePage<PageProps>();
  const posts = props.posts;
  const user = props.auth.user;

  return (
    <>
      <Head title="Your Dorm Listings" />

      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT COLUMN: Profile */}
        <aside className="md:col-span-1 bg-white shadow rounded-lg p-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
          </div>
        </aside>

        {/* RIGHT COLUMN: Post History */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Dorm Listings</h1>
            <Link
              href={route('dorm.posts.create')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              + Add Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-500">You haven’t posted any dorm listings yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-300 rounded p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-blue-800">{post.title}</h2>
                <p className="text-gray-700">{post.description}</p>
                <p className="mt-2 text-green-600 font-medium">
                  ₱{post.price.toLocaleString()}
                </p>

                {post.amenities?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-600">Amenities:</p>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                      {post.amenities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {post.images?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Post image ${i + 1}`}
                        className="w-28 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}
