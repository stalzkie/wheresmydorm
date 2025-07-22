// Full revised view.tsx including thumbnail selection, image editing, and all original layout

import NavHeader from '@/components/ui/nav-header';
import type { DormPost, User } from '@/types/dorm';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Review {
    id: number;
    user: { name: string };
    rating: number;
    description: string;
    date: string;
}

interface DormPageProps {
    auth: { user: User };
    post: DormPost & {
        establishment: string;
        host: string;
        impressions: number;
        engagements: number;
        averageRating: number;
        reviewCount: number;
        reviews: Review[];
        location: { lat: number; lng: number };
    };
    [key: string]: unknown;
}

export default function ViewPost() {
    const { props } = usePage<DormPageProps>();
    const post = props.post;

    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(post.images || []);
    const [thumbnail, setThumbnail] = useState<string>(post.images?.[0] || '');

    const { data, setData, processing } = useForm({
        title: post.title,
        description: post.description,
        price: post.price,
        amenities: post.amenities,
        images: [] as File[],
        thumbnail: post.images?.[0] || '',
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.visit(route('dorm.posts.update', post.id), {
            method: 'put',
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                amenities: data.amenities,
                images: newImages,
                existingImages,
                thumbnail,
            },
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const handleDelete = () => {
        router.delete(route('dorm.posts.destroy', post.id));
    };

    const removeExistingImage = (img: string) => {
        setExistingImages(existingImages.filter((i) => i !== img));
        if (thumbnail === img) setThumbnail(existingImages[0] || '');
    };

    return (
        <>
            <Head title={post.title} />
            <NavHeader /> {/* ✅ Sticky header inserted */}
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
                {/* Post Header with Edit/Delete */}
                <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow">
                    {editing ? (
                        <form onSubmit={handleEditSubmit} className="w-full space-y-2">
                            <input
                                className="w-full rounded border p-2 text-xl font-semibold text-[#0a66c2]"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <textarea
                                className="w-full rounded border p-2 text-sm"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <input
                                type="number"
                                className="w-full rounded border p-2 text-sm"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                            />
                            <input
                                type="text"
                                className="w-full rounded border p-2 text-sm"
                                value={data.amenities.join(', ')}
                                onChange={(e) =>
                                    setData(
                                        'amenities',
                                        e.target.value.split(',').map((a) => a.trim()),
                                    )
                                }
                            />

                            {/* Thumbnail Picker */}
                            <div className="mt-2">
                                <p className="mb-1 text-sm font-medium text-gray-700">Select Thumbnail</p>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative">
                                            <img
                                                src={`/storage/${img}`}
                                                className={`h-32 w-full rounded border object-cover ${
                                                    thumbnail === img ? 'ring-4 ring-blue-500' : ''
                                                }`}
                                                onClick={() => setThumbnail(img)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img)}
                                                className="absolute top-1 right-1 rounded bg-red-600 px-2 text-xs text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium">Add More Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) setNewImages(Array.from(e.target.files));
                                    }}
                                    className="w-full rounded border p-2"
                                />
                            </div>

                            <div className="mt-2 flex gap-2">
                                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" disabled={processing}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="rounded border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-2xl font-semibold text-[#0a66c2]">{post.title}</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Hosted by <span className="font-medium">{post.host}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="rounded bg-yellow-500 px-4 py-1 text-sm text-white hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="rounded bg-red-600 px-4 py-1 text-sm text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Image Gallery (non-edit mode) */}
                {post.images?.length > 0 && !editing && (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Photos</h2>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {post.images.map((img, i) => (
                                <img key={i} src={`/storage/${img}`} alt={`Image ${i + 1}`} className="h-40 w-full rounded border object-cover" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Meta Data */}
                <div className="space-y-2 rounded-lg bg-white p-6 text-sm text-gray-700 shadow">
                    <div className="text-xl font-semibold text-[#333]">₱{post.price.toLocaleString()}</div>
                    <div className="mt-2 flex flex-wrap gap-4">
                        <span>⭐ {post.averageRating.toFixed(1)} avg rating</span>
                        <span>🗣️ {post.reviewCount} reviews</span>
                        <span>👁️ {post.impressions} impressions</span>
                        <span>🔥 {post.engagements} engagements</span>
                    </div>
                </div>

                {/* Amenities */}
                {post.amenities?.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">Amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {post.amenities.map((item, i) => (
                                <span key={i} className="rounded-full border bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location Map */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-2 text-lg font-semibold text-gray-800">Location</h2>
                    <div className="h-64 w-full overflow-hidden rounded border">
                        <iframe
                            width="100%"
                            height="100%"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${post.location.lat},${post.location.lng}`}
                        />
                    </div>
                </div>

                {/* Reviews */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Reviews</h2>
                    {post.reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">No reviews yet.</p>
                    ) : (
                        post.reviews.map((review) => (
                            <div key={review.id} className="mt-4 border-t pt-4">
                                <p className="font-semibold text-gray-800">{review.user.name}</p>
                                <p className="text-xs text-gray-500">{review.date}</p>
                                <p className="mt-1 text-sm text-yellow-600">Rating: {review.rating} ⭐</p>
                                <p className="mt-1 text-sm text-gray-700">{review.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800">Delete this post?</h2>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to permanently delete <strong>{post.title}</strong>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowDeleteModal(false)} className="rounded border px-4 py-2 text-sm">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
