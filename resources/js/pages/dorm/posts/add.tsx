import { useForm, Head } from '@inertiajs/react';

export default function AddPost() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    price: '',
    amenities: [''],
    images: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('dorm.posts.store')); // Sends POST to Laravel
  };

  return (
    <>
      <Head title="Add New Dorm Post" />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add a New Dorm Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="w-full border rounded p-2"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <label className="block font-medium">Price (₱)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={data.price}
              onChange={e => setData('price', e.target.value)}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-medium">Amenities (comma separated)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.amenities.join(', ')}
              onChange={e => setData('amenities', e.target.value.split(',').map(a => a.trim()))}
            />
            {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities}</p>}
          </div>

          <div>
            <label className="block font-medium">Image URLs (comma separated)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.images.join(', ')}
              onChange={e => setData('images', e.target.value.split(',').map(i => i.trim()))}
            />
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
