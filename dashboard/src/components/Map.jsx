import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Map = ({ postOffices, onLoadingChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom Pin Icon
  const customIcon = L.divIcon({
    className: 'custom-pin',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-red-500">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
           </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const getCoordinates = async (office) => {
    try {
      const query = `post office ${office.Name} ${office.District} ${office.State} India ${office.Pincode}`;
      const encodedQuery = encodeURIComponent(query);
      
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`, {
          params: {
            format: 'json',
            q: encodedQuery,
            limit: 1,
            countrycodes: 'in'
          },
          headers: {
            'User-Agent': 'PostOfficeLocator/1.0'
          }
        }
      );

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
      }
      
      // Fallback to district level search
      const districtQuery = `${office.District}, ${office.State}, India`;
      const districtResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`, {
          params: {
            format: 'json',
            q: districtQuery,
            limit: 1,
            countrycodes: 'in'
          },
          headers: {
            'User-Agent': 'PostOfficeLocator/1.0'
          }
        }
      );

      if (districtResponse.data && districtResponse.data.length > 0) {
        return {
          lat: parseFloat(districtResponse.data[0].lat),
          lng: parseFloat(districtResponse.data[0].lon)
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  useEffect(() => {
    // Add CSS for the custom pin and loading animation
    const style = document.createElement('style');
    style.textContent = `
      .custom-pin {
        background: none;
        border: none;
      }
      .custom-pin svg {
        filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.2));
      }
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);

    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const fetchCoordinates = async () => {
      setIsLoading(true);
      if (onLoadingChange) onLoadingChange(true);
      
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      setMarkers([]);

      const newMarkers = [];
      
      for (const office of postOffices) {
        const coords = await getCoordinates(office);
        if (coords) {
          const marker = L.marker([coords.lat, coords.lng], { icon: customIcon })
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold text-lg">${office.Name}</h3>
                <p><span class="font-semibold">Branch Type:</span> ${office.BranchType}</p>
                <p><span class="font-semibold">Pincode:</span> ${office.Pincode}</p>
                <p><span class="font-semibold">District:</span> ${office.District}</p>
                <p><span class="font-semibold">State:</span> ${office.State}</p>
              </div>
            `)
            .addTo(mapInstanceRef.current);
          
          newMarkers.push(marker);
        }
        await new Promise(resolve => setTimeout(resolve, 1100));
      }

      setMarkers(newMarkers);

      if (newMarkers.length > 0) {
        const group = L.featureGroup(newMarkers);
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [50, 50]
        });
      }
      
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    };

    if (postOffices.length > 0) {
      fetchCoordinates();
    }

    return () => {
      markers.forEach(marker => marker.remove());
      document.head.removeChild(style);
    };
  }, [postOffices]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="text-gray-700 font-medium">Locating Post Offices...</div>
        </div>
      )}
    </div>
  );
};

export default Map; 