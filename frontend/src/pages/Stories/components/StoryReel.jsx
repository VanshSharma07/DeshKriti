import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaPlay, FaPause } from 'react-icons/fa';
import api from '../../../api/api';
import StoryComments from './StoryComments';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const StoryReel = ({ story, isActive, onNext, onPrevious }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(story.isLiked || false);
  const [showControls, setShowControls] = useState(true);
  const [likeCount, setLikeCount] = useState(story.likeCount || 0);
  const [commentCount, setCommentCount] = useState(story.commentCount || 0);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
        setIsPlaying(false);
        setShowControls(true);
      });
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  }, [isActive]);

  useEffect(() => {
    let timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    setLiked(story.isLiked || false);
    setLikeCount(story.likeCount || 0);
  }, [story]);

  useEffect(() => {
    console.log('Story Data:', {
      storyId: story._id,
      likes: story.likes,
      likeCount: story.likes?.length,
      comments: story.comments?.length
    });
  }, [story]);

  useEffect(() => {
    console.log('User Info:', {
      userId: userInfo?._id,
      token: userInfo?.token ? 'Present' : 'Missing'
    });
  }, [userInfo]);

  const handleVideoPress = (e) => {
    if (!e.target.closest('.interaction-buttons')) {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
      setShowControls(true);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userInfo) {
      toast.error('Please login to like');
      return;
    }

    try {
      const response = await api.post(`/story/like/${story._id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.data) {
        setLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
        
        // Update the story object
        story.likes = response.data.likes;
        story.likeCount = response.data.likeCount;
        story.isLiked = response.data.isLiked;
      }

    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like story');
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(true);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    console.log('Story data:', story);
    console.log('Seller info:', story.sellerId);
  }, [story]);

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
    // Update the story in parent component if needed
    if (story) {
      story.commentCount = (story.commentCount || 0) + 1;
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={story.videoUrl}
          className="absolute inset-0 w-full h-full object-contain"
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

        <div className="interaction-buttons absolute bottom-24 right-6 flex flex-col space-y-6 z-50">
          <div className="relative z-50 pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex flex-col items-center group cursor-pointer relative z-50"
            >
              <div className="bg-black/20 rounded-full p-2 backdrop-blur-sm group-hover:bg-black/40 transition-all">
                <FaHeart 
                  className={`text-2xl ${liked ? 'text-red-500' : 'text-white'} transition-colors duration-200`} 
                />
              </div>
              <span className="text-white text-xs mt-1">{likeCount}</span>
            </motion.button>
          </div>

          <div className="relative z-50 pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCommentClick}
              className="flex flex-col items-center group cursor-pointer relative z-50"
            >
              <div className="bg-black/20 rounded-full p-2 backdrop-blur-sm group-hover:bg-black/40 transition-all">
                <FaComment className="text-white text-2xl" />
              </div>
              <span className="text-white text-xs mt-1">{commentCount}</span>
            </motion.button>
          </div>

          <button
            onClick={(e) => {
              console.log('Share button clicked');
              e.stopPropagation();
            }}
            className="flex flex-col items-center cursor-pointer z-50"
          >
            <div className="bg-black/20 rounded-full p-2">
              <FaShare className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">Share</span>
          </button>
        </div>

        <div 
          className="absolute inset-0 z-20" 
          onClick={handleVideoPress}
        >
          <div className="absolute inset-0 flex">
            <div 
              className="w-1/3 h-full" 
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
            />
            <div className="w-1/3 h-full" />
            <div 
              className="w-1/3 h-full" 
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
            />
          </div>
        </div>

        <div className="absolute top-5 left-12 right-20 flex items-center space-x-4 z-20">
          <div className="flex items-center space-x-3 max-w-[75%]">
            <img 
              src={story.sellerId?.avatar || '/default-avatar.png'}
              alt={story.sellerId?.shopName || 'Seller'}
              className="w-10 h-10 min-w-[40px] rounded-full border-2 border-white object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-semibold text-base truncate">
                {story.sellerId?.shopName || story.sellerId?.name || 'Unknown Seller'}
              </span>
              <span className="text-white/70 text-sm truncate">
                {new Date(story.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-20 z-20">
          <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent rounded-lg">
            <div className="space-y-2 max-w-[85%]">
              <h3 className="text-white font-semibold text-base line-clamp-1">
                {story.title || 'Untitled Story'}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2 font-light">
                {story.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center z-30 cursor-pointer"
          onClick={handleVideoPress}
        >
          <div className="bg-black/50 rounded-full p-6 backdrop-blur-sm">
            {isPlaying ? (
              <FaPause className="text-white text-5xl" />
            ) : (
              <FaPlay className="text-white text-5xl" />
            )}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-30">
          {videoRef.current && (
            <div 
              className="h-full bg-white transition-all duration-200"
              style={{ 
                width: `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
              }}
            />
          )}
        </div>
      </div>

      {showComments && (
        <StoryComments 
          storyId={story._id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default StoryReel; 