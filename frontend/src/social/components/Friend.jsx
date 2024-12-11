import { PersonAddOutlined, PersonRemoveOutlined, HourglassEmpty } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import api from "../../api/api";

const Friend = ({ 
  friendId, 
  name, 
  subtitle, 
  userPicturePath, 
  connectionStatus: initialStatus, 
  requestId,
  onStatusChange,
  onClick,
  hideActions = false
}) => {
  console.log("Friend Component - Received Image Data:", {
    type: typeof userPicturePath,
    value: userPicturePath
  });

  const getImageData = (imagePath) => {
    // If it's already a profilePicture object with url
    if (typeof imagePath === 'object' && imagePath?.url) {
      return imagePath;
    }
    
    // If it's a profilePicture nested object
    if (imagePath?.profilePicture?.url) {
      return imagePath.profilePicture;
    }
    
    // If it's a direct string URL
    if (typeof imagePath === 'string') {
      return { url: imagePath };
    }
    
    return null;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [connectionStatus, setConnectionStatus] = useState(initialStatus || 'none');
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  useEffect(() => {
    if (!initialStatus && friendId !== currentUser?.id) {
      const checkStatus = async () => {
        try {
          const response = await api.get(`/social/connection-status/${friendId}`);
          setConnectionStatus(response.data.status);
        } catch (error) {
          console.error("Error checking connection status:", error);
        }
      };
      checkStatus();
    }
  }, [friendId, currentUser?.id, initialStatus]);

  const handleConnect = async () => {
    try {
      const response = await api.post('/social/follow', {
        followingId: friendId
      });
      console.log("Follow response:", response.data);
      setConnectionStatus('pending');
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error connecting:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.delete(`/social/unfollow/${friendId}`);
      console.log("Unfollowed successfully");
      setConnectionStatus('none');
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error unfollowing:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const getActionButton = () => {
    if (connectionStatus === 'none') {
      return (
        <IconButton
          onClick={handleConnect}
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
            "&:hover": { backgroundColor: primaryDark }
          }}
        >
          <PersonAddOutlined sx={{ color: palette.background.alt }} />
        </IconButton>
      );
    } else if (connectionStatus === 'pending') {
      return (
        <IconButton
          disabled
          sx={{
            backgroundColor: palette.neutral.light,
            p: "0.6rem"
          }}
        >
          <HourglassEmpty sx={{ color: palette.neutral.main }} />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          onClick={handleUnfollow}
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
            "&:hover": { backgroundColor: primaryDark }
          }}
        >
          <PersonRemoveOutlined sx={{ color: palette.background.alt }} />
        </IconButton>
      );
    }
  };

  const handleProfileClick = () => {
    navigate(`/social/profile/${friendId}`);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      handleProfileClick();
    }
  };

  return (
    <FlexBetween>
      <FlexBetween 
        gap="1rem" 
        onClick={handleClick} 
        sx={{ 
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          },
          width: '100%'
        }}
      >
        <UserImage 
          image={getImageData(userPicturePath)} 
          size="55px" 
        />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
          {connectionStatus === 'pending' && (
            <Typography
              color="primary"
              fontSize="0.75rem"
              fontStyle="italic"
            >
              Pending Request
            </Typography>
          )}
        </Box>
      </FlexBetween>
      {!hideActions && currentUser?.id !== friendId && getActionButton()}
    </FlexBetween>
  );
};

export default Friend; 