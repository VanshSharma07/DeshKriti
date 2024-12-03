import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopics } from '../../store/reducers/communityReducer';
import { getPendingRequests } from '../../store/reducers/communityConnectionReducer';
import { FaPlus, FaSearch, FaMapMarkedAlt, FaList, FaBell, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header2 from '../Header2';
import toast from 'react-hot-toast';
import WorldMap from './map/WorldMap';
import UserDetailsPanel from './map/UserDetailsPanel';
import TopicCard from './TopicCard';
import CreateTopicModal from './CreateTopicModal';
import MapControls from './map/MapControls';
import Footer from '../Footer';
import StateGroupList from './groups/StateGroupList';
import { getStateGroups } from '../../store/reducers/communityReducer';

const CommunityPage = () => {
  const dispatch = useDispatch();
  const { topics, loading } = useSelector(state => state.community);
  const { pendingRequests = [] } = useSelector(state => state.communityConnection || {});
  const { userInfo } = useSelector(state => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeTab, setActiveTab] = useState('topics');

  const popularTags = ['Culture', 'Food', 'Festival', 'Travel', 'Tradition'];

  useEffect(() => {
    if (activeTab === 'topics') {
      dispatch(getTopics({ search: searchTerm, tag: selectedTag }));
    } else if (activeTab === 'groups') {
      dispatch(getStateGroups());
    }
  }, [dispatch, searchTerm, selectedTag, activeTab]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getPendingRequests());
    }
  }, [dispatch, userInfo]);

  const handleCreateTopic = () => {
    if (!userInfo) {
      toast.error('Please login to create a topic');
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      <div className="bg-gradient-to-r from-[#FF9933]/90 via-[#FFFFFF]/40 to-[#138808]/90 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center drop-shadow-lg">
            Connect with Your Indian Community
          </h1>
          <p className="text-lg text-center mb-8 text-gray-700 drop-shadow">
            Share stories, experiences, and stay connected with your roots
          </p>
          
          <div className="max-w-4xl mx-auto flex flex-wrap gap-4 items-center justify-between">
            {/* Search and New Topic - Left Side */}
            {activeTab === 'topics' && (
              <div className="flex-1 flex gap-4 min-w-[300px]">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full px-4 py-3 rounded-lg text-gray-800 bg-white/90 backdrop-blur-sm border border-[#FF9933]/20 focus:outline-none focus:ring-2 focus:ring-[#FF9933] shadow-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute right-3 top-4 text-[#FF9933]" />
                </div>
                <button
                  onClick={handleCreateTopic}
                  className="bg-[#FF9933] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E88822] transition flex items-center gap-2 shadow-md whitespace-nowrap"
                >
                  <FaPlus /> New Topic
                </button>
              </div>
            )}

            {/* Action Buttons - Right Side */}
            <div className="flex gap-4 items-center">
              {userInfo && (
                <>
                  <Link
                    to="/community/connections/requests"
                    className="relative bg-white text-[#FF9933] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2 shadow-md whitespace-nowrap"
                  >
                    <FaBell />
                    {pendingRequests.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingRequests.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/community/connections"
                    className="bg-white text-[#138808] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2 shadow-md whitespace-nowrap"
                  >
                    <FaUsers /> Connections
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'topics' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
            onClick={() => setActiveTab('topics')}
          >
            <FaList className="inline mr-2" />
            Topics
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'groups' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            <FaUsers className="inline mr-2" />
            State Groups
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'map' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
            onClick={() => setActiveTab('map')}
          >
            <FaMapMarkedAlt className="inline mr-2" />
            Map View
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'topics' && (
          <>
            <div className="flex justify-center gap-6 mb-8 flex-wrap">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                  className={`px-4 py-2 rounded-full ${
                    tag === selectedTag
                      ? 'bg-teal-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-teal-50'
                  } border border-teal-200 transition`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : topics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No topics found. Be the first to start a discussion!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                  <TopicCard key={topic._id} topic={topic} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'groups' && (
          <StateGroupList />
        )}

        {activeTab === 'map' && (
          <div className="relative h-[600px]">
            <MapControls />
            <WorldMap />
            <UserDetailsPanel />
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTopicModal onClose={() => setShowCreateModal(false)} />
      )}
      <Footer/>
    </div>
  );
};

export default CommunityPage;