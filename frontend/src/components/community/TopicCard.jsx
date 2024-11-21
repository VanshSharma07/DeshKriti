import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import moment from 'moment';

const TopicCard = ({ topic }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-[#FF9933]/20">
      {topic.images?.length > 0 && (
        <img 
          src={topic.images[0]} 
          alt={topic.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          {topic.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-orange-50 text-[#FF9933] rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link to={`/community/topic/${topic._id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#138808]">
            {topic.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {topic.content}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaRegHeart /> {topic.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaRegComment /> {topic.commentCount || 0}
            </span>
          </div>
          <span>{moment(topic.createdAt).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;