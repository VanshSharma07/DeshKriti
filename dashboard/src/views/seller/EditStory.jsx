import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { storiesService } from '../../api/storiesService';

const EditStory = () => {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [story, setStory] = useState({
        title: '',
        description: '',
        video: null,
        thumbnail: null
    });
    const [videoPreview, setVideoPreview] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [currentVideo, setCurrentVideo] = useState('');
    const [currentThumbnail, setCurrentThumbnail] = useState('');

    useEffect(() => {
        const fetchStoryDetails = async () => {
            try {
                setInitialLoading(true);
                const response = await storiesService.getStory(storyId);
                const storyData = response.story;
                
                setStory({
                    title: storyData.title,
                    description: storyData.description,
                    video: null,
                    thumbnail: null
                });
                
                setCurrentVideo(storyData.videoUrl);
                setCurrentThumbnail(storyData.thumbnail);
                setVideoPreview(storyData.videoUrl);
                setThumbnailPreview(storyData.thumbnail);
                
            } catch (error) {
                const errorMessage = error.error || 'Failed to fetch story details';
                toast.error(errorMessage);
                setError(errorMessage);
                setTimeout(() => {
                    navigate('/seller/dashboard/stories');
                }, 2000);
            } finally {
                setInitialLoading(false);
            }
        };

        if (storyId) {
            fetchStoryDetails();
        }
    }, [storyId, navigate]);

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
        
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', story.title);
            formData.append('description', story.description);
            
            // Only append files if they've been changed
            if (story.video) {
                formData.append('video', story.video);
            }
            if (story.thumbnail) {
                formData.append('thumbnail', story.thumbnail);
            }

            await storiesService.updateStory(storyId, formData);
            toast.success('Story updated successfully');
            navigate('/seller/dashboard/stories');
            
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update story');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className='px-2 lg:px-7 pt-5'>
                <div className='w-full p-4 bg-[#283046] rounded-md'>
                    <div className='flex justify-center items-center h-48'>
                        <span className='text-[#d0d2d6]'>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='px-2 lg:px-7 pt-5'>
                <div className='w-full p-4 bg-[#283046] rounded-md'>
                    <div className='flex justify-center items-center h-48'>
                        <span className='text-red-500'>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-[#d0d2d6]'>Edit Story</h2>
                    <button
                        onClick={() => navigate('/seller/dashboard/stories')}
                        className='bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md'
                    >
                        Back
                    </button>
                </div>
                
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
                                />
                                <p className='text-sm text-gray-400 mt-1'>Leave empty to keep current video</p>
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
                                />
                                <p className='text-sm text-gray-400 mt-1'>Leave empty to keep current thumbnail</p>
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
                                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50'
                            >
                                {loading ? 'Updating...' : 'Update Story'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStory; 