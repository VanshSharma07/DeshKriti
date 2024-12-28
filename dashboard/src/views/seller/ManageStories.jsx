import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { storiesService } from '../../api/storiesService';

const ManageStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [totalStories, setTotalStories] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStories();
    }, [pageNumber, perPage, searchValue]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await storiesService.getSellerStories(pageNumber, perPage, searchValue);
            if (response && response.stories) {
                setStories(response.stories);
                setTotalStories(response.totalStories || 0);
            } else {
                setError('Invalid response format');
            }
        } catch (error) {
            console.error('Fetch stories error:', error);
            setError(error.message || 'Failed to fetch stories');
            toast.error('Failed to fetch stories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (storyId) => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                await storiesService.deleteStory(storyId);
                toast.success('Story deleted successfully');
                fetchStories();
            } catch (error) {
                toast.error('Failed to delete story');
            }
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-[#d0d2d6]'>Manage Stories</h2>
                    <Link 
                        to='/seller/dashboard/add-story'
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                    >
                        Add Story
                    </Link>
                </div>

                <div className='w-full overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>Story</th>
                                <th scope='col' className='py-3 px-4'>Category</th>
                                <th scope='col' className='py-3 px-4'>Status</th>
                                <th scope='col' className='py-3 px-4'>Date</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map((story) => (
                                <tr key={story._id} className='border-b border-slate-700'>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={story.image || '/default-story.jpg'} 
                                                alt={story.title} 
                                                className='w-12 h-12 rounded-lg object-cover'
                                            />
                                            <div>
                                                <h2 className='text-base font-medium'>{story.title}</h2>
                                                <p className='text-sm text-gray-400'>
                                                    {story.excerpt 
                                                        ? story.excerpt.length > 50 
                                                            ? `${story.excerpt.substring(0, 50)}...`
                                                            : story.excerpt
                                                        : 'No excerpt available'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-3 px-4'>{story.category || 'Uncategorized'}</td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-3 py-1 rounded-lg ${
                                            story.status === 'active' 
                                                ? 'bg-green-500/20 text-green-500' 
                                                : 'bg-red-500/20 text-red-500'
                                        }`}>
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        {moment(story.createdAt).format('DD MMM YYYY')}
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <button
                                                onClick={() => navigate(`/seller/dashboard/edit-story/${story._id}`)}
                                                className='p-2 bg-blue-500/20 rounded-md hover:bg-blue-500/30'
                                            >
                                                <FaEdit className='text-blue-500' />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(story._id)}
                                                className='p-2 bg-red-500/20 rounded-md hover:bg-red-500/30'
                                            >
                                                <FaTrash className='text-red-500' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className='flex justify-center items-center h-40'>
                        <span className='text-[#d0d2d6]'>Loading...</span>
                    </div>
                )}

                {!loading && stories.length === 0 && (
                    <div className='flex justify-center items-center h-40'>
                        <span className='text-[#d0d2d6]'>No stories found</span>
                    </div>
                )}

                {totalStories > perPage && (
                    <div className='flex justify-end gap-4 mt-4'>
                        <button
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber === 1}
                            className='px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50'
                        >
                            Previous
                        </button>
                        <span className='text-[#d0d2d6]'>
                            Page {pageNumber} of {Math.ceil(totalStories / perPage)}
                        </span>
                        <button
                            onClick={() => setPageNumber(prev => prev + 1)}
                            disabled={pageNumber >= Math.ceil(totalStories / perPage)}
                            className='px-3 py-1 bg-slate-700 rounded-md disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageStories; 