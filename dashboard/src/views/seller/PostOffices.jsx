import React, { useState } from 'react';
import axios from 'axios';
import Map from '../../components/Map';

const PostOffices = () => {
  const [pincode, setPincode] = useState('');
  const [postOffices, setPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  const searchByPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      if (response.data[0].Status === 'Success') {
        setPostOffices(response.data[0].PostOffice);
      } else {
        setError('No post offices found for this pincode');
        setPostOffices([]);
      }
    } catch (err) {
      setError('Error fetching post office data');
      setPostOffices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Locate Post Offices</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter 6-digit Pincode"
            className="p-2 border rounded w-64"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />
          <button
            onClick={searchByPincode}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          <div className="h-[600px]">
            <Map postOffices={postOffices} onLoadingChange={setMapLoading} />
          </div>
          {mapLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-gray-600">Loading locations...</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Post Offices List</h2>
          </div>
          <div className="overflow-y-auto max-h-[552px]">
            {postOffices.map((office, index) => (
              <div 
                key={index} 
                className="p-4 border-b hover:bg-gray-50"
              >
                <h3 className="font-bold text-lg mb-2">{office.Name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-semibold">Branch Type:</span> {office.BranchType}</p>
                  <p><span className="font-semibold">Delivery:</span> {office.DeliveryStatus}</p>
                  <p><span className="font-semibold">District:</span> {office.District}</p>
                  <p><span className="font-semibold">State:</span> {office.State}</p>
                  <p><span className="font-semibold">Division:</span> {office.Division}</p>
                  <p><span className="font-semibold">Pincode:</span> {office.Pincode}</p>
                </div>
              </div>
            ))}
            {postOffices.length === 0 && !loading && !error && (
              <div className="p-4 text-center text-gray-500">
                Enter a pincode to see post offices
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOffices; 