import React, { useState, useEffect } from 'react';
import WorldMap from './map/WorldMap';
import MapControls from './map/MapControls';
import UserDetailsPanel from './map/UserDetailsPanel';
import Navbar from '../../social/components/Navbar';
import Footer from '../Footer';
import MapLoader from './map/MapLoader';

const MapViewPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {isLoading && <MapLoader />}
      <Navbar />
      <div className="h-[calc(100vh-64px)]"> {/* Adjust height based on your navbar height */}
        <MapControls />
        <WorldMap setIsLoading={setIsLoading} />
        <UserDetailsPanel />
      </div>
      <Footer />
    </div>
  );
};

export default MapViewPage; 