import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaUserPlus, FaComments, FaSpinner, FaCheck } from 'react-icons/fa';
import { clearSelectedUser } from '../../../store/reducers/communityMapReducer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendConnectionRequest, checkConnectionStatus } from '../../../store/reducers/communityConnectionReducer';
import MessageButton from '../profile/MessageButton';

const UserDetailsPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser } = useSelector(state => state.communityMap);
  const { userInfo } = useSelector(state => state.auth);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (selectedUser?.userId?._id) {
        try {
          const result = await dispatch(checkConnectionStatus(selectedUser.userId._id)).unwrap();
          setConnectionStatus(result.status);
        } catch (error) {
          console.error('Error checking connection status:', error);
        }
      }
    };
    checkStatus();
  }, [dispatch, selectedUser]);

  if (!selectedUser) return null;

  const { userId: userDetails, location } = selectedUser;
  const isCurrentUser = userDetails._id === userInfo?._id;

  const handleConnect = async (userId) => {
    if (isLoading) return;
    
    console.log('🔵 Attempting to send connection request to:', userId);
    
    try {
        setIsLoading(true);
        const result = await dispatch(sendConnectionRequest({ receiverId: userId })).unwrap();
        console.log('✅ Connection request API response:', result);
        
        if (result.success) {
            toast.success('Connection request sent successfully');
            setConnectionStatus('pending');
            console.log('✅ Connection details:', {
                senderId: result.connection.senderId,
                receiverId: result.connection.receiverId,
                status: result.connection.status
            });
        } else {
            console.error('❌ Failed to send request:', result.message);
            toast.error(result.message || 'Failed to send request');
        }
    } catch (error) {
        console.error('❌ Error sending connection request:', {
            message: error.message,
            error
        });
        toast.error(error.message || 'Failed to send request');
    } finally {
        setIsLoading(false);
    }
  };

  const getConnectButtonText = () => {
    if (isLoading) return 'Loading...';
    switch (connectionStatus) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Connected';
      default:
        return 'Connect';
    }
  };

  const getConnectButtonIcon = () => {
    if (isLoading) return <FaSpinner className="animate-spin" />;
    switch (connectionStatus) {
      case 'pending':
        return <FaSpinner />;
      case 'accepted':
        return <FaCheck />;
      default:
        return <FaUserPlus />;
    }
  };

  const getConnectButtonStyle = () => {
    if (isLoading) return 'bg-gray-400';
    switch (connectionStatus) {
      case 'pending':
        return 'bg-yellow-500 cursor-not-allowed';
      case 'accepted':
        return 'bg-green-500';
      default:
        return 'bg-[#FF9933] hover:bg-[#E88822]';
    }
  };

  return (
    <div className="fixed right-4 top-24 w-80 bg-white rounded-lg shadow-xl p-4 z-[1000]">
      <button
        onClick={() => dispatch(clearSelectedUser())}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        <FaTimes />
      </button>

      <div className="text-center mb-4">
        <img
          src={userDetails.image || '/images/user.png'}
          alt={userDetails.firstName}
          className="w-20 h-20 rounded-full mx-auto mb-2"
        />
        <h3 className="text-xl font-semibold">
          {`${userDetails.firstName} ${userDetails.lastName}`}
        </h3>
        <p className="text-sm text-gray-600">
          {location.country}
        </p>
      </div>

      {!isCurrentUser && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleConnect(userDetails._id)}
            disabled={isLoading || connectionStatus === 'pending' || connectionStatus === 'accepted'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${getConnectButtonStyle()} text-white`}
          >
            {getConnectButtonIcon()} {getConnectButtonText()}
          </button>
          {/* Only show MessageButton if users are connected */}
          {connectionStatus === 'accepted' && <MessageButton userId={userDetails._id} />}
        </div>
      )}
    </div>
  );
};

export default UserDetailsPanel;