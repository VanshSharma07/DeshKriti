import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/virtualevents");
  };

  return (
    <div className="w-full flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
      <img
        className="object-cover w-full h-20 rounded-t-lg"
        src="/images/banner/1.jpg"
        alt="Noteworthy technology acquisitions 2021"
      />
      <div className="p-3 leading-tight text-center">
        <h5 className="mb-1 text-base font-semibold text-gray-900">
          Noteworthy technology acquisitions 2021
        </h5>
        <p className="mb-2 text-sm font-normal text-gray-700">
          Biggest enterprise technology acquisitions of 2021 so far.
        </p>
        <button
          onClick={handleExplore}
          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
