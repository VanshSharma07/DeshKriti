import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getTopic, toggleLike, clearCurrentTopic, updateTopicComments } from '../../store/reducers/communityReducer';
import { FaRegHeart, FaHeart, FaShare } from 'react-icons/fa';
import moment from 'moment';
import Header2 from '../Header2';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const dispatch = useDispatch();
  const { currentTopic, loading } = useSelector(state => state.community);
  const { userInfo } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (topicId) {
      dispatch(getTopic(topicId));
    }
    return () => {
      dispatch(clearCurrentTopic());
    };
  }, [dispatch, topicId]);

  const isLikedByUser = currentTopic?.likes?.some(
    like => like.userId === userInfo?._id && 
    like.userType === (userInfo?.role === 'seller' ? 'sellers' : 'customers')
  );

  const handleLike = async () => {
    if (!userInfo) {
      toast.error('Please login to like topics');
      return;
    }
    try {
      await dispatch(toggleLike(topicId)).unwrap();
    } catch (error) {
      toast.error(error.error || 'Failed to like topic');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to comment');
      return;
    }
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const result = await dispatch(addComment({ 
        topicId, 
        commentData: { content: comment }
      })).unwrap();
      
      if (result.success) {
        setComment('');
        // Update comments locally instead of fetching the whole topic
        dispatch(updateTopicComments(result.comments));
        toast.success('Comment added successfully');
      } else {
        toast.error(result.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast.error(error.error || 'Failed to add comment');
    }
  };

  if (loading) {
    return (
      <>
        <Header2 />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

  if (!currentTopic?._id) {
    return (
      <>
        <Header2 />
        <div className="min-h-screen flex items-center justify-center">Topic not found</div>
      </>
    );
  }

  return (
    <>
      <Header2 />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentTopic.title}
                </h1>
                <div className="flex gap-2 mb-4">
                  {currentTopic.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-orange-50 text-[#FF9933] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#E6873C] transition"
                >
                  {isLikedByUser ? (
                    <FaHeart className="text-red-500" size={24} />
                  ) : (
                    <FaRegHeart size={24} />
                  )}
                  <span>{currentTopic.likes?.length || 0}</span>
                </button>
                <button className="text-gray-500 hover:text-blue-500 transition">
                  <FaShare size={24} />
                </button>
              </div>
            </div>

            {currentTopic.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentTopic.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Topic image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <p className="text-gray-700 text-lg mb-4 whitespace-pre-wrap">
              {currentTopic.content}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <img 
                  src={currentTopic.userId?.image || '/images/user.png'} 
                  alt="Author"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{currentTopic.userId?.name || 'Anonymous'}</span>
              </div>
              <span>{moment(currentTopic.createdAt).fromNow()}</span>
            </div>
          </div>

          {userInfo && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
              <form onSubmit={handleComment}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[100px]"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#138808] text-white rounded-lg hover:bg-[#0F6E06] transition"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          )}

          <CommentSection 
            comments={currentTopic.comments || []} 
            topicId={topicId}
          />
        </div>
      </div>
    </>
  );
};

export default TopicDetailPage;