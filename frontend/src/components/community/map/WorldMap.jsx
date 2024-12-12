import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import UserPin from './UserPin';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLocations } from '../../../store/reducers/communityMapReducer';

// Fix Leaflet icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const WorldMap = ({ setIsLoading }) => {
    const dispatch = useDispatch();
    const { userLocations, filteredLocations, loading, error } = useSelector(state => state.communityMap);
    const { userInfo } = useSelector(state => state.auth);
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                setIsLoading(true);
                console.log('Loading locations...');
                const result = await dispatch(fetchUserLocations()).unwrap();
                console.log('Loaded locations:', result);
                setMapKey(prev => prev + 1);
            } catch (error) {
                console.error('Error loading locations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLocations();
    }, [dispatch, setIsLoading]);

    useEffect(() => {
        if (filteredLocations?.length > 0) {
            console.log('Display locations:', filteredLocations);
            filteredLocations.forEach(location => {
                console.log('Location data:', {
                    user: location.userId?.firstName,
                    coordinates: location.location?.coordinates,
                    country: location.location?.country
                });
            });
        } else {
            console.log('No locations to display');
        }
    }, [filteredLocations]);

    // Use filtered locations if available, otherwise use all locations
    const displayLocations = filteredLocations.length > 0 ? filteredLocations : userLocations;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
            <div className="mb-2 p-2 bg-white">
                Found {displayLocations?.length || 0} user locations
            </div>
            <MapContainer
                key={mapKey}
                center={[20, 0]}
                zoom={2}
                className="h-full w-full"
                minZoom={2}
                maxZoom={18}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {displayLocations?.map(user => (
                    <UserPin
                        key={user._id}
                        user={user}
                        isCurrentUser={user.userId._id === userInfo?._id}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default WorldMap;