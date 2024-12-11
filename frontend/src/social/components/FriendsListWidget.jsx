import { Box, Typography, useTheme } from "@mui/material";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";

const FriendsListWidget = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const { palette } = useTheme();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.auth.userInfo);

  const getFriends = async () => {
    const targetId = userId || currentUser?.id;
    console.log('Getting friends for targetId:', targetId);
    
    if (!targetId) {
      console.log('No targetId available, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get both accepted connections and pending requests
      const [friendsResponse, requestsResponse] = await Promise.all([
        api.get(`/social/friends`),
        api.get('/social/requests/pending')
      ]);

      console.log("Friends response:", friendsResponse.data);
      console.log("Pending requests:", requestsResponse.data);
      
      // Combine friends and pending requests, marking their status
      const friendsList = friendsResponse.data.friends.map(friend => ({
        ...friend,
        connectionStatus: 'accepted'
      }));

      const pendingRequests = requestsResponse.data.pendingRequests.map(request => ({
        ...request.sender,
        connectionStatus: 'pending',
        requestId: request._id
      }));

      setFriends([...friendsList, ...pendingRequests]);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFriends();

    // Listen for friend list updates
    const handleRefresh = () => {
      console.log("Refreshing friends list");
      getFriends();
    };

    window.addEventListener('refreshFriendsList', handleRefresh);
    return () => window.removeEventListener('refreshFriendsList', handleRefresh);
  }, [userId, currentUser]);

  const formatFriendData = (friend) => ({
    ...friend,
    userPicturePath: friend.profilePicture || { url: friend.image }
  });

  if (loading) {
    return (
      <WidgetWrapper>
        <Typography color={palette.neutral.medium}>Loading...</Typography>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List ({friends.length})
      </Typography>
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="1.5rem"
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px"
          },
          "&::-webkit-scrollbar-track": {
            background: palette.background.alt
          },
          "&::-webkit-scrollbar-thumb": {
            background: palette.neutral.medium,
            borderRadius: "4px"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: palette.neutral.mediumMain
          }
        }}
      >
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.location}
              userPicturePath={formatFriendData(friend).userPicturePath}
              connectionStatus={friend.connectionStatus}
              requestId={friend.requestId}
              onStatusChange={getFriends}
            />
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No friends yet. Start connecting!
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendsListWidget; 