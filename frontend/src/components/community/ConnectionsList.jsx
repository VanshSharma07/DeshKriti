import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchConnectedUsers } from '../../store/reducers/communityMessageSlice';
import Header2 from '../Header2';

const ConnectionsList = () => {
  const dispatch = useDispatch();
  const { connectedUsers, loading } = useSelector((state) => state.communityMessage);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchConnectedUsers());
    }
  }, [dispatch, userInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header2 />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading connections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Connections</h1>
        
        {connectedUsers.length === 0 ? (
          <div className="text-center text-gray-500">
            You don't have any connections yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {connectedUsers.map((user) => (
              <Link
                key={user._id}
                to={`/community/chat/${user._id}`}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-4"
              >
                <img
                  src={user.image || "/images/user.png"}
                  alt={user.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">Click to start chatting</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ConnectionsList;