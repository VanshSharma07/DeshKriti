import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, toggleLike } from '../../../store/reducers/communityReducer';
import moment from 'moment';
import { FaReply, FaRegHeart, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Comment = ({ comment, groupId, postId, level = 0 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

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
            await dispatch(addComment({
                groupId,
                postId,
                content: replyContent.trim(),
                parentId: comment._id
            })).unwrap();

            setReplyContent('');
            setShowReplyForm(false);
            toast.success('Reply added successfully');
        } catch (error) {
            toast.error(error.error || 'Failed to add reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate indentation based on level
    const indentationClass = level > 0 
        ? `ml-${Math.min(level * 12, 24)} border-l-2 border-gray-100 pl-4` 
        : '';

    return (
        <div className={`${indentationClass} mb-4`}>
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <img 
                            src={comment.userId?.image || '/images/user.png'} 
                            alt={comment.userId?.firstName}
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
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Replying...' : 'Reply'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Render nested replies */}
            <div className="space-y-4">
                {comment.replies?.map(reply => (
                    <Comment 
                        key={reply._id} 
                        comment={reply}
                        groupId={groupId}
                        postId={postId}
                        level={level + 1}
                    />
                ))}
            </div>
        </div>
    );
};

const PostItem = ({ post, groupId }) => {
    const [visibleComments, setVisibleComments] = useState(5);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    const hasMoreComments = post.comments?.length > visibleComments;
    const topLevelComments = post.comments?.filter(comment => !comment.parentId) || [];

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error('Please login to comment');
            return;
        }
        if (!replyContent.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addComment({
                groupId,
                postId: post._id,
                content: replyContent.trim()
            })).unwrap();
            
            setReplyContent('');
            setShowReplyForm(false);
            toast.success('Comment added successfully');
        } catch (error) {
            toast.error(error.error || 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-4">
                <img
                    src={post.userId.image || "/images/user.png"}
                    alt={`${post.userId.firstName} ${post.userId.lastName}`}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="font-semibold">
                        {post.userId.firstName} {post.userId.lastName}
                    </div>
                    <div className="text-gray-500 text-sm">
                        {moment(post.createdAt).fromNow()}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <p className="text-gray-800">{post.content}</p>
                {post.images && post.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {post.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="rounded-lg w-full h-48 object-cover"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-6">
                    Comments ({post.comments?.length || 0})
                </h3>

                <button 
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="mb-4 text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                    <FaReply /> Add Comment
                </button>

                {showReplyForm && (
                    <form onSubmit={handleAddComment} className="mb-6">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your comment..."
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                            rows="3"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="space-y-4">
                    {topLevelComments.slice(0, visibleComments).map(comment => (
                        <Comment 
                            key={comment._id} 
                            comment={comment}
                            groupId={groupId}
                            postId={post._id}
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
        </div>
    );
};

export default PostItem; 