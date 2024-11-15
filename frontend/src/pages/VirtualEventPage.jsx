import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Header2 from '../components/Header2';
import api from '../api/api';

const VirtualEventPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Header2 />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Upcoming Virtual Events
          </h1>
          
          {/* Horizontal Scrollable Container */}
          <div className="relative">
            {/* Scroll Container */}
            <div className="flex justify-evenly overflow-x-auto gap-8 pb-8 scrollbar-hide">
              {/* Event Cards */}
              {events.map((event) => (
                <div key={event._id} className="flex-none">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>

          {events.length === 0 && (
            <div className="text-center text-gray-500 mt-8 text-lg">
              No upcoming events at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VirtualEventPage;