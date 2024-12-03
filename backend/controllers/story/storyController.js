const Story = require('../../models/story/Story');
const StoryComment = require('../../models/story/StoryComment');
const { responseReturn } = require('../../utiles/response');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

class StoryController {
    // Create story
    createStory = async (req, res) => {
        const { id } = req;
        const form = new formidable.IncomingForm({
            maxFileSize: 500 * 1024 * 1024, // 500MB
            maxFields: 5,
            keepExtensions: true,
            multiples: false,
        });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                if (err.code === 1009) {
                    return responseReturn(res, 413, { 
                        error: 'File size too large. Maximum size is 500MB' 
                    });
                }
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }

            try {
                console.log('Creating story, seller ID:', id);
                console.log('Story details:', { 
                    title: fields.title, 
                    hasVideo: !!files.video,
                    hasThumbnail: !!files.thumbnail 
                });

                if (!files.video || !files.thumbnail) {
                    return responseReturn(res, 400, { error: 'Video and thumbnail are required' });
                }

                // Configure cloudinary upload with larger size limits
                const videoUploadOptions = {
                    resource_type: 'video',
                    folder: 'stories/videos',
                    chunk_size: 20000000, // 20MB chunks
                    timeout: 600000 // 10 minutes
                };

                const thumbnailUploadOptions = {
                    resource_type: 'image',
                    folder: 'stories/thumbnails',
                    timeout: 60000 // 1 minute
                };

                // Upload video to Cloudinary
                const videoResult = await cloudinary.uploader.upload(
                    files.video.filepath, 
                    videoUploadOptions
                );

                // Upload thumbnail to Cloudinary
                const thumbnailResult = await cloudinary.uploader.upload(
                    files.thumbnail.filepath,
                    thumbnailUploadOptions
                );

                // Create new story
                const newStory = await Story.create({
                    sellerId: id,
                    title: fields.title,
                    description: fields.description || '',
                    videoUrl: videoResult.secure_url,
                    thumbnail: thumbnailResult.secure_url,
                    status: 'active'
                });

                console.log('Story created successfully:', newStory);
                responseReturn(res, 201, {
                    message: 'Story created successfully',
                    story: newStory
                });

            } catch (error) {
                console.error('Story creation error:', error);
                responseReturn(res, 500, { 
                    error: 'Failed to create story. Please try again.' 
                });
            }
        });
    };

    // Get all stories
    getStories = async (req, res) => {
        try {
            console.log('Fetching stories');

            const stories = await Story.find({ status: 'active' })
                .populate('sellerId', 'name shopName image')
                .sort('-createdAt')
                .lean(); // Use lean() for better performance

            // Add isLiked field to each story
            const storiesWithLikeStatus = stories.map(story => ({
                ...story,
                isLiked: story.likes.includes(req.id),
                likeCount: story.likes.length || 0
            }));

            console.log(`Found ${stories.length} stories`);
            
            responseReturn(res, 200, {
                stories: storiesWithLikeStatus,
                message: 'Stories fetched successfully'
            });
        } catch (error) {
            console.error('Get stories error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get single story
    getStory = async (req, res) => {
        console.log('Fetching single story:', req.params.storyId);
        try {
            const story = await Story.findOne({
                _id: req.params.storyId,
                sellerId: req.id
            }).populate('sellerId', 'shopName email avatar');

            console.log('Story fetch result:', story ? 'Found' : 'Not found');
            
            if (!story) {
                return responseReturn(res, 404, { error: 'Story not found' });
            }

            responseReturn(res, 200, { story });
        } catch (error) {
            console.error('Get Story Error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Update story
    updateStory = async (req, res) => {
        try {
            const story = await Story.findOne({ 
                _id: req.params.storyId,
                sellerId: req.id 
            });

            if (!story) {
                return responseReturn(res, 404, { error: 'Story not found or unauthorized' });
            }

            const form = formidable({ multiples: true });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return responseReturn(res, 500, { error: 'Error parsing form data' });
                }

                const { title, description } = fields;
                const updates = { title, description };

                if (files.video) {
                    const videoResult = await cloudinary.uploader.upload(files.video.filepath, {
                        resource_type: 'video',
                        folder: 'stories/videos'
                    });
                    updates.videoUrl = videoResult.secure_url;
                    updates.duration = videoResult.duration;
                }

                if (files.thumbnail) {
                    const thumbnailResult = await cloudinary.uploader.upload(files.thumbnail.filepath, {
                        folder: 'stories/thumbnails'
                    });
                    updates.thumbnail = thumbnailResult.secure_url;
                }

                const updatedStory = await Story.findByIdAndUpdate(
                    req.params.storyId,
                    updates,
                    { new: true }
                );

                responseReturn(res, 200, { story: updatedStory });
            });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Delete story
    deleteStory = async (req, res) => {
        try {
            const story = await Story.findOne({
                _id: req.params.storyId,
                sellerId: req.id
            });

            if (!story) {
                return responseReturn(res, 404, { error: 'Story not found or unauthorized' });
            }

            await story.deleteOne();
            responseReturn(res, 200, { message: 'Story deleted successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Record view
    recordView = async (req, res) => {
        console.log('Recording view for story:', req.params.storyId, 'by user:', req.id);
        try {
            const story = await Story.findById(req.params.storyId);
            
            if (!story) {
                console.log('Story not found for view recording');
                return responseReturn(res, 404, { error: 'Story not found' });
            }

            const alreadyViewed = story.views.includes(req.id);
            console.log('View status:', { alreadyViewed, currentViews: story.views.length });

            if (!alreadyViewed) {
                story.views.push(req.id);
                await story.save();
                console.log('New view recorded. Total views:', story.views.length);
            }

            responseReturn(res, 200, { message: 'View recorded' });
        } catch (error) {
            console.error('Record view error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Toggle like
    toggleLike = async (req, res) => {
        try {
            const storyId = req.params.storyId;
            const userId = req.id;

            console.log('Toggle like request:', { storyId, userId });

            // Find the story and populate likes
            const story = await Story.findById(storyId);
            if (!story) {
                console.log('Story not found:', storyId);
                return responseReturn(res, 404, { error: 'Story not found' });
            }

            // Check if user has already liked
            const likeIndex = story.likes.indexOf(userId);
            const wasLiked = likeIndex !== -1;

            console.log('Current like status:', {
                storyId: story._id,
                userId,
                currentlyLiked: wasLiked,
                currentLikes: story.likes.length
            });

            // Toggle like
            if (wasLiked) {
                story.likes.pull(userId);
            } else {
                story.likes.push(userId);
            }

            // Update like count
            story.likeCount = story.likes.length;

            // Save the story
            await story.save();

            console.log('Like operation completed:', {
                storyId: story._id,
                newLikeCount: story.likes.length,
                action: wasLiked ? 'unliked' : 'liked'
            });

            // Return updated story data
            responseReturn(res, 200, {
                likes: story.likes,
                likeCount: story.likeCount,
                message: wasLiked ? 'Story unliked' : 'Story liked',
                isLiked: !wasLiked
            });

        } catch (error) {
            console.error('Toggle like error:', {
                error: error.message,
                storyId: req.params.storyId,
                userId: req.id
            });
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get comments for a story
    getComments = async (req, res) => {
        try {
            console.log('Fetching comments for story:', req.params.storyId);
            
            const comments = await StoryComment.find({ storyId: req.params.storyId })
                .populate('user', 'firstName lastName image')
                .sort({ createdAt: -1 });

            // Transform comments to include user info
            const transformedComments = comments.map(comment => ({
                ...comment.toObject(),
                user: comment.userInfo || comment.user // Fallback to stored userInfo if user is not populated
            }));

            console.log('Found comments:', transformedComments);
            responseReturn(res, 200, transformedComments);
        } catch (error) {
            console.error('Get comments error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Add a comment to a story
    addComment = async (req, res) => {
        try {
            const { content, userInfo } = req.body;
            console.log('Adding comment:', {
                storyId: req.params.storyId,
                userId: req.id,
                content,
                userInfo
            });

            // First check if story exists
            const story = await Story.findById(req.params.storyId);
            if (!story) {
                return responseReturn(res, 404, { error: 'Story not found' });
            }

            // Create new comment with user info
            const newComment = new StoryComment({
                storyId: req.params.storyId,
                user: req.id,
                content,
                userInfo: {
                    _id: req.id,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    image: userInfo.image
                }
            });

            await newComment.save();

            // Increment comment count in Story
            await Story.findByIdAndUpdate(req.params.storyId, {
                $inc: { commentCount: 1 }
            });

            // Return the comment with user info
            const commentToReturn = {
                ...newComment.toObject(),
                user: userInfo
            };

            console.log('Comment added successfully:', commentToReturn);
            responseReturn(res, 200, commentToReturn);
        } catch (error) {
            console.error('Add comment error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Delete comment
    deleteComment = async (req, res) => {
        try {
            const comment = await StoryComment.findById(req.params.commentId);
            
            if (!comment) {
                return responseReturn(res, 404, { error: 'Comment not found' });
            }

            const story = await Story.findById(req.params.storyId);
            if (comment.userId.toString() !== req.id && story.sellerId.toString() !== req.id) {
                return responseReturn(res, 403, { error: 'Not authorized' });
            }

            await comment.deleteOne();
            responseReturn(res, 200, { message: 'Comment deleted' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new StoryController(); 