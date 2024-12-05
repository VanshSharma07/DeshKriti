import { Box, Typography, Button, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper";

const PendingRequestsWidget = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { palette } = useTheme();

  const getPendingRequests = async () => {
    try {
      const response = await api.get("/social/requests/pending");
      setPendingRequests(response.data.pendingRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/social/requests/${requestId}/accept`);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('refreshFriendsList'));
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/social/requests/${requestId}/reject`);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    getPendingRequests();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Pending Friend Requests
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {loading ? (
          <Typography color={palette.neutral.medium}>Loading...</Typography>
        ) : pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <Box key={request._id} display="flex" alignItems="center" gap="1rem">
              <Friend
                friendId={request.followerId._id}
                name={`${request.followerId.firstName} ${request.followerId.lastName}`}
                subtitle={request.followerId.location}
                userPicturePath={request.followerId.image}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleReject(request._id)}
              >
                Reject
              </Button>
            </Box>
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No pending requests
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default PendingRequestsWidget; 