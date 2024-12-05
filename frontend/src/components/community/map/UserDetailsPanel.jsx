import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaUserPlus, FaComments, FaCheck } from 'react-icons/fa';
import { clearSelectedUser } from '../../../store/reducers/communityMapReducer';
import toast from 'react-hot-toast';
import { Box, IconButton, Typography } from '@mui/material';
import { followUser, checkConnectionStatus } from '../../../state/social/socialSlice';
import ChatPanel from '../../../social/components/chat/ChatPanel';

const UserDetailsPanel = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.communityMap);
  const { userInfo } = useSelector(state => state.auth);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (selectedUser?.userId?._id) {
        try {
          setIsLoading(true);
          const status = await dispatch(checkConnectionStatus(selectedUser.userId._id)).unwrap();
          console.log("Connection status:", status);
          setConnectionStatus(status);
        } catch (error) {
          console.error('Error checking connection status:', error);
          setConnectionStatus('following');
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkStatus();
  }, [dispatch, selectedUser]);

  if (!selectedUser) return null;

  const { userId: userDetails, location } = selectedUser;
  const isCurrentUser = userDetails._id === userInfo?._id;

  const handleFollow = async () => {
    if (isLoading || connectionStatus === 'following') return;
    
    try {
      setIsLoading(true);
      await dispatch(followUser(userDetails._id)).unwrap();
      setConnectionStatus('following');
      toast.success('Successfully followed user');
    } catch (error) {
      setConnectionStatus('following');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const isFollowDisabled = isLoading || connectionStatus === 'following';

  return (
    <>
      <div className="fixed right-4 top-24 w-80 bg-white rounded-lg shadow-xl p-4 z-[1000]">
        <IconButton
          onClick={() => dispatch(clearSelectedUser())}
          className="absolute right-2 top-2"
          size="small"
        >
          <FaTimes />
        </IconButton>

        <Box className="text-center mb-4">
          <img
            src={userDetails.image || '/images/user.png'}
            alt={userDetails.firstName}
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <Typography variant="h6">
            {`${userDetails.firstName} ${userDetails.lastName}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {location.country}
          </Typography>
        </Box>

        {!isCurrentUser && (
          <Box className="flex gap-4 justify-center mt-3">
            {connectionStatus !== 'following' ? (
              <IconButton
                onClick={handleFollow}
                disabled={isFollowDisabled}
                sx={{
                  backgroundColor: '#FF9933',
                  padding: '12px',
                  '&:hover': {
                    backgroundColor: isFollowDisabled ? '#FF9933' : '#E88822',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#ccc',
                    opacity: 0.7,
                  }
                }}
              >
                <FaUserPlus style={{ color: 'white', fontSize: '1.2rem' }} />
              </IconButton>
            ) : (
              <IconButton
                disabled={true}
                sx={{
                  backgroundColor: '#4CAF50',
                  padding: '12px',
                  opacity: 0.9,
                  '&.Mui-disabled': {
                    backgroundColor: '#4CAF50',
                    cursor: 'not-allowed'
                  }
                }}
              >
                <FaCheck style={{ color: 'white', fontSize: '1.2rem' }} />
              </IconButton>
            )}
            
            <IconButton
              onClick={handleMessage}
              sx={{
                backgroundColor: '#138808',
                padding: '12px',
                '&:hover': {
                  backgroundColor: '#0F7007',
                }
              }}
            >
              <FaComments style={{ color: 'white', fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        )}
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={handleCloseChat}
      />
    </>
  );
};

export default UserDetailsPanel;