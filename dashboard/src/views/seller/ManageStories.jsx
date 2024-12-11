import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { storiesService } from '../../api/storiesService';
import Search from '../../components/Search';
import Pagination from '../../components/Pagination';

const ManageStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [totalStories, setTotalStories] = useState(0);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        fetchStories();
    }, [pageNumber, perPage, searchValue]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const response = await storiesService.getSellerStories(pageNumber, perPage, searchValue);
            if (response && response.stories) {
                setStories(response.stories);
                setTotalStories(response.totalStories || 0);
            }
        } catch (error) {
            console.error('Fetch stories error:', error);
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

    const StoryPreviewModal = ({ story, onClose }) => {
        if (!story) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-[#283046] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-[#d0d2d6]">{story.title}</h3>
                            <button 
                                onClick={onClose}
                                className="text-[#d0d2d6] hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <video 
                                src={story.videoUrl} 
                                controls 
                                poster={story.thumbnail}
                                className="absolute top-0 left-0 w-full h-full object-contain bg-black"
                            />
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-[#d0d2d6] mb-2">Description</h4>
                            <p className="text-[#d0d2d6] mb-4 whitespace-pre-wrap">{story.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <div>
                                    <p>Views: {story.viewCount || story.views?.length || 0}</p>
                                    <p>Likes: {story.likeCount || story.likes?.length || 0}</p>
                                </div>
                                <div>
                                    <p>Status: {story.status}</p>
                                    <p>Posted: {moment(story.createdAt).format('LLL')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='flex flex-wrap justify-between items-center mb-6 gap-4'>
                    <h1 className='text-2xl font-semibold text-gray-700'>Manage Stories</h1>
                    <div className='flex items-center gap-4'>
                        <Link 
                            to="/seller/dashboard/add-story" 
                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2'
                        >
                            <span>Add New Story</span>
                            <span className='text-xl'>+</span>
                        </Link>
                        <Search 
                            setParPage={setPerPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead>
                            <tr className='bg-gray-50 border-b border-gray-100'>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Title</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Category</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Date</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map((story, index) => (
                                <tr key={story._id} className='border-b border-gray-50 hover:bg-gray-50'>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={story.image} 
                                                alt={story.title} 
                                                className='w-12 h-12 rounded-lg object-cover'
                                            />
                                            <div>
                                                <h2 className='text-gray-700 font-medium'>{story.title}</h2>
                                                <p className='text-sm text-gray-500'>{story.excerpt.substring(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-gray-600'>{story.category}</td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            story.status === 'published' 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 text-gray-600'>
                                        {moment(story.createdAt).format('MMM DD, YYYY')}
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <button
                                                onClick={() => setSelectedStory(story)}
                                                className='text-blue-500 hover:text-blue-600'
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <Link 
                                                to={`/seller/dashboard/edit-story/${story._id}`}
                                                className='text-green-500 hover:text-green-600'
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(story._id)}
                                                className='text-red-500 hover:text-red-600'
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {stories.length > 0 && (
                    <div className='mt-4 flex justify-end'>
                        <Pagination
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            totalItems={totalStories}
                            perPage={perPage}
                            showingText={true}
                        />
                    </div>
                )}

                {loading && (
                    <div className='flex justify-center items-center h-40'>
                        <div className='animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent'></div>
                    </div>
                )}

                {stories.length === 0 && !loading && (
                    <div className='text-center py-8'>
                        <p className='text-gray-500'>No stories found</p>
                    </div>
                )}
            </div>

            {selectedStory && (
                <StoryPreviewModal 
                    story={selectedStory} 
                    onClose={() => setSelectedStory(null)} 
                />
            )}
        </div>
    );
};

export default ManageStories; 