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
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center mb-5'>
                    <h2 className='text-xl font-semibold text-[#d0d2d6]'>Manage Stories</h2>
                    <Link 
                        to='/seller/dashboard/story/add'
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                    >
                        Add New Story
                    </Link>
                </div>

                <Search 
                    setPerPage={setPerPage}
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />

                {loading ? (
                    <div className='flex justify-center items-center h-48'>
                        <span className='text-[#d0d2d6]'>Loading...</span>
                    </div>
                ) : (
                    <>
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-[#d0d2d6]'>
                                <thead className='text-xs text-[#d0d2d6] uppercase border-b border-slate-700'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>No</th>
                                        <th scope='col' className='py-3 px-4'>Thumbnail</th>
                                        <th scope='col' className='py-3 px-4'>Title</th>
                                        <th scope='col' className='py-3 px-4'>Views</th>
                                        <th scope='col' className='py-3 px-4'>Likes</th>
                                        <th scope='col' className='py-3 px-4'>Date</th>
                                        <th scope='col' className='py-3 px-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stories.map((story, index) => (
                                        <tr key={story._id} className='border-b border-slate-700'>
                                            <td className='py-3 px-4'>{index + 1}</td>
                                            <td className='py-3 px-4'>
                                                <img 
                                                    src={story.thumbnail} 
                                                    alt={story.title} 
                                                    className='w-16 h-12 object-cover rounded'
                                                />
                                            </td>
                                            <td className='py-3 px-4'>{story.title}</td>
                                            <td className='py-3 px-4'>{story.views?.length || 0}</td>
                                            <td className='py-3 px-4'>{story.likes?.length || 0}</td>
                                            <td className='py-3 px-4'>
                                                {moment(story.createdAt).format('DD/MM/YYYY')}
                                            </td>
                                            <td className='py-3 px-4'>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => setSelectedStory(story)}
                                                        className='p-2 bg-green-500 rounded-md hover:bg-green-600'
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <Link 
                                                        to={`/seller/dashboard/story/edit/${story._id}`}
                                                        className='p-2 bg-yellow-500 rounded-md hover:bg-yellow-600'
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(story._id)}
                                                        className='p-2 bg-red-500 rounded-md hover:bg-red-600'
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {stories.length > 0 && (
                            <div className="mt-4">
                                <Pagination
                                    pageNumber={pageNumber}
                                    setPageNumber={setPageNumber}
                                    totalItems={totalStories}
                                    perPage={perPage}
                                    showingText={true}
                                />
                            </div>
                        )}

                        {stories.length === 0 && !loading && (
                            <div className='text-center py-8'>
                                <p className='text-[#d0d2d6]'>No stories found</p>
                            </div>
                        )}
                    </>
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