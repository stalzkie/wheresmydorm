import { useForm, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from 'react';
import NavHeader from '@/components/ui/nav-header';

export default function AddPost() {
  const [imageLimitError, setImageLimitError] = useState('');
  const { data, setData, post, processing, errors, reset } = useForm<{
    title: string;
    description: string;
    price: string;
    amenities: string[];
    images: File[];
  }>({
    title: '',
    description: '',
    price: '',
    amenities: [],
    images: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.images.length > 10) {
      setImageLimitError('You can only upload up to 10 images.');
      return;
    }

    setImageLimitError('');

    post(route('dorm.posts.store'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        console.log('Dorm post created!');
        reset();
      },
    });
  };

  return (
    <>
      <Head title="Add New Dorm Post" />
      <NavHeader /> {/* ✅ Sticky header inserted */}
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add a New Dorm Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="w-full border rounded p-2"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <label className="block font-medium">Price (₱)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={data.price}
              onChange={(e) => setData('price', e.target.value)}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-medium">Amenities (comma separated)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.amenities.join(', ')}
              onChange={(e) =>
                setData('amenities', e.target.value.split(',').map((a) => a.trim()))
              }
            />
            {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities}</p>}
          </div>

          <div>
            <label className="block font-medium">Upload Images (Max: 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files);
                  if (selectedFiles.length > 10) {
                    setImageLimitError('You can only upload up to 10 images.');
                  } else {
                    setData('images', selectedFiles);
                    setImageLimitError('');
                  }
                }
              }}
              className="w-full border rounded p-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              {data.images.length} of 10 images selected
            </p>
            {imageLimitError && <p className="text-red-500 text-sm">{imageLimitError}</p>}
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {processing ? 'Submitting...' : 'Add Post'}
          </button>
        </form>
      </div>
    </>
  );
}
