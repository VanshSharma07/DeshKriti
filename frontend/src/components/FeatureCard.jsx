import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ title, description, image, route }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(route);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
      <img
        className="object-cover w-full h-20 rounded-t-lg"
        src={image}
        alt={title}
      />
      <div className="p-3 leading-tight text-center">
        <h5 className="mb-1 text-base font-semibold text-gray-900">
          {title}
        </h5>
        <p className="mb-2 text-sm font-normal text-gray-700">
          {description}
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
