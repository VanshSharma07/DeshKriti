import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetails, joinStateGroup, createPost } from '../../../store/reducers/communityReducer';
import Header2 from '../../Header2';
import { FaUsers, FaComment, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const StateGroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGroup, loading } = useSelector(state => state.community);
  const { userInfo } = useSelector(state => state.auth);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupDetails(groupId));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    console.log('Current Group Status:', currentGroup);
    if (currentGroup?.isMember === true) {
      console.log('Redirecting to discussion...');
      navigate(`/community/groups/${groupId}/discussion`);
    }
  }, [currentGroup, navigate, groupId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please login to create a post');
      return;
    }

    if (!newPost.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      await dispatch(createPost({ 
        groupId, 
        content: newPost 
      })).unwrap();
      
      setNewPost('');
      toast.success('Post created successfully!');
      
      dispatch(getGroupDetails(groupId));
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const handleJoinGroup = async () => {
    if (!userInfo) {
      toast.error('Please login to join the group');
      return;
    }

    try {
      const result = await dispatch(joinStateGroup(groupId)).unwrap();
      if (result.alreadyMember) {
        navigate(`/community/groups/${groupId}/discussion`);
      } else {
        toast.success('Successfully joined group!');
        dispatch(getGroupDetails(groupId));
      }
    } catch (error) {
      if (error.error === 'Already a member') {
        navigate(`/community/groups/${groupId}/discussion`);
      } else {
        toast.error(error.message || 'Failed to join group');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-2xl text-gray-600">Loading...</div>
    </div>;
  }

  if (!currentGroup) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-2xl text-gray-600">Group not found</div>
    </div>;
  }

  if (!userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-2xl text-gray-600">Please login to view discussions</div>
    </div>;
  }

  if (!currentGroup.isMember) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header2 />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">{currentGroup.stateName}</h2>
            <p className="text-gray-600 mb-6">
              Please join the group first to view and participate in discussions.
            </p>
            <button
              onClick={handleJoinGroup}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Join Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{currentGroup.stateName}</h1>
          <p className="text-gray-600 mb-4">{currentGroup.description}</p>
          <div className="flex items-center text-gray-500">
            <FaUsers className="mr-2" />
            <span>{currentGroup.memberCount} members</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleCreatePost}>
            <textarea
              className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share something with the group..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="4"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {currentGroup.posts?.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img
                  src={post.userId.image || '/default-avatar.png'}
                  alt={post.userId.firstName}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">
                    {post.userId.firstName} {post.userId.lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <FaHeart className="mr-2" />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <FaComment className="mr-2" />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateGroupDetail; 