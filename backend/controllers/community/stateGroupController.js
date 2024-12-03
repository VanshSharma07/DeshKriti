const StateGroup = require('../../models/community/StateGroup');
const StateGroupPost = require('../../models/community/StateGroupPost');
const { responseReturn } = require('../../utiles/response');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

class StateGroupController {
  // Get all state groups
  getAllGroups = async (req, res) => {
    try {
      const userId = req.id;
      console.log('Fetching groups for user:', userId);

      const groups = await StateGroup.find()
        .populate('members.userId', '_id')
        .lean();

      // Add isMember flag
      const groupsWithMemberStatus = groups.map(group => ({
        ...group,
        isMember: group.members.some(member => 
          member.userId._id.toString() === userId.toString()
        )
      }));

      console.log('Groups with member status:', {
        userId,
        totalGroups: groupsWithMemberStatus.length,
        sampleGroup: groupsWithMemberStatus[0]
      });

      responseReturn(res, 200, { groups: groupsWithMemberStatus });
    } catch (error) {
      console.error('Error fetching groups:', error);
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Get group details with posts
  getGroupDetails = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.id;

    try {
      console.log('Fetching group details:', { groupId, userId });

      const group = await StateGroup.findById(groupId)
        .populate({
          path: 'posts',
          populate: [
            {
              path: 'userId',
              select: 'firstName lastName image'
            },
            {
              path: 'comments.userId',
              select: 'firstName lastName image'
            }
          ],
          options: { sort: { createdAt: -1 } }
        })
        .populate('members.userId', 'firstName lastName image')
        .lean();

      if (!group) {
        console.log('Group not found');
        return responseReturn(res, 404, { error: 'Group not found' });
      }

      // Add isMember flag
      if (userId) {
        group.isMember = group.members.some(member => 
          member.userId._id.toString() === userId.toString()
        );
      }

      console.log('Group details found:', {
        groupId: group._id,
        memberCount: group.members.length,
        postCount: group.posts.length,
        isMember: group.isMember
      });

      responseReturn(res, 200, { group });
    } catch (error) {
      console.error('Error in getGroupDetails:', error);
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Join a group
  joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.id;

    try {
      const group = await StateGroup.findById(groupId);
      
      if (!group) {
        return responseReturn(res, 404, { error: 'Group not found' });
      }

      // Check if already a member
      const isMember = group.members.some(member => 
        member.userId.toString() === userId
      );

      if (isMember) {
        return responseReturn(res, 400, { error: 'Already a member' });
      }

      // Add user to group
      group.members.push({
        userId,
        role: 'member',
        joinedAt: new Date()
      });
      group.memberCount = group.members.length;
      await group.save();

      // Return updated group with membership status
      const updatedGroup = await StateGroup.findById(groupId)
        .populate('members.userId', '_id')
        .lean();

      responseReturn(res, 200, { 
        message: 'Successfully joined group',
        group: {
          ...updatedGroup,
          isMember: true
        }
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Leave a group
  leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.id;

    try {
      const group = await StateGroup.findById(groupId);
      
      if (!group) {
        return responseReturn(res, 404, { error: 'Group not found' });
      }

      // Check if user is a member
      const memberIndex = group.members.findIndex(member => 
        member.userId.toString() === userId
      );

      if (memberIndex === -1) {
        return responseReturn(res, 400, { error: 'Not a member of this group' });
      }

      // Remove user from group
      group.members.splice(memberIndex, 1);
      group.memberCount -= 1;
      await group.save();

      responseReturn(res, 200, { 
        message: 'Successfully left group',
        group 
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Create a post in group
  createPost = async (req, res) => {
    const form = formidable({ multiples: true });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return responseReturn(res, 500, { error: 'Error parsing form data' });
      }

      try {
        const { groupId } = req.params;
        const { content } = fields;
        const userId = req.id;

        console.log('Creating post:', { groupId, content, userId });

        // Validate required fields
        if (!content) {
          return responseReturn(res, 400, { error: 'Content is required' });
        }

        // Check if user is member of the group
        const group = await StateGroup.findById(groupId);
        if (!group) {
          return responseReturn(res, 404, { error: 'Group not found' });
        }

        const isMember = group.members.some(member => 
          member.userId.toString() === userId.toString()
        );

        if (!isMember) {
          return responseReturn(res, 403, { error: 'Only members can post' });
        }

        // Upload images if any
        let imageUrls = [];
        if (files.images) {
          const imageArray = Array.isArray(files.images) ? files.images : [files.images];
          for (let image of imageArray) {
            try {
              const result = await cloudinary.uploader.upload(image.filepath, {
                folder: 'state_group_posts'
              });
              imageUrls.push(result.secure_url);
            } catch (uploadError) {
              console.error('Image upload error:', uploadError);
              // Continue with other images if one fails
            }
          }
        }

        // Create post
        const post = await StateGroupPost.create({
          groupId,
          userId,
          content,
          images: imageUrls
        });

        // Add post to group
        await StateGroup.findByIdAndUpdate(groupId, {
          $push: { posts: post._id }
        });

        // Populate user details
        const populatedPost = await StateGroupPost.findById(post._id)
          .populate('userId', 'firstName lastName image')
          .lean();

        console.log('Post created successfully:', populatedPost);

        responseReturn(res, 201, { 
          message: 'Post created successfully',
          post: populatedPost 
        });
      } catch (error) {
        console.error('Post creation error:', error);
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // Delete a post
  deletePost = async (req, res) => {
    const { groupId, postId } = req.params;
    const userId = req.id;

    try {
      const post = await StateGroupPost.findById(postId);
      
      if (!post) {
        return responseReturn(res, 404, { error: 'Post not found' });
      }

      // Check if user is post owner or group admin
      const group = await StateGroup.findById(groupId);
      const isAdmin = group.members.some(member => 
        member.userId.toString() === userId && member.role === 'admin'
      );

      if (post.userId.toString() !== userId && !isAdmin) {
        return responseReturn(res, 403, { error: 'Not authorized' });
      }

      // Delete images from cloudinary
      if (post.images.length > 0) {
        for (let imageUrl of post.images) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`state_group_posts/${publicId}`);
        }
      }

      // Delete post and remove from group
      await post.deleteOne();
      await StateGroup.findByIdAndUpdate(groupId, {
        $pull: { posts: postId }
      });

      responseReturn(res, 200, { message: 'Post deleted successfully' });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Like/Unlike a post
  likePost = async (req, res) => {
    const { groupId, postId } = req.params;
    const userId = req.id;

    try {
      const post = await StateGroupPost.findById(postId);
      
      if (!post) {
        return responseReturn(res, 404, { error: 'Post not found' });
      }

      const likeIndex = post.likes.indexOf(userId);
      
      if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
      } else {
        // Like
        post.likes.push(userId);
      }

      await post.save();

      responseReturn(res, 200, { 
        message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
        likes: post.likes 
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Add a comment to a post
  addComment = async (req, res) => {
    const { groupId, postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.id;

    try {
      console.log('Adding comment:', { groupId, postId, content, userId, parentId }); // Debug log

      // Validate input
      if (!content) {
        return responseReturn(res, 400, { error: 'Comment content is required' });
      }

      // Find the post
      const post = await StateGroupPost.findById(postId);
      if (!post) {
        return responseReturn(res, 404, { error: 'Post not found' });
      }

      // Check if user is member of the group
      const group = await StateGroup.findById(groupId);
      if (!group) {
        return responseReturn(res, 404, { error: 'Group not found' });
      }

      const isMember = group.members.some(member => 
        member.userId.toString() === userId.toString()
      );

      if (!isMember) {
        return responseReturn(res, 403, { error: 'Only members can comment' });
      }

      const newComment = {
        userId,
        content,
        parentId: parentId || null,
        createdAt: new Date()
      };

      // Add comment
      post.comments.push(newComment);
      await post.save();

      // Populate user details for all comments
      const populatedPost = await StateGroupPost.findById(postId)
        .populate('comments.userId', 'firstName lastName image');

      console.log('Comment added successfully'); // Debug log

      responseReturn(res, 200, {
        message: 'Comment added successfully',
        postId,
        comments: populatedPost.comments
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new StateGroupController(); 