import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import api from '../../api/api';
import FlexBetween from './FlexBetween';

const NotificationsDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { palette } = useTheme();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await api.get('/social/requests/pending');
        setNotifications(response.data.pendingRequests || []);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/social/requests/${requestId}/accept`);
      setNotifications(prev => prev.filter(n => n._id !== requestId));
      window.dispatchEvent(new Event('refreshFriendsList'));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/social/requests/${requestId}/reject`);
      setNotifications(prev => prev.filter(n => n._id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <Notifications />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} width={300}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Divider />
          {notifications.length === 0 ? (
            <Typography color={palette.neutral.medium} align="center" mt={2}>
              No new notifications
            </Typography>
          ) : (
            <List>
              {notifications.map((notification) => (
                <Box key={notification._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={`${notification.sender?.firstName} ${notification.sender?.lastName}`}
                        src={notification.sender?.image || '/default-avatar.png'}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${notification.sender?.firstName} ${notification.sender?.lastName}`}
                      secondary={
                        <FlexBetween>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            sent you a friend request
                          </Typography>
                          <Box>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleAccept(notification._id)}
                              sx={{ mr: 1 }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleReject(notification._id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </FlexBetween>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsDropdown; 