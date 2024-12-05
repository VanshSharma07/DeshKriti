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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchUserConnections } from "../../state/social/socialSlice";

const UserWidget = ({ userId: propUserId }) => {
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
  }, [dispatch, userId]);

  console.log('Current Profile Data:', {
    currentProfile,
    location: currentProfile?.location,
    country: currentProfile?.country
  });

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
          <UserImage image={currentProfile.profilePicture || currentProfile.image} />
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
              {connections.counts.followers} followers
            </Typography>
          </Box>
        </FlexBetween>
        <IconButton onClick={handleEditProfile}>
          <ManageAccountsOutlined />
        </IconButton>
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

      <Divider />

      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Following</Typography>
          <Typography color={main} fontWeight="500">
            {connections.counts.following}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Followers</Typography>
          <Typography color={main} fontWeight="500">
            {connections.counts.followers}
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget; 