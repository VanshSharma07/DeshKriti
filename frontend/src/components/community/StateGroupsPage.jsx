import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, useTheme } from '@mui/material';
import { getStateGroups } from '../../store/reducers/communityReducer';
import StateGroupList from './groups/StateGroupList';
import Navbar from '../../social/components/Navbar';
import Footer from '../Footer';

const StateGroupsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getStateGroups());
  }, [dispatch]);

  return (
    <Box bgcolor={theme.palette.background.default}>
      <Navbar />
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: { xs: '2rem 1rem', md: '2rem 4rem' },
        minHeight: '100vh'
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? 'white' : '#333'
          }}
        >
          State Groups
        </Typography>
        <StateGroupList />
      </Box>
      <Footer />
    </Box>
  );
};

export default StateGroupsPage; 