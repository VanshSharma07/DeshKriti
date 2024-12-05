import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import UserWidget from '../components/UserWidget';
import CreatePostWidget from '../components/CreatePostWidget';
import PostsWidget from '../components/PostsWidget';
import FriendsListWidget from '../components/FriendsListWidget';
import SuggestedUsers from '../components/SuggestedUsers';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUsers, FaMapMarkedAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import Header2 from '../../components/Header2';

const SocialHome = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const user = useSelector((state) => state.auth.userInfo);
  const theme = useTheme();

  return (
    <Box>
      <Header2 />
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        backgroundColor={theme.palette.background.default}
        color={theme.palette.text.primary}
      >
        {/* Left Column - Fixed */}
        <Box 
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          position={isNonMobileScreens ? "sticky" : undefined}
          top={isNonMobileScreens ? "2rem" : undefined}
          height={isNonMobileScreens ? "calc(100vh - 4rem)" : undefined}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.75rem",
              p: "1rem",
              mb: "1rem",
            }}
          >
            <UserWidget userId={user?._id} />
          </Box>

          {/* Modern Sidebar Menu */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.75rem",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Link 
              to="/state-groups" 
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  color: theme.palette.text.primary,
                  transition: "all 0.3s ease",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateX(5px)",
                  }
                }}
              >
                <FaUsers size={20} color={theme.palette.primary.main} />
                <Box>
                  <Box sx={{ fontWeight: "500", fontSize: "1rem" }}>
                    Community Groups
                  </Box>
                  <Box sx={{ 
                    fontSize: "0.8rem", 
                    color: theme.palette.text.secondary,
                    mt: "0.2rem"
                  }}>
                    Connect with your community
                  </Box>
                </Box>
              </Box>
            </Link>

            <Link 
              to="/map-view" 
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  color: theme.palette.text.primary,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateX(5px)",
                  }
                }}
              >
                <FaMapMarkedAlt size={20} color={theme.palette.primary.main} />
                <Box>
                  <Box sx={{ fontWeight: "500", fontSize: "1rem" }}>
                    Map View
                  </Box>
                  <Box sx={{ 
                    fontSize: "0.8rem", 
                    color: theme.palette.text.secondary,
                    mt: "0.2rem"
                  }}>
                    Find friends on the map
                  </Box>
                </Box>
              </Box>
            </Link>

            <Link 
              to="/virtualevents" 
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  color: theme.palette.text.primary,
                  transition: "all 0.3s ease",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateX(5px)",
                  }
                }}
              >
                <FaCalendarAlt size={20} color={theme.palette.primary.main} />
                <Box>
                  <Box sx={{ fontWeight: "500", fontSize: "1rem" }}>
                    Virtual Events
                  </Box>
                  <Box sx={{ 
                    fontSize: "0.8rem", 
                    color: theme.palette.text.secondary,
                    mt: "0.2rem"
                  }}>
                    Join online community events
                  </Box>
                </Box>
              </Box>
            </Link>

            <Link 
              to="/news" 
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  color: theme.palette.text.primary,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateX(5px)",
                  }
                }}
              >
                <FaNewspaper size={20} color={theme.palette.primary.main} />
                <Box>
                  <Box sx={{ fontWeight: "500", fontSize: "1rem" }}>
                    News
                  </Box>
                  <Box sx={{ 
                    fontSize: "0.8rem", 
                    color: theme.palette.text.secondary,
                    mt: "0.2rem"
                  }}>
                    Stay updated with latest news
                  </Box>
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>

        {/* Middle Column - Scrollable */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          mb={isNonMobileScreens ? undefined : "2rem"}
          sx={{
            maxHeight: isNonMobileScreens ? "calc(100vh - 4rem)" : undefined,
            overflowY: isNonMobileScreens ? "auto" : undefined,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.background.default,
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.main,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.75rem",
              p: "1.5rem",
              mb: "1rem",
            }}
          >
            <CreatePostWidget />
          </Box>
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.75rem",
              p: "1.5rem",
            }}
          >
            <PostsWidget />
          </Box>
        </Box>

        {/* Right Column - Fixed */}
        {isNonMobileScreens && (
          <Box 
            flexBasis="26%"
            position="sticky"
            top="2rem"
            height="calc(100vh - 4rem)"
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.75rem",
                p: "1.5rem",
                mb: "1rem"
              }}
            >
              <SuggestedUsers />
            </Box>
            <Box
              sx={{
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.75rem",
                p: "1.5rem",
              }}
            >
              <FriendsListWidget userId={user?.id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SocialHome; 