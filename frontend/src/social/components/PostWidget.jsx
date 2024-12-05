import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ReplyOutlined,
  ThumbUpAltOutlined,
  InsertEmoticonOutlined,
  FavoriteRounded,
  EmojiEmotionsOutlined,
} from "@mui/icons-material";
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import WidgetWrapper from "./WidgetWrapper";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const REACTIONS = {
  like: { icon: "👍", label: "Like" },
  love: { icon: "❤️", label: "Love" },
  haha: { icon: "😄", label: "Haha" },
  wow: { icon: "😮", label: "Wow" },
  sad: { icon: "😢", label: "Sad" },
  angry: { icon: "😠", label: "Angry" }
};

const Comment = ({ comment, postId, onPostUpdate, currentUser, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const { palette } = useTheme();

  const userReaction = comment.reactions?.find(r => r.userId === currentUser?.id)?.type;
  const reactionCounts = comment.reactions?.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/social/user/${comment.userId}`);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching comment user data:", error);
      }
    };

    if (comment?.userId) {
      fetchUserData();
    }
  }, [comment?.userId]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      console.log('Sending reply:', {
        postId,
        commentId: comment._id,
        text: replyText.trim()
      });
      
      const response = await api.post(`/social/posts/${postId}/comments/${comment._id}/reply`, {
        text: replyText.trim(),
      });
      setReplyText("");
      setIsReplying(false);
      if (onPostUpdate) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      console.log('Sending reaction:', {
        postId,
        commentId: comment._id,
        type
      });
      
      const response = await api.post(`/social/posts/${postId}/comments/${comment._id}/react`, {
        type,
      });
      if (onPostUpdate) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, ml: level * 3 }}>
      <Box display="flex" alignItems="flex-start" gap={1}>
        <UserImage image={userData?.profilePicture} size="32px" />
        <Box 
          sx={{ 
            backgroundColor: palette.neutral.light,
            borderRadius: "1rem",
            padding: "0.75rem 1rem",
            flex: 1,
            position: 'relative',
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            {`${comment.userId.firstName} ${comment.userId.lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {comment.text}
          </Typography>
          
          {/* Reaction counts display */}
          {Object.entries(reactionCounts || {}).length > 0 && (
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -10,
                right: 10,
                backgroundColor: palette.background.alt,
                borderRadius: '1rem',
                padding: '0.2rem 0.5rem',
                display: 'flex',
                gap: '0.3rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {Object.entries(reactionCounts).map(([type, count]) => (
                <Tooltip key={type} title={`${count} ${REACTIONS[type].label}`}>
                  <Typography variant="caption">
                    {REACTIONS[type].icon} {count}
                  </Typography>
                </Tooltip>
              ))}
            </Box>
          )}

          <FlexBetween mt={2}>
            <Box display="flex" gap={2}>
              <Typography 
                variant="caption" 
                sx={{ 
                  cursor: "pointer",
                  color: palette.primary.main,
                  "&:hover": { textDecoration: "underline" }
                }}
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </Typography>
              {comment.replies?.length > 0 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    cursor: "pointer",
                    color: palette.primary.main,
                    "&:hover": { textDecoration: "underline" }
                  }}
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? "Hide replies" : `Show ${comment.replies.length} replies`}
                </Typography>
              )}
              <Typography variant="caption" color={palette.neutral.medium}>
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            
            {/* Reaction button */}
            <Box>
              <IconButton 
                size="small" 
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ 
                  color: userReaction ? palette.primary.main : 'inherit',
                  '&:hover': { color: palette.primary.light }
                }}
              >
                {userReaction ? (
                  <Typography variant="body2">{REACTIONS[userReaction].icon}</Typography>
                ) : (
                  <InsertEmoticonOutlined fontSize="small" />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ display: 'flex', p: 1, gap: 0.5 }}>
                  {Object.entries(REACTIONS).map(([type, { icon, label }]) => (
                    <Tooltip key={type} title={label}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleReaction(type);
                          setAnchorEl(null);
                        }}
                        sx={{
                          '&:hover': { 
                            transform: 'scale(1.2)',
                            transition: 'transform 0.2s'
                          }
                        }}
                      >
                        <Typography>{icon}</Typography>
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Menu>
            </Box>
          </FlexBetween>
        </Box>
      </Box>

      <Collapse in={isReplying}>
        <Box ml={5} mt={1} display="flex" gap={1}>
          <UserImage 
            image={currentUser?.profilePicture} 
            size="32px"
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            InputProps={{
              sx: { borderRadius: '1.5rem' },
              endAdornment: (
                <Button 
                  size="small" 
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  sx={{
                    borderRadius: '1.5rem',
                    textTransform: 'none',
                  }}
                >
                  Reply
                </Button>
              ),
            }}
          />
        </Box>
      </Collapse>

      <Collapse in={showReplies}>
        <Box ml={5} mt={1}>
          {comment.replies?.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              postId={postId}
              onPostUpdate={onPostUpdate}
              currentUser={currentUser}
              level={level + 1}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

const PostWidget = ({ post, onPostUpdate }) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  if (!post || !post.user) {
    return null;
  }

  const {
    _id: postId,
    text,
    mediaUrl,
    mediaType,
    likes = [],
    comments = [],
    user
  } = post;

  const isLiked = likes.find(id => id === currentUser?.id);
  const likeCount = likes?.length || 0;

  const handleLike = async () => {
    try {
      const response = await api.patch(`/social/posts/${postId}/like`);
      if (onPostUpdate) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/social/posts/${postId}/comment`, {
        text: newComment.trim(),
      });
      setNewComment("");
      if (onPostUpdate) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderMedia = () => {
    if (!mediaUrl) return null;

    if (mediaType === 'video') {
      return (
        <Box sx={{ width: '100%', mt: "0.75rem" }}>
          <video
            controls
            width="100%"
            style={{ 
              borderRadius: "0.75rem",
              maxHeight: "600px",
              objectFit: "contain",
              backgroundColor: "black"
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    } else if (mediaType === 'image') {
      return (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ 
            borderRadius: "0.75rem", 
            marginTop: "0.75rem",
            maxHeight: "500px",
            objectFit: "contain"
          }}
          src={mediaUrl}
          onError={(e) => {
            console.error("Error loading image:", mediaUrl);
            e.target.style.display = 'none';
          }}
        />
      );
    }
    return null;
  };

  const userName = post.user ? `${post.user.firstName} ${post.user.lastName}` : "Unknown User";
  const userImage = post.user?.image;

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userImage} size="55px" />
          <Box onClick={() => navigate(`/social/profile/${user.id}`)}>
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {userName}
            </Typography>
            {user.location && (
              <Typography color={main} fontSize="0.75rem">
                {user.location}
              </Typography>
            )}
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Typography color={main} sx={{ mt: "1rem" }}>
        {text}
      </Typography>

      {renderMedia()}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="1rem">
          <Divider />
          <Box mt="1rem" display="flex" gap={1}>
            <UserImage 
              image={currentUser?.image} 
              size="40px"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                ),
              }}
            />
          </Box>
          <Box mt="1rem">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                postId={postId}
                onPostUpdate={onPostUpdate}
                currentUser={currentUser}
              />
            ))}
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget; 