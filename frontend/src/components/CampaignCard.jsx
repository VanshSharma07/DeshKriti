import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FaRegClock, FaRupeeSign, FaChartLine } from 'react-icons/fa';

const CampaignCard = ({ campaign }) => {
    const [expanded, setExpanded] = useState(false);
    
    const progressPercentage = (campaign.currentAmount / campaign.targetAmount) * 100;

    return (
        <div className="bg-white rounded-lg h-auto w-[300px] shadow-lg overflow-hidden">
            <img 
                src={campaign.images.main} 
                alt={campaign.title} 
                className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-4">{campaign.shortDescription}</p>
                
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                    
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="flex items-center">
                            <FaRupeeSign className="mr-1" />
                            {campaign.currentAmount} raised
                        </span>
                        <span className="text-gray-600">
                            of ₹{campaign.targetAmount} goal
                        </span>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 border-t pt-4">
                        <p className="text-gray-700 mb-4">{campaign.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                                <FaRegClock className="mr-1" />
                                {moment(campaign.endDate).fromNow(true)} left
                            </span>
                            <span className="flex items-center">
                                <FaChartLine className="mr-1" />
                                {campaign.donors?.length || 0} donors
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        {expanded ? 'Show Less' : 'View More'}
                    </button>
                    <Link
                        to={`/campaign/${campaign.slug}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;