import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Header2 from '../components/Header2';
import api from '../api/api';
import Navbar from '../social/components/Navbar';
import Footer from '../components/Footer';
import { Box, Typography, useTheme } from '@mui/material';

const VirtualEventPage = () => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();

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
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <Header2 title="Virtual Events" />

      <Box className='px-4 lg:px-8 py-8'>
        <Typography variant="h4" className='text-gray-700 font-semibold mb-6'>
          Upcoming Virtual Events
        </Typography>

        <Box className='grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {events.length > 0 ? (
            events.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <Typography 
              variant="body1" 
              className='text-center text-gray-500 mt-4'
            >
              No upcoming events at the moment.
            </Typography>
          )}
        </Box>
      </Box>

      <Footer />
    </div>
  );
};

export default VirtualEventPage;

