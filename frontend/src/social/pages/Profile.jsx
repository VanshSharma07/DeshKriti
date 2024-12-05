import { Box, useMediaQuery, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import FriendsListWidget from "../components/FriendsListWidget";
import PostsWidget from "../components/PostsWidget";
import UserWidget from "../components/UserWidget";
import api from "../../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      setLoading(true);
      const targetId = userId || currentUser?.id;
      
      if (!targetId) {
        console.error('No user ID available');
        setUser(null);
        return;
      }

      console.log('Fetching user data for ID:', targetId);
      const response = await api.get(`/social/user/${targetId}`);
      console.log('User data response:', response.data);
      
      if (!response.data.user) {
        console.error('No user data in response');
        setUser(null);
        return;
      }

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  // Show loading state
  if (loading) {
    return (
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Show error state if no user is found
  if (!user) {
    return (
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <Typography variant="h5" color="error">
            {userId ? "User not found" : "Please log in to view profile"}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={user._id} picturePath={user.image} />
          <Box m="2rem 0" />
          <FriendsListWidget userId={user._id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget userId={user._id} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile; 