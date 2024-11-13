// VideoContainer.jsx
import React from 'react';

const VideoContainer = ({ children }) => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/v1.mp4"
        autoPlay
        loop
        muted
      />
      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        {children}
      </div>
    </div>
  );
};

export default VideoContainer;
