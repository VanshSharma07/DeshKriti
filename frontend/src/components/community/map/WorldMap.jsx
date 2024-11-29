import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import UserPin from './UserPin';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLocations } from '../../../store/reducers/communityMapReducer';

const WorldMap = () => {
  const dispatch = useDispatch();
  const { userLocations } = useSelector(state => state.communityMap);
  const { userInfo } = useSelector(state => state.auth);
  const [mapKey, setMapKey] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const result = await dispatch(fetchUserLocations()).unwrap();
        console.log('Loaded locations:', result);
        if (!result || result.length === 0) {
          setError('No locations found');
          return;
        }
        setMapKey(prev => prev + 1);
      } catch (error) {
        console.error('Error loading locations:', error);
        setError(error.message);
      }
    };

    loadLocations();
  }, [dispatch]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <div className="mb-2">
        Found {userLocations?.length || 0} user locations
      </div>
      <MapContainer
        key={mapKey}
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {userLocations && userLocations.map(user => {
          console.log('Rendering pin for:', user.userId.firstName);
          return (
            <UserPin 
              key={user._id}
              user={user}
              isCurrentUser={user.userId._id === userInfo?._id}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;