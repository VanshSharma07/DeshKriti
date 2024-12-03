import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetails, createPost } from '../../../store/reducers/communityReducer';
import Header2 from '../../Header2';
import { FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreatePostForm from './CreatePostForm';
import PostItem from './PostItem';

const StateGroupDiscussion = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { currentGroup, loading } = useSelector(state => state.community);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupDetails(groupId));
    }
  }, [dispatch, groupId]);

  const handleCreatePost = async (postData) => {
    try {
      await dispatch(createPost({ groupId, ...postData })).unwrap();
      toast.success('Post created successfully!');
      setShowCreateForm(false);
      // Refresh group details to show new post
      dispatch(getGroupDetails(groupId));
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  if (loading) {
    return (
      <div>
        <Header2 />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading discussion...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header2 />
      <div className="container mx-auto px-4 py-8">
        {/* Group Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentGroup?.stateName}</h1>
          <p className="text-gray-600 mb-4">{currentGroup?.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <FaUsers className="mr-2" />
              <span>{currentGroup?.memberCount || 0} members</span>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Discussion
            </button>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreateForm && (
          <CreatePostForm
            onSubmit={handleCreatePost}
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {currentGroup?.posts?.length > 0 ? (
            currentGroup.posts.map(post => (
              <PostItem 
                key={post._id} 
                post={post} 
                groupId={groupId}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 bg-white rounded-lg shadow-md p-6">
              No discussions yet. Be the first to start one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateGroupDiscussion; 