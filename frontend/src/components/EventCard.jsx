import React, { useState } from "react";
import { FaRegClock, FaRegCalendarAlt, FaUsers } from "react-icons/fa";
import api from '../api/api'; // Make sure path is correct
import toast from 'react-hot-toast'; // For notifications

const EventCard = ({ event, onRSVP }) => {
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(event.currentRSVPs || 0);

  // Format date and time functions remain the same
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRSVP = async () => {
    try {
      setIsRSVPing(true);
      const response = await api.post(`/events/${event._id}/rsvp`);
      
      if (response.data.success) {
        setRsvpCount(prev => prev + 1);
        toast.success('Successfully RSVP\'d for the event!');
        if (onRSVP) onRSVP(event._id);
      }
    } catch (error) {
      console.error('RSVP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to RSVP for the event';
      toast.error(errorMessage);
    } finally {
      setIsRSVPing(false);
    }
  };

  const isRSVPFull = rsvpCount >= event.rsvpLimit;

  return (
    <div className="w-[320px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex-none">
      <div className="relative overflow-hidden h-[200px]">
        <a href={event.streamingLink} target="_blank" rel="noopener noreferrer">
          <img
            className="w-full h-full object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
            src={event.thumbnailImage || "fallback-image-url"}
            alt={event.title}
          />
        </a>
        {/* RSVP Counter Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center">
          <FaUsers className="mr-1" />
          <span>{rsvpCount}/{event.rsvpLimit} seats</span>
        </div>
      </div>
      <div className="p-5">
        <a href={event.streamingLink} target="_blank" rel="noopener noreferrer">
          <h5 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {event.title}
          </h5>
        </a>
        <p className="mb-4 text-base text-gray-600 line-clamp-3">
          {event.description}
        </p>
        
        {/* Date and Time Section */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FaRegCalendarAlt className="mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaRegClock className="mr-2" />
            <span>{formatTime(event.time)}</span>
          </div>
        </div>

        {/* Buttons Section - Now Horizontal */}
        <div className="flex gap-2">
          {/* RSVP Button */}
          <button
            onClick={handleRSVP}
            disabled={isRSVPing || isRSVPFull}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
              isRSVPFull 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
            {isRSVPing ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                RSVP'ing...
              </span>
            ) : isRSVPFull ? (
              'Event Full'
            ) : (
              'RSVP Now'
            )}
          </button>

          {/* Join Event Button */}
          <a
            href={event.streamingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Join Event
            <svg
              className="w-4 h-4 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;