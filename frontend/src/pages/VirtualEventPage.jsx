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
    <>
      <Header2 />
      <Navbar />
      <Box 
        sx={{
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          py: 8
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              textAlign: 'center', 
              color: theme.palette.text.primary, 
              mb: 6 
            }}
          >
            Upcoming Virtual Events
          </Typography>
          
          {/* Horizontal Scrollable Container */}
          <Box sx={{ position: 'relative' }}>
            {/* Scroll Container */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-evenly', 
                overflowX: 'auto', 
                gap: 4, 
                pb: 4,
                '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar
              }}
            >
              {/* Event Cards */}
              {events.map((event) => (
                <Box key={event._id} sx={{ flex: '0 0 auto' }}>
                  <EventCard event={event} />
                </Box>
              ))}
            </Box>
          </Box>

          {events.length === 0 && (
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                color: theme.palette.text.secondary, 
                mt: 4 
              }}
            >
              No upcoming events at the moment.
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default VirtualEventPage;

