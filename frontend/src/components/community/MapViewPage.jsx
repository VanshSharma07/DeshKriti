import React from 'react';
import WorldMap from './map/WorldMap';
import MapControls from './map/MapControls';
import UserDetailsPanel from './map/UserDetailsPanel';
import Navbar from '../../social/components/Navbar';
import Footer from '../Footer';

const MapViewPage = () => {
  return (
    <div className="relative h-[600px]">
        <Navbar />
      <MapControls />
      <WorldMap />
      <UserDetailsPanel />
      <Footer />
    </div>
  );
};

export default MapViewPage; 