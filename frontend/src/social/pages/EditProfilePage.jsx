import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { updateUserInfo } from '../../redux/reducers/authReducer';

const EditProfilePage = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    country: user?.country || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/social/users/profile/edit', formData);
      if (response.data.user) {
        dispatch(updateUserInfo(response.data.user));
        navigate(`/social/profile/${user.id}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" mb={2}>Edit Profile</Typography>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        disabled
      />
      <TextField
        fullWidth
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProfilePage; 