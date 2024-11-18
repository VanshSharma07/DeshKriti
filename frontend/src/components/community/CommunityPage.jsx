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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Connect with Your Indian Community
          </h1>
          <p className="text-xl text-center mb-8">
            Share stories, experiences, and stay connected with your roots
          </p>
          
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-4 text-gray-400" />
            </div>
            <button
              onClick={handleCreateTopic}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
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
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50'
              } border border-purple-200 transition`}
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