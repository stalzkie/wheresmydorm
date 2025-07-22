import NavHeader from '@/components/ui/nav-header';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

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
            <div className="mx-auto max-w-3xl py-8">
                <h1 className="mb-6 text-2xl font-bold">Add a New Dorm Listing</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Title</label>
                        <input
                            type="text"
                            className="w-full rounded border p-2"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            className="w-full rounded border p-2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Price (₱)</label>
                        <input
                            type="number"
                            className="w-full rounded border p-2"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Amenities (comma separated)</label>
                        <input
                            type="text"
                            className="w-full rounded border p-2"
                            value={data.amenities.join(', ')}
                            onChange={(e) =>
                                setData(
                                    'amenities',
                                    e.target.value.split(',').map((a) => a.trim()),
                                )
                            }
                        />
                        {errors.amenities && <p className="text-sm text-red-500">{errors.amenities}</p>}
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
                            className="w-full rounded border p-2"
                        />
                        <p className="mt-1 text-sm text-gray-600">{data.images.length} of 10 images selected</p>
                        {imageLimitError && <p className="text-sm text-red-500">{imageLimitError}</p>}
                        {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
                    </div>

                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        {processing ? 'Submitting...' : 'Add Post'}
                    </button>
                </form>
            </div>
        </>
    );
}
