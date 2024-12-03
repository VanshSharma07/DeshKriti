import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/api';
import StoryReel from './components/StoryReel';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header2 from '../../components/Header2';
import Footer from '../../components/Footer';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    fetchStories();
  }, [userInfo]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Fetching stories with token:', userInfo?.token);
      const response = await api.get('/story/get-stories', config);
      console.log('Stories response:', response.data);
      
      if (response.data.stories) {
        setStories(response.data.stories);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching stories:', err.response || err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isTransitioning || currentIndex >= stories.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevious = () => {
    if (isTransitioning || currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={fetchStories}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <p className="text-white text-xl mb-4">No stories available</p>
        <button 
          onClick={fetchStories}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Refresh Stories
        </button>
        <div className="text-gray-400 mt-4 text-sm">
          Last attempted fetch: {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please login to view stories</p>
          <Link to="/login" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Header2/>
      <div className=" top-10 left-10 right-0 z-30 bg-gradient-to-b from-black/70 to-transparent p-4">
        <h1 className="text-white text-xl font-semibold">Seller Stories</h1>
      </div>

      <div className="h-screen w-full max-w-[500px] mx-auto relative overflow-hidden bg-black">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30 bg-black/20 hover:bg-black/40 p-3 rounded-full backdrop-blur-sm transition-all duration-200"
          >
            <FaChevronUp className="text-white text-2xl" />
          </button>
        )}

        {/* Stories Container */}
        <div 
          className="h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(-${currentIndex * 100}%)`
          }}
        >
          {stories.map((story, index) => (
            <div 
              key={`${story._id}-${index}`}
              className="h-full w-full"
            >
              <StoryReel 
                key={`reel-${story._id}-${currentIndex === index}`}
                story={story}
                isActive={index === currentIndex && !isTransitioning}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          ))}
        </div>

        {/* Next Button */}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 z-30 bg-black/20 hover:bg-black/40 p-3 rounded-full backdrop-blur-sm transition-all duration-200"
          >
            <FaChevronDown className="text-white text-2xl" />
          </button>
        )}

        {/* Progress Indicators */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
          {stories.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                idx === currentIndex 
                  ? 'bg-white h-6' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default StoriesPage;