// Full revised view.tsx including thumbnail selection, image editing, and all original layout

import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { DormPost, User } from '@/types/dorm';
import NavHeader from '@/components/ui/nav-header';

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
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Post Header with Edit/Delete */}
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          {editing ? (
            <form onSubmit={handleEditSubmit} className="w-full space-y-2">
              <input
                className="text-xl font-semibold text-[#0a66c2] w-full border p-2 rounded"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
              <textarea
                className="w-full border p-2 rounded text-sm"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              <input
                type="number"
                className="w-full border p-2 rounded text-sm"
                value={data.price}
                onChange={(e) => setData('price', Number(e.target.value))}
              />
              <input
                type="text"
                className="w-full border p-2 rounded text-sm"
                value={data.amenities.join(', ')}
                onChange={(e) =>
                  setData('amenities', e.target.value.split(',').map((a) => a.trim()))
                }
              />

              {/* Thumbnail Picker */}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Select Thumbnail</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={`/storage/${img}`}
                        className={`w-full h-32 object-cover rounded border ${
                          thumbnail === img ? 'ring-4 ring-blue-500' : ''
                        }`}
                        onClick={() => setThumbnail(img)}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
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
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={processing}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-semibold text-[#0a66c2]">{post.title}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Hosted by <span className="font-medium">{post.host}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Image Gallery (non-edit mode) */}
        {post.images?.length > 0 && !editing && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={`/storage/${img}`}
                  alt={`Image ${i + 1}`}
                  className="rounded object-cover w-full h-40 border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Meta Data */}
        <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-700 space-y-2">
          <div className="text-xl font-semibold text-[#333]">₱{post.price.toLocaleString()}</div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span>⭐ {post.averageRating.toFixed(1)} avg rating</span>
            <span>🗣️ {post.reviewCount} reviews</span>
            <span>👁️ {post.impressions} impressions</span>
            <span>🔥 {post.engagements} engagements</span>
          </div>
        </div>

        {/* Amenities */}
        {post.amenities?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {post.amenities.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full border text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Map */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Location</h2>
          <div className="w-full h-64 rounded overflow-hidden border">
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Reviews</h2>
          {post.reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            post.reviews.map((review) => (
              <div key={review.id} className="border-t pt-4 mt-4">
                <p className="font-semibold text-gray-800">{review.user.name}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
                <p className="text-yellow-600 text-sm mt-1">Rating: {review.rating} ⭐</p>
                <p className="text-gray-700 mt-1 text-sm">{review.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800">Delete this post?</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete <strong>{post.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
