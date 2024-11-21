import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopics } from '../../store/reducers/communityReducer';
import TopicCard from './TopicCard';
import CreateTopicModal from './CreateTopicModal';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Header2 from '../Header2';
import toast from 'react-hot-toast';

const CommunityPage = () => {
  const dispatch = useDispatch();
  const { topics, loading } = useSelector(state => state.community);
  const { userInfo } = useSelector(state => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const popularTags = ['Culture', 'Food', 'Festival', 'Travel', 'Tradition'];

  useEffect(() => {
    dispatch(getTopics({ search: searchTerm, tag: selectedTag }));
  }, [dispatch, searchTerm, selectedTag]);

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
      <div className="bg-gradient-to-r from-[#FF9933]/90 via-[#FFFFFF]/40 to-[#138808]/90 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center drop-shadow-lg">
            Connect with Your Indian Community
          </h1>
          <p className="text-xl text-center mb-8 text-gray-700 drop-shadow">
            Share stories, experiences, and stay connected with your roots
          </p>
          
          <div className="max-w-2xl mx-auto flex gap-4">
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
              className="bg-[#FF9933] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E88822] transition flex items-center gap-2 shadow-md"
            >
              <FaPlus /> New Topic
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-3 mb-8 flex-wrap">
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
      </div>

      {showCreateModal && (
        <CreateTopicModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default CommunityPage;