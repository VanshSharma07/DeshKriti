import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import moment from 'moment';

const StoryComments = ({ storyId, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, storyId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/story/${storyId}/comments`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log('Comments fetched:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('Comments fetch error:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const commentData = {
        content: newComment.trim(),
        userInfo: {
          _id: userInfo._id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          image: userInfo.image
        }
      };

      const response = await api.post(`/story/${storyId}/comment`, commentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      const newCommentWithUser = {
        ...response.data,
        user: {
          _id: userInfo._id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          image: userInfo.image
        }
      };
      
      setComments(prev => [...prev, newCommentWithUser]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Comment post error:', error);
      setError('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[70vh] z-[60]"
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
          <button onClick={onClose} className="p-2">
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-140px)] overflow-y-auto p-4">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.user?.image || '/images/user.png'}
                    alt={`${comment.user?.firstName || 'User'}'s avatar`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/user.png';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {comment.user ? 
                        `${comment.user.firstName} ${comment.user.lastName || ''}`.trim() 
                        : 'Anonymous'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition">
                  <FaRegHeart />
                  <span>{comment.likes?.length || 0}</span>
                </button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <img
            src={userInfo?.image || '/images/user.png'}
            alt={userInfo?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/user.png';
            }}
          />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Comment as ${userInfo ? `${userInfo.firstName} ${userInfo.lastName || ''}`.trim() : 'Anonymous'}...`}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className={`px-4 py-2 bg-purple-600 text-white rounded-full ${
                isLoading || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default StoryComments; 