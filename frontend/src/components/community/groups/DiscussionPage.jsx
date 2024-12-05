import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Avatar,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { FaComment, FaPaperPlane, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import Header2 from '../../../components/Header2';
import Navbar from '../../../social/components/Navbar';

const DiscussionPage = () => {
  const { subgroupName } = useParams();
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('/discussions.json');
        const subgroupDiscussions = response.data[subgroupName] || [];
        setDiscussions(subgroupDiscussions);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [subgroupName]);

  const handleCommentSubmit = (discussionId) => {
    if (!newComment.trim()) return;
    
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          comments: [...discussion.comments, { 
            author: 'Current User', 
            content: newComment,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return discussion;
    });
    setDiscussions(updatedDiscussions);
    setNewComment('');
  };

  if (loading) {
    return (
      <>
        <Header2 />
        <Navbar />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 200px)'
        }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header2 />
      <Navbar />
      <Box 
        sx={{ 
          maxWidth: '800px', 
          margin: '2rem auto', 
          padding: '0 2rem',
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 4
          }}
        >
          {subgroupName} Discussions
        </Typography>

        {discussions.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No discussions yet. Be the first to start a conversation!
            </Typography>
          </Card>
        ) : (
          discussions.map(discussion => (
            <Card 
              key={discussion.id} 
              sx={{ 
                mb: 4,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {discussion.image && (
                <CardMedia
                  component="img"
                  height="300"
                  image={discussion.image}
                  alt={discussion.content}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              {discussion.video && (
                <CardMedia
                  component="video"
                  height="300"
                  src={discussion.video}
                  controls
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      mr: 2,
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48
                    }}
                  >
                    {discussion.author.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {discussion.author}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCalendarAlt />
                      {moment(discussion.timestamp).format('MMMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                  {discussion.content}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {discussion.comments.length} Comments
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {discussion.comments.map((comment, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        gap: 2,
                        backgroundColor: theme.palette.action.hover,
                        p: 2,
                        borderRadius: 1
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {comment.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {comment.author}
                        </Typography>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCommentSubmit(discussion.id)}
                    sx={{ 
                      borderRadius: '20px',
                      minWidth: '48px',
                      height: '40px'
                    }}
                  >
                    <FaPaperPlane />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </>
  );
};

export default DiscussionPage; 