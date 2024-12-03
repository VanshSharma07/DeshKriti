import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStateGroups, joinStateGroup } from '../../../store/reducers/communityReducer';
import { FaUsers, FaArrowRight, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StateGroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stateGroups, loading } = useSelector(state => state.community);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) { // Only fetch if user is logged in
      dispatch(getStateGroups());
    }
  }, [dispatch, userInfo]);

  const handleJoinGroup = async (groupId) => {
    if (!userInfo) {
      toast.error('Please login to join groups');
      return;
    }

    try {
      const result = await dispatch(joinStateGroup(groupId)).unwrap();
      if (result.alreadyMember) {
        navigate(`/community/groups/${groupId}/discussion`);
      } else {
        toast.success('Successfully joined group!');
        // Refresh the groups list
        dispatch(getStateGroups());
      }
    } catch (error) {
      toast.error(error.message || 'Failed to join group');
    }
  };

  if (!userInfo) {
    return (
      <div className="text-center py-8">
        Please login to view and join state groups
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading groups...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stateGroups?.map(group => {
        console.log('Group membership status:', group.stateName, group.isMember); // Debug log
        return (
          <div 
            key={group._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{group.stateName}</h3>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FaUsers className="mr-2" />
                  <span>{group.memberCount || 0} members</span>
                </div>
                <div className="flex space-x-3">
                  {group.isMember ? (
                    <Link
                      to={`/community/groups/${group._id}/discussion`}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2"
                    >
                      <FaCheck className="mr-1" />
                      <span>View Discussion</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StateGroupList;