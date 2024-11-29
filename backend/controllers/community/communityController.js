const Topic = require('../../models/community/Topic');
const Comment = require('../../models/community/Comment');
const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const moment = require('moment');

class CommunityController {
    createTopic = async (req, res) => {
        const form = formidable({ multiples: true });
        
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }
    
            try {
                const { title, content, tags } = fields;
                const { images } = files;
                const { id } = req;

                // Check if user is logged in
                if (!id) {
                    return responseReturn(res, 401, { error: 'Please login to create topics' });
                }
    
                const existingTopic = await Topic.findOne({ title: title.trim() });
                if (existingTopic) {
                    return responseReturn(res, 409, { error: 'A topic with this title already exists' });
                }
    
                let imageUrls = [];
                
                if (images) {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });
    
                    const uploadImage = async (image) => {
                        try {
                            const result = await cloudinary.uploader.upload(image.filepath, {
                                folder: 'community'
                            });
                            return result.url;
                        } catch (error) {
                            console.error('Image upload error:', error);
                            throw new Error('Image upload failed');
                        }
                    };
    
                    if (Array.isArray(images)) {
                        imageUrls = await Promise.all(images.map(uploadImage));
                    } else if (images.filepath) {
                        const url = await uploadImage(images);
                        imageUrls.push(url);
                    }
                }
    
                const topic = await Topic.create({
                    userId: id,
                    title: title.trim(),
                    content: content.trim(),
                    tags: tags ? JSON.parse(tags) : [],
                    images: imageUrls
                });
    
                await topic.populate({
                    path: 'userId',
                    select: 'firstName lastName image'
                });
    
                responseReturn(res, 201, { message: 'Topic created successfully', topic });
            } catch (error) {
                console.error('Error in createTopic:', error);
                responseReturn(res, 500, { error: error.message });
            }
        });
    }

    getTopics = async (req, res) => {
        let { page = 1, limit = 10, tag, search } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        try {
            let query = { status: 'active' };

            if (tag) {
                query.tags = tag;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } }
                ];
            }

            const topics = await Topic.find(query)
                .populate({
                    path: 'userId',
                    select: 'name image'
                })
                .populate('commentCount')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Topic.countDocuments(query);

            responseReturn(res, 200, {
                topics,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            });
        } catch (error) {
            console.error('Error in getTopics:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    getTopic = async (req, res) => {
        const { topicId } = req.params;

        try {
            const topic = await Topic.findById(topicId)
                .populate('userId', 'firstName lastName image')
                .populate({
                    path: 'comments',
                    match: { parentId: null },
                    populate: [{
                        path: 'userId',
                        select: 'firstName lastName image'
                    }, {
                        path: 'replies',
                        populate: {
                            path: 'userId',
                            select: 'firstName lastName image'
                        }
                    }]
                });

            if (!topic) {
                return responseReturn(res, 404, { error: 'Topic not found' });
            }

            // Increment view count
            topic.views += 1;
            await topic.save();

            responseReturn(res, 200, { topic });
        } catch (error) {
            console.error('Error in getTopic:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }
    
    toggleLike = async (req, res) => {
        const { topicId } = req.params;
        const { id } = req;

        try {
            const topic = await Topic.findById(topicId);
            if (!topic) {
                return responseReturn(res, 404, { error: 'Topic not found' });
            }

            const likeIndex = topic.likes.findIndex(
                like => like.userId.toString() === id
            );

            if (likeIndex > -1) {
                topic.likes.splice(likeIndex, 1);
            } else {
                topic.likes.push({ userId: id });
            }

            await topic.save();
            responseReturn(res, 200, { likes: topic.likes });
        } catch (error) {
            console.error('Error in toggleLike:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    addComment = async (req, res) => {
        const { topicId } = req.params;
        const { content, parentId } = req.body;
        const { id } = req;

        try {
            // Check if user is logged in
            if (!id) {
                return responseReturn(res, 401, { error: 'Please login to comment' });
            }

            const topic = await Topic.findById(topicId);
            if (!topic) {
                return responseReturn(res, 404, { error: 'Topic not found' });
            }

            if (parentId) {
                const parentComment = await Comment.findById(parentId);
                if (!parentComment) {
                    return responseReturn(res, 404, { error: 'Parent comment not found' });
                }
                if (parentComment.topicId.toString() !== topicId) {
                    return responseReturn(res, 400, { error: 'Invalid parent comment' });
                }
            }

            const commentData = {
                topicId,
                userId: id,
                content: content.trim(),
                parentId: parentId || null
            };

            const comment = await Comment.create(commentData);

            // Get updated comments with proper population
            const updatedComments = await Comment.find({ 
                topicId,
                parentId: null
            })
            .populate('userId', 'firstName lastName image')
            .populate({
                path: 'replies',
                populate: [{
                    path: 'userId',
                    select: 'firstName lastName image'
                }, {
                    path: 'likes'
                }]
            })
            .sort({ createdAt: -1 });

            return responseReturn(res, 201, {
                success: true,
                message: 'Comment added successfully',
                comments: updatedComments
            });
        } catch (error) {
            console.error('Error in addComment:', error);
            return responseReturn(res, 500, { 
                success: false,
                error: 'Failed to add comment'
            });
        }
    }

    toggleCommentLike = async (req, res) => {
        const { topicId, commentId } = req.params;
        const { id } = req;

        try {
            // Check if user is logged in
            if (!id) {
                return responseReturn(res, 401, { error: 'Please login to like comments' });
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            if (comment.topicId.toString() !== topicId) {
                return responseReturn(res, 400, { error: 'Invalid topic ID' });
            }

            const likeIndex = comment.likes.findIndex(
                like => like.userId.toString() === id
            );

            if (likeIndex > -1) {
                comment.likes.splice(likeIndex, 1);
            } else {
                comment.likes.push({ userId: id });
            }

            await comment.save();

            // Get updated comments
            const updatedComments = await Comment.find({ 
                topicId,
                parentId: null 
            })
            .populate('userId', 'firstName lastName image')
            .populate({
                path: 'replies',
                populate: [{
                    path: 'userId',
                    select: 'firstName lastName image'
                }, {
                    path: 'likes'
                }]
            })
            .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                success: true,
                message: likeIndex > -1 ? 'Comment unliked' : 'Comment liked',
                comments: updatedComments
            });
        } catch (error) {
            console.error('Error in toggleCommentLike:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new CommunityController();