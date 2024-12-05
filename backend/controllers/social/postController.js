const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Post = require('../../models/social/Post');
const customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true,
});

// Configure multer for temporary storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

class PostController {
    getFeedPosts = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10; // posts per page
            const skip = (page - 1) * limit;

            // First, get all posts (temporary solution for testing)
            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'firstName lastName image location')
                .lean();

            const total = await Post.countDocuments();
            const totalPages = Math.ceil(total / limit);

            // Return all posts for now
            responseReturn(res, 200, {
                posts,
                currentPage: page,
                totalPages,
                hasMore: page < totalPages
            });

        } catch (error) {
            console.error('Get feed posts error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    getUserPosts = async (req, res) => {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'firstName lastName image location')
                .lean();

            const total = await Post.countDocuments({ userId });
            const totalPages = Math.ceil(total / limit);

            responseReturn(res, 200, {
                posts,
                currentPage: page,
                totalPages,
                hasMore: page < totalPages
            });

        } catch (error) {
            console.error('Get user posts error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    createPost = async (req, res) => {
        try {
            const { text, mediaUrl, mediaType } = req.body;
            const userId = req.id;

            console.log('Received post data:', { text, mediaUrl, mediaType }); // Debug log

            if (!text || !text.trim()) {
                return responseReturn(res, 400, { error: 'Post text is required' });
            }

            const newPost = await Post.create({
                userId,
                text: text.trim(),
                mediaUrl,
                mediaType,
                likes: [],
                comments: []
            });

            console.log('Created post:', newPost); // Debug log

            const populatedPost = await Post.findById(newPost._id)
                .populate('userId', 'firstName lastName image location')
                .lean();

            responseReturn(res, 201, { post: populatedPost });
        } catch (error) {
            console.error('Create post error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    likePost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.id;

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const isLiked = post.likes.includes(userId);
            if (isLiked) {
                post.likes = post.likes.filter(id => id.toString() !== userId);
            } else {
                post.likes.push(userId);
            }

            await post.save();

            const updatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .lean();

            responseReturn(res, 200, { post: updatedPost });

        } catch (error) {
            console.error('Like post error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    deletePost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.id;

            const post = await Post.findOne({ _id: postId, userId });
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found or unauthorized' });
            }

            await post.deleteOne();  // Changed from remove() to deleteOne()
            responseReturn(res, 200, { message: 'Post deleted successfully' });

        } catch (error) {
            console.error('Delete post error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    getUploadSignature = async (req, res) => {
        try {
            const timestamp = Math.round((new Date).getTime() / 1000);
            const signature = cloudinary.utils.api_sign_request({
                timestamp: timestamp,
                folder: 'posts',
            }, process.env.api_secret);

            responseReturn(res, 200, { signature, timestamp });
        } catch (error) {
            console.error('Signature generation error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    uploadChunk = async (req, res) => {
        try {
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    console.error('Upload error:', err); // Debug log
                    return responseReturn(res, 400, { error: err.message });
                }

                if (!req.file) {
                    return responseReturn(res, 400, { error: 'No file provided' });
                }

                try {
                    console.log('Processing file:', req.file.originalname); // Debug log
                    
                    const b64 = Buffer.from(req.file.buffer).toString('base64');
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    
                    const result = await cloudinary.uploader.upload(dataURI, {
                        resource_type: 'auto',
                        chunk_size: 6000000,
                        allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'jpg', 'jpeg', 'png', 'gif'],
                        folder: 'posts'
                    });

                    console.log('Cloudinary upload result:', result); // Debug log
                    responseReturn(res, 200, result);
                } catch (uploadError) {
                    console.error('Cloudinary upload error:', uploadError);
                    return responseReturn(res, 400, { 
                        error: 'Upload failed: ' + uploadError.message,
                        details: uploadError
                    });
                }
            });
        } catch (error) {
            console.error('Chunk upload error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    completeUpload = async (req, res) => {
        try {
            const { filename, timestamp, signature } = req.body;

            // Verify signature
            const expectedSignature = cloudinary.utils.api_sign_request({
                timestamp,
                folder: 'posts',
            }, process.env.api_secret);

            if (signature !== expectedSignature) {
                return responseReturn(res, 400, { error: 'Invalid signature' });
            }

            // Get the final URL from Cloudinary
            const result = await cloudinary.uploader.explicit(filename, {
                type: 'upload',
                resource_type: 'video'
            });

            responseReturn(res, 200, result);
        } catch (error) {
            console.error('Complete upload error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    addComment = async (req, res) => {
        try {
            const { postId } = req.params;
            const { text } = req.body;
            const userId = req.id;

            console.log('Adding comment:', {
                postId,
                text,
                userId
            });

            if (!text || !text.trim()) {
                return responseReturn(res, 400, { error: 'Comment text is required' });
            }

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const newComment = {
                userId,
                text: text.trim(),
                reactions: [],
                replies: [],
                createdAt: new Date()
            };

            post.comments.push(newComment);
            await post.save();

            // Fetch the updated post with populated user data
            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate({
                    path: 'comments.userId',
                    select: 'firstName lastName image',
                    model: 'customer'  // Specify the model name explicitly
                })
                .populate({
                    path: 'comments.replies.userId',
                    select: 'firstName lastName image',
                    model: 'customer'
                })
                .populate({
                    path: 'comments.reactions.userId',
                    select: 'firstName lastName image',
                    model: 'customer'
                })
                .populate({
                    path: 'comments.replies.reactions.userId',
                    select: 'firstName lastName image',
                    model: 'customer'
                })
                .lean();

            // Verify the populated data
            console.log('Populated comment user data:', 
                populatedPost.comments[populatedPost.comments.length - 1].userId
            );

            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Add comment error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    addReply = async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const { text } = req.body;
            const userId = req.id;

            console.log('Received reply request:', {
                postId,
                commentId,
                text,
                userId
            });

            if (!text || !text.trim()) {
                return responseReturn(res, 400, { error: 'Reply text is required' });
            }

            const post = await Post.findById(postId);
            if (!post) {
                console.log('Post not found:', postId);
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                console.log('Comment not found:', commentId);
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            const reply = {
                userId,
                text: text.trim(),
                reactions: [],
                createdAt: new Date()
            };

            comment.replies.push(reply);
            await post.save();

            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate('comments.userId', 'firstName lastName image')
                .populate('comments.replies.userId', 'firstName lastName image')
                .populate('comments.reactions.userId', 'firstName lastName image')
                .populate('comments.replies.reactions.userId', 'firstName lastName image')
                .lean();

            console.log('Reply added successfully');
            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Add reply error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    addReaction = async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const { type } = req.body;
            const userId = req.id;

            console.log('Received reaction request:', {
                postId,
                commentId,
                type,
                userId
            });

            if (!type || !['like', 'love', 'haha', 'wow', 'sad', 'angry'].includes(type)) {
                return responseReturn(res, 400, { error: 'Invalid reaction type' });
            }

            // Find post and comment in a single query
            const post = await Post.findOne({
                _id: postId,
                'comments._id': commentId
            });

            if (!post) {
                console.log('Post not found:', postId);
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            // Find the comment using array filter
            const comment = post.comments.find(
                comment => comment._id.toString() === commentId
            );

            if (!comment) {
                console.log('Comment not found in post:', {
                    postId,
                    commentId,
                    availableCommentIds: post.comments.map(c => c._id.toString())
                });
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            // Handle existing reaction
            const existingReactionIndex = comment.reactions.findIndex(
                reaction => reaction.userId.toString() === userId
            );

            if (existingReactionIndex > -1) {
                // If same reaction type, remove it (toggle off)
                if (comment.reactions[existingReactionIndex].type === type) {
                    comment.reactions.splice(existingReactionIndex, 1);
                } else {
                    // Update existing reaction type
                    comment.reactions[existingReactionIndex].type = type;
                }
            } else {
                // Add new reaction
                comment.reactions.push({
                    userId,
                    type,
                    createdAt: new Date()
                });
            }

            // Mark the comments array as modified
            post.markModified('comments');
            await post.save();

            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate('comments.userId', 'firstName lastName image')
                .populate('comments.replies.userId', 'firstName lastName image')
                .populate('comments.reactions.userId', 'firstName lastName image')
                .populate('comments.replies.reactions.userId', 'firstName lastName image')
                .lean();

            console.log('Reaction added/updated successfully');
            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Add reaction error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    deleteComment = async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const userId = req.id;

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            // Check if user is authorized to delete the comment
            if (comment.userId.toString() !== userId && post.userId.toString() !== userId) {
                return responseReturn(res, 403, { error: 'Not authorized to delete this comment' });
            }

            comment.remove();
            await post.save();

            responseReturn(res, 200, { message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Delete comment error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    deleteReply = async (req, res) => {
        try {
            const { postId, commentId, replyId } = req.params;
            const userId = req.id;

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            const reply = comment.replies.id(replyId);
            if (!reply) {
                return responseReturn(res, 404, { error: 'Reply not found' });
            }

            // Check if user is authorized to delete the reply
            if (reply.userId.toString() !== userId && post.userId.toString() !== userId) {
                return responseReturn(res, 403, { error: 'Not authorized to delete this reply' });
            }

            reply.remove();
            await post.save();

            responseReturn(res, 200, { message: 'Reply deleted successfully' });
        } catch (error) {
            console.error('Delete reply error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    editComment = async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const { text } = req.body;
            const userId = req.id;

            if (!text || !text.trim()) {
                return responseReturn(res, 400, { error: 'Comment text is required' });
            }

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            // Check if user is authorized to edit the comment
            if (comment.userId.toString() !== userId) {
                return responseReturn(res, 403, { error: 'Not authorized to edit this comment' });
            }

            comment.text = text.trim();
            await post.save();

            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate('comments.userId', 'firstName lastName image')
                .populate('comments.replies.userId', 'firstName lastName image')
                .lean();

            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Edit comment error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    editReply = async (req, res) => {
        try {
            const { postId, commentId, replyId } = req.params;
            const { text } = req.body;
            const userId = req.id;

            if (!text || !text.trim()) {
                return responseReturn(res, 400, { error: 'Reply text is required' });
            }

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            const reply = comment.replies.id(replyId);
            if (!reply) {
                return responseReturn(res, 404, { error: 'Reply not found' });
            }

            // Check if user is authorized to edit the reply
            if (reply.userId.toString() !== userId) {
                return responseReturn(res, 403, { error: 'Not authorized to edit this reply' });
            }

            reply.text = text.trim();
            await post.save();

            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate('comments.userId', 'firstName lastName image')
                .populate('comments.replies.userId', 'firstName lastName image')
                .lean();

            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Edit reply error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    deleteReaction = async (req, res) => {
        try {
            const { postId, commentId, reactionId } = req.params;
            const userId = req.id;

            const post = await Post.findById(postId);
            if (!post) {
                return responseReturn(res, 404, { error: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            const reaction = comment.reactions.id(reactionId);
            if (!reaction) {
                return responseReturn(res, 404, { error: 'Reaction not found' });
            }

            // Check if user is authorized to delete the reaction
            if (reaction.userId.toString() !== userId) {
                return responseReturn(res, 403, { error: 'Not authorized to delete this reaction' });
            }

            reaction.remove();
            await post.save();

            const populatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName image location')
                .populate('comments.userId', 'firstName lastName image')
                .populate('comments.replies.userId', 'firstName lastName image')
                .lean();

            responseReturn(res, 200, { post: populatedPost });
        } catch (error) {
            console.error('Delete reaction error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new PostController(); 