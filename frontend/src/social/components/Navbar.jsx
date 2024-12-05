import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Search,
  Message,
  Help,
  Menu as MenuIcon,
  Close,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import ChatPanel from './chat/ChatPanel';
import { useChat } from '../context/ChatContext';
import { toggleTheme } from '../../store/slices/themeSlice';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userInfo);
  const mode = useSelector((state) => state.theme?.mode) || 'light';
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const { unreadCount } = useChat();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/social")}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            DeshKriti Social
          </Typography>
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search..." />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={handleThemeToggle}>
              {mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Badge badgeContent={unreadCount} color="error">
              <Message 
                sx={{ fontSize: "25px", cursor: "pointer" }} 
                onClick={toggleChat}
              />
            </Badge>
            <NotificationsDropdown />
            <FormControl variant="standard">
              <Select
                value={user?.firstName || ''}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={user?.firstName || ''}>
                  <Typography>{user?.firstName || 'Guest'}</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <MenuIcon />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* Rest of your mobile nav code... */}
          </Box>
        )}
      </FlexBetween>

      {/* Chat Panel - Rendered outside of FlexBetween */}
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
};

export default Navbar; 