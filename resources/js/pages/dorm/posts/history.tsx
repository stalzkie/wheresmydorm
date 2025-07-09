import { Head, usePage, Link } from '@inertiajs/react';
import type { DormPost, User } from '@/types/dorm';
import NavHeader from '@/components/ui/nav-header'; // ✅ Import the header

interface PageProps {
  auth: {
    user: User;
  };
  posts: DormPost[];
  [key: string]: unknown;
}

const resolveImageUrl = (path: string | undefined | null) => {
  if (!path || typeof path !== 'string') return '/placeholder.jpg';
  return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function PostHistory() {
  const { props } = usePage<PageProps>();
  const posts = props.posts;
  const user = props.auth.user;

  return (
    <>
      <Head title="Your Dorm Listings" />
      <NavHeader /> {/* ✅ Sticky header inserted */}

      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
        {/* LEFT COLUMN: Profile */}
        <aside className="md:col-span-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 shadow-inner" />
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="text-xs mt-1 text-gray-400 uppercase tracking-wide">{user.role}</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: Listings */}
        <main className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Your Dorm Listings</h1>
            <Link
              href={route('dorm.posts.create')}
              className="bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-2 rounded-full text-sm font-medium shadow transition"
            >
              + Add Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-500">You haven’t posted any dorm listings yet.</p>
          ) : (
            posts.map((post) => {
              const thumb = post.thumbnail || post.images?.[0];
              const otherImages = post.images?.filter((img) => img !== thumb) || [];

              return (
                <Link
                  key={post.id}
                  href={route('dorm.posts.show', post.id)}
                  className="block border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md hover:border-gray-300 transition"
                >
                  <div className="space-y-2">
                    {/* Price + Amenities */}
                    <div className="flex items-center justify-between flex-wrap">
                      <div className="text-lg font-semibold text-gray-900">
                        ₱{post.price.toLocaleString()}
                      </div>
                      {post.amenities?.length > 0 && (
                        <ul className="flex flex-wrap gap-2 text-xs text-gray-600">
                          {post.amenities.slice(0, 4).map((a, i) => (
                            <li
                              key={i}
                              className="bg-gray-100 px-2 py-1 rounded-full border text-gray-700"
                            >
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Image Gallery */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {[thumb, ...otherImages].map((img, i) => (
                        <img
                          key={i}
                          src={resolveImageUrl(img)}
                          alt={`Post image ${i + 1}`}
                          className="w-28 h-28 object-cover rounded border aspect-square flex-shrink-0"
                        />
                      ))}
                    </div>

                    {/* Title + Description */}
                    <div>
                      <h2 className="text-md font-semibold text-[#0A66C2]">{post.title}</h2>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">{post.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </main>
      </div>
    </>
  );
}
