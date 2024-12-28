import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { storiesService } from '../../api/storiesService';

const AddStory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [story, setStory] = useState({
        title: '',
        description: '',
        video: null,
        thumbnail: null
    });
    const [videoPreview, setVideoPreview] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!story.title || !story.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', story.title);
        formData.append('description', story.description);
        if (story.video) formData.append('video', story.video);
        if (story.thumbnail) formData.append('thumbnail', story.thumbnail);

        try {
            await storiesService.createStory(formData);
            toast.success('Story created successfully');
            navigate('/seller/dashboard/stories');
        } catch (error) {
            console.error('Story creation error:', error);
            toast.error(error.response?.data?.message || 'Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-[#d0d2d6]'>Add New Story</h2>
                    <button
                        onClick={() => navigate('/seller/dashboard/stories')}
                        className='bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md'
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div>
                        <label className='text-[#d0d2d6] block mb-1'>Title</label>
                        <input
                            type='text'
                            name='title'
                            value={story.title}
                            onChange={(e) => setStory({...story, title: e.target.value})}
                            className='w-full p-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:border-indigo-500 outline-none'
                            required
                        />
                    </div>

                    <div>
                        <label className='text-[#d0d2d6] block mb-1'>Description</label>
                        <textarea
                            name='description'
                            value={story.description}
                            onChange={(e) => setStory({...story, description: e.target.value})}
                            className='w-full p-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:border-indigo-500 outline-none'
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className='text-[#d0d2d6] block mb-1'>Video</label>
                        <input
                            type='file'
                            name='video'
                            accept='video/*'
                            onChange={(e) => setStory({...story, video: e.target.files[0]})}
                            className='w-full p-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                        />
                    </div>

                    <div>
                        <label className='text-[#d0d2d6] block mb-1'>Thumbnail</label>
                        <input
                            type='file'
                            name='thumbnail'
                            accept='image/*'
                            onChange={(e) => setStory({...story, thumbnail: e.target.files[0]})}
                            className='w-full p-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50'
                    >
                        {loading ? 'Creating...' : 'Create Story'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStory; 