import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import PostWidget from "./PostWidget";
import { Box, CircularProgress, Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.auth.userInfo);

  const getFeedPosts = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/social/posts?page=${page}`);
      const newPosts = response.data.posts;
      
      const postsWithUserData = await Promise.all(
        newPosts.map(async (post) => {
          try {
            const postUserId = post.userId?._id || post.userId;
            
            if (postUserId === currentUser?.id) {
              return {
                ...post,
                user: {
                  id: currentUser.id,
                  firstName: currentUser.firstName,
                  lastName: currentUser.lastName,
                  image: currentUser.image,
                  location: currentUser.location
                }
              };
            }

            const userResponse = await api.get(`/social/user/${postUserId}`);
            return {
              ...post,
              user: {
                id: postUserId,
                firstName: userResponse.data.user.firstName,
                lastName: userResponse.data.user.lastName,
                image: userResponse.data.user.image,
                location: userResponse.data.user.location
              }
            };
          } catch (error) {
            console.error(`Error fetching user data for post ${post._id}:`, error);
            return {
              ...post,
              user: {
                id: post.userId,
                firstName: 'Unknown',
                lastName: 'User',
                image: null
              }
            };
          }
        })
      );
      
      if (page === 1) {
        setPosts(postsWithUserData);
      } else {
        setPosts((prev) => [...prev, ...postsWithUserData]);
      }
      
      setHasMore(page < response.data.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      setError("Failed to load feed posts");
    } finally {
      setLoading(false);
    }
  };

  const getUserPosts = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const targetUserId = userId?._id || userId || currentUser?.id;
      
      if (!targetUserId) {
        setError("User not found");
        return;
      }

      const response = await api.get(`/social/posts/user/${targetUserId}?page=${page}`);
      const newPosts = response.data.posts;
      
      if (targetUserId === currentUser?.id) {
        const postsWithUser = newPosts.map(post => ({
          ...post,
          user: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            image: currentUser.image,
            location: currentUser.location
          }
        }));
        
        if (page === 1) {
          setPosts(postsWithUser);
        } else {
          setPosts((prev) => [...prev, ...postsWithUser]);
        }
      } else {
        const userResponse = await api.get(`/social/user/${targetUserId}`);
        const userData = userResponse.data.user;
        
        const postsWithUser = newPosts.map(post => ({
          ...post,
          user: {
            id: targetUserId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            location: userData.location
          }
        }));
        
        if (page === 1) {
          setPosts(postsWithUser);
        } else {
          setPosts((prev) => [...prev, ...postsWithUser]);
        }
      }
      
      setHasMore(page < response.data.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError("Failed to load user posts");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getFeedPosts();
    }
  }, [userId, isProfile, page]); // Added page to dependencies

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostWidget
          key={post._id}
          post={post}
          userData={post.user}
          onPostUpdate={(updatedPost) => {
            setPosts(prev => 
              prev.map(p => p._id === updatedPost._id ? {
                ...updatedPost,
                user: p.user
              } : p)
            );
          }}
        />
      ))}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <button onClick={loadMore}>Load More</button>
        </Box>
      )}
      
      {!loading && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography>No posts to show</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostsWidget; 