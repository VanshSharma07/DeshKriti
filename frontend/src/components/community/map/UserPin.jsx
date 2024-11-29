import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../../../store/reducers/communityMapReducer';

const UserPin = ({ user, isCurrentUser }) => {
  const dispatch = useDispatch();
  const { userId: userDetails, location } = user;

  console.log('UserPin rendering for:', {
    name: `${userDetails.firstName} ${userDetails.lastName}`,
    coordinates: location.coordinates,
    country: location.country
  });

  if (!location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    console.error('Invalid coordinates for user:', userDetails.firstName, location.coordinates);
    return null;
  }

  const [longitude, latitude] = location.coordinates;
  const position = [latitude, longitude];

  // Create marker icon
  const createCustomIcon = (isCurrentUser) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="marker-pin ${isCurrentUser ? 'bg-[#FF9933]' : 'bg-[#138808]'} 
                                w-6 h-6 rounded-full flex items-center justify-center 
                                text-white shadow-lg transform hover:scale-110 transition-transform">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  return (
    <Marker
      position={position}
      icon={createCustomIcon(isCurrentUser)}
      eventHandlers={{
        click: () => dispatch(setSelectedUser(user))
      }}
    >
      <Popup>
        <div className="text-center">
          <img 
            src={userDetails.image || '/images/user.png'} 
            alt={userDetails.firstName}
            className="w-12 h-12 rounded-full mx-auto mb-2"
          />
          <h3 className="font-semibold">
            {`${userDetails.firstName} ${userDetails.lastName}`}
          </h3>
          <p className="text-sm text-gray-600">
            {location.country}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default UserPin;