import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterLocations, clearFilters } from '../../../store/reducers/communityMapReducer';

const MapControls = () => {
  const dispatch = useDispatch();
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent);
    dispatch(filterLocations({ continent, country: selectedCountry }));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch(filterLocations({ continent: selectedContinent, country }));
  };

  const handleClearFilters = () => {
    setSelectedContinent('');
    setSelectedCountry('');
    dispatch(clearFilters());
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <select
          value={selectedContinent}
          onChange={(e) => handleContinentChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Continents</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Africa">Africa</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Countries</option>
          {/* Add country options based on selected continent */}
        </select>

        <button
          onClick={handleClearFilters}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default MapControls;