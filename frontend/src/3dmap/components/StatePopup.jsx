import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';

const MemoizedHtml = React.memo(Html);

const StatePopup = ({ stateName, visible, isClicked, data, position }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  if (!visible || !data) return null;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    // Path to the audio file
    const songPath = `/songs/${data.song?.fileName}`;
  
    if (!data.song?.fileName) {
      console.error('Audio file not specified in the data object.');
      return;
    }
  
    try {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio
      } else {
        audioRef.current.src = songPath; // Load the audio file
        audioRef.current
          .play()
          .catch((error) => console.error('Audio play failed:', error));
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  

  const handleExploreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const modelId = data.modelId;
      const stateId = modelId.split('_')[1];
      
      if (!stateId) {
        console.error('No state ID found for:', data.name);
        return;
      }

      // Dispose of Three.js resources before navigation
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }

      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/3dmap/state/${stateId}`);
      }, 100);
      
    } catch (error) {
      console.error('Error in handleExploreClick:', error);
    }
  };

  return (
    <MemoizedHtml
      position={[[-150], [60], 5]}
      transform
      occlude={false}
      scale={8}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(145deg, rgba(34,34,34,0.95) 0%, rgba(51,51,51,0.95) 100%)',
              padding: '25px',
              borderRadius: '20px',
              color: 'white',
              width: '350px',
              textAlign: 'left',
              fontSize: '16px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
              border: '3px solid rgba(255,255,255, 0.1)',
              transform: 'translate(-50%, -50%) perspective(800px) rotateX(10deg)',
              backdropFilter: 'blur(5px)',
              opacity: isClicked ? 1 : 0.9,
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <motion.h3
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              {data.name}
            </motion.h3>
            <div
              style={{
                display: 'grid',
                gap: '14px',
                fontSize: '18px',
              }}
            >
              {/* Products Section */}
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{
                  color: '#f0e68c',
                  fontWeight: '600',
                }}>
                  Traditional Products: 
                </span>
                {data.products || 'Information coming soon'}
              </motion.p>

              {/* Food Section */}
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{
                  color: '#f0e68c',
                  fontWeight: '600',
                }}>
                  Famous Food: 
                </span>
                {data.food || 'Information coming soon'}
              </motion.p>

              {/* Places Section */}
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{
                  color: '#f0e68c',
                  fontWeight: '600',
                }}>
                  Famous Places: 
                </span>
                {data.places || 'Information coming soon'}
              </motion.p>

              {/* Song Section */}
              {data.song && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '10px 0',
                  }}
                >
                  <span style={{
                    color: '#f0e68c',
                    fontWeight: '600',
                  }}>
                    Famous Song:
                  </span>
                  <span>{data.song.name}</span>
                  <button
                    onClick={handlePlayClick}
                    style={{
                      background: 'rgba(240, 230, 140, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#f0e68c',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f0e68c';
                      e.target.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(240, 230, 140, 0.2)';
                      e.target.style.color = '#f0e68c';
                    }}
                  >
                    {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                  </button>
                </motion.div>
              )}

              {/* Explore Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleExploreClick}
                style={{
                  color: '#00ffcc',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  marginTop: '10px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'rgba(0, 255, 204, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0px 4px 8px rgba(0, 255, 204, 0.4)',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#00ffcc';
                  e.target.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 255, 204, 0.2)';
                  e.target.style.color = '#00ffcc';
                }}
              >
                Explore More
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MemoizedHtml>
  );
};

export default React.memo(StatePopup);