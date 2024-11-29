import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, toggleCommentLike, updateTopicComments } from '../../store/reducers/communityReducer';
import moment from 'moment';
import { FaReply, FaRegHeart, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Comment = ({ comment, level = 0 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    const isLikedByUser = comment.likes?.some(
        like => like.userId === userInfo?._id
    );

    const handleReply = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error('Please login to reply');
            return;
        }
        if (!replyContent.trim()) {
            toast.error('Reply cannot be empty');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await dispatch(addComment({
                topicId: comment.topicId,
                commentData: {
                    content: replyContent.trim(),
                    parentId: comment._id
                }
            })).unwrap();

            if (result.success) {
                setReplyContent('');
                setShowReplyForm(false);
                dispatch(updateTopicComments(result.comments));
                toast.success('Reply added successfully');
            }
        } catch (error) {
            toast.error(error.error || 'Failed to add reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!userInfo) {
            toast.error('Please login to like comments');
            return;
        }
        try {
            const result = await dispatch(toggleCommentLike({
                topicId: comment.topicId,
                commentId: comment._id
            })).unwrap();
            if (result.success) {
                dispatch(updateTopicComments(result.comments));
            }
        } catch (error) {
            toast.error(error.error || 'Failed to like comment');
        }
    };

    return (
        <div className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <img 
                            src={comment.userId?.image || '/images/user.png'} 
                            alt={comment.userId?.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                {comment.userId ? 
                                    `${comment.userId.firstName} ${comment.userId.lastName || ''}`.trim() 
                                    : 'Anonymous'}
                            </h4>
                            <span className="text-sm text-gray-500">
                                {moment(comment.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
                    >
                        {isLikedByUser ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart />
                        )}
                        <span>{comment.likes?.length || 0}</span>
                    </button>
                </div>

                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>

                <div className="flex gap-4 text-sm">
                    <button 
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                        <FaReply /> Reply
                    </button>
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReply} className="mt-3">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                            rows="2"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Reply
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {comment.replies?.map(reply => (
                <Comment 
                    key={reply._id} 
                    comment={reply}
                    level={level + 1}
                />
            ))}
        </div>
    );
};

const CommentSection = ({ comments, topicId }) => {
    const [visibleComments, setVisibleComments] = useState(5);
    const hasMoreComments = comments?.length > visibleComments;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">
                Comments ({comments?.length || 0})
            </h3>
            
            <div className="space-y-4">
                {comments?.slice(0, visibleComments).map(comment => (
                    <Comment 
                        key={comment._id} 
                        comment={comment}
                    />
                ))}
            </div>

            {hasMoreComments && (
                <button
                    onClick={() => setVisibleComments(prev => prev + 5)}
                    className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                    <FaChevronDown /> Show More Comments
                </button>
            )}

            {visibleComments > 5 && (
                <button
                    onClick={() => setVisibleComments(5)}
                    className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                    <FaChevronUp /> Show Less
                </button>
            )}
        </div>
    );
};

export default CommentSection;