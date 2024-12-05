import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const updateUserLocation = createAsyncThunk(
  'communityMap/updateUserLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/community/map/location', locationData);
      return data.location;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to update location'
      );
    }
  }
);

export const fetchUserLocations = createAsyncThunk(
  'communityMap/fetchUserLocations',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching user locations...');
      const { data } = await api.get('/community/map/locations');
      console.log('Response data:', data);
      
      if (!data?.locations) {
        console.error('Invalid response format:', data);
        return rejectWithValue('Invalid response format');
      }

      // Validate locations data
      const validLocations = data.locations.filter(loc => {
        if (!loc.location?.coordinates) {
          console.error('Location missing coordinates:', loc);
          return false;
        }
        if (!loc.userId) {
          console.error('Location missing userId:', loc);
          return false;
        }
        return true;
      });

      console.log('Valid locations:', validLocations.length);
      return validLocations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch locations'
      );
    }
  }
);

export const filterLocations = createAsyncThunk(
  'communityMap/filterLocations',
  async ({ continent, country }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (continent) params.append('continent', continent);
      if (country) params.append('country', country);

      const { data } = await api.get(`/community/map/locations?${params}`);
      return data.locations;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to filter locations');
    }
  }
);

const communityMapSlice = createSlice({
  name: 'communityMap',
  initialState: {
    userLocations: [],
    filteredLocations: [],
    selectedUser: null,
    loading: false,
    error: null,
    updateSuccess: false
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearFilters: (state) => {
      state.filteredLocations = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.userLocations = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredLocations = action.payload;
        state.error = null;
      })
      .addCase(filterLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserLocation.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateUserLocation.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedUser, clearSelectedUser, clearFilters } = communityMapSlice.actions;
export default communityMapSlice.reducer;