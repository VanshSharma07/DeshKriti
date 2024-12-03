import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { storiesService } from '../../api/storiesService';
import { useNavigate } from 'react-router-dom';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStory(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            setStory(prev => ({
                ...prev,
                [name]: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'video') {
                    setVideoPreview(reader.result);
                } else {
                    setThumbnailPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!story.video || !story.thumbnail) {
            toast.error('Please select both video and thumbnail');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', story.title);
        formData.append('description', story.description);
        formData.append('video', story.video);
        formData.append('thumbnail', story.thumbnail);

        try {
            const response = await storiesService.createStory(formData);
            
            if (response.data) {
                toast.success('Story created successfully');
                // Navigate to manage stories page after successful creation
                navigate('/seller/dashboard/stories');
            }
        } catch (error) {
            console.error('Story creation error:', error);
            toast.error(error.response?.data?.error || 'Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <h2 className='text-xl font-semibold text-[#d0d2d6] pb-4'>Add New Story</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='title' className='text-[#d0d2d6]'>Title</label>
                            <input 
                                type='text'
                                id='title'
                                name='title'
                                className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                                placeholder='Story title'
                                value={story.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor='description' className='text-[#d0d2d6]'>Description</label>
                            <textarea
                                id='description'
                                name='description'
                                className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                                placeholder='Story description'
                                value={story.description}
                                onChange={handleInputChange}
                                rows={3}
                                required
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='video' className='text-[#d0d2d6]'>Video</label>
                                <input 
                                    type='file'
                                    id='video'
                                    name='video'
                                    accept='video/*'
                                    onChange={handleFileChange}
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                                    required
                                />
                                {videoPreview && (
                                    <video 
                                        src={videoPreview} 
                                        className='mt-2 w-full max-h-[200px]' 
                                        controls
                                    />
                                )}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor='thumbnail' className='text-[#d0d2d6]'>Thumbnail</label>
                                <input 
                                    type='file'
                                    id='thumbnail'
                                    name='thumbnail'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                                    required
                                />
                                {thumbnailPreview && (
                                    <img 
                                        src={thumbnailPreview} 
                                        alt='Thumbnail preview' 
                                        className='mt-2 w-full max-h-[200px] object-cover'
                                    />
                                )}
                            </div>
                        </div>

                        <div className='mt-4'>
                            <button
                                type='submit'
                                disabled={loading}
                                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]`}
                            >
                                {loading ? (
                                    <>
                                        <svg 
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                        >
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4"
                                            />
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Story'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStory; 