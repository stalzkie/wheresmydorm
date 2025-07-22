import NavHeader from '@/components/ui/nav-header'; // ✅ Import the header
import type { DormPost, User } from '@/types/dorm';
import { Head, Link, usePage } from '@inertiajs/react';

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
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 font-sans md:grid-cols-4">
                {/* LEFT COLUMN: Profile */}
                <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 h-24 w-24 rounded-full bg-gray-200 shadow-inner" />
                        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <span className="mt-1 text-xs tracking-wide text-gray-400 uppercase">{user.role}</span>
                    </div>
                </aside>

                {/* RIGHT COLUMN: Listings */}
                <main className="space-y-6 md:col-span-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">Your Dorm Listings</h1>
                        <Link
                            href={route('dorm.posts.create')}
                            className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-[#004182]"
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
                                    className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-md"
                                >
                                    <div className="space-y-2">
                                        {/* Price + Amenities */}
                                        <div className="flex flex-wrap items-center justify-between">
                                            <div className="text-lg font-semibold text-gray-900">₱{post.price.toLocaleString()}</div>
                                            {post.amenities?.length > 0 && (
                                                <ul className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                    {post.amenities.slice(0, 4).map((a, i) => (
                                                        <li key={i} className="rounded-full border bg-gray-100 px-2 py-1 text-gray-700">
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
                                                    className="aspect-square h-28 w-28 flex-shrink-0 rounded border object-cover"
                                                />
                                            ))}
                                        </div>

                                        {/* Title + Description */}
                                        <div>
                                            <h2 className="text-md font-semibold text-[#0A66C2]">{post.title}</h2>
                                            <p className="mt-1 line-clamp-3 text-sm text-gray-700">{post.description}</p>
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
