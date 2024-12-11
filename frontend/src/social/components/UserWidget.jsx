import { useState, useEffect } from "react";
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "./UserImage";
import FlexBetween from "./FlexBetween";
import WidgetWrapper from "./WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchUserConnections } from "../../state/social/socialSlice";

const UserWidget = ({ propUserId }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  
  const currentUser = useSelector((state) => state.auth.userInfo);
  const currentProfile = useSelector((state) => state.social.currentProfile);
  const connections = useSelector((state) => state.social.connections);
  const profileLoading = useSelector((state) => state.social.profileLoading);
  
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const userId = propUserId || currentUser?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserConnections(userId));
    }
  }, [userId, dispatch]);

  // Get the correct image data
  const getUserImage = (profile) => {
    console.log("Processing user data for image:", profile);
    if (profile?.profilePicture?.url) return profile.profilePicture;
    if (profile?.image) return profile.image;
    return null;
  };

  const handleEditProfile = () => {
    navigate(`/social/profile/edit/${userId}`);
  };

  if (profileLoading || !currentProfile) {
    return null;
  }

  return (
    <WidgetWrapper>
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <UserImage image={getUserImage(currentProfile)} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate(`/social/profile/${currentProfile._id}`)}
            >
              {`${currentProfile.firstName} ${currentProfile.lastName}`}
            </Typography>
            <Typography color={medium}>
              {connections?.counts?.followers || 0} followers
            </Typography>
          </Box>
        </FlexBetween>
        {userId === currentUser?.id && (
          <IconButton onClick={handleEditProfile}>
            <ManageAccountsOutlined />
          </IconButton>
        )}
      </FlexBetween>

      <Divider />

      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {currentProfile.location || currentProfile.country || "Location not set"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {currentProfile.occupation || "Occupation not set"}
          </Typography>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget; 