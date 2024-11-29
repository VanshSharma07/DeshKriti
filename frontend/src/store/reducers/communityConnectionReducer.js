import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const sendConnectionRequest = createAsyncThunk(
    'communityConnection/sendRequest',
    async ({ receiverId }, { rejectWithValue }) => {
        try {
            console.log('🔵 Sending API request with receiverId:', receiverId);
            const { data } = await api.post('/community/connection/send-request', { receiverId });
            console.log('✅ API response:', data);
            return data;
        } catch (error) {
            console.error('❌ API error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || { message: 'Network error' });
        }
    }
);

export const getPendingRequests = createAsyncThunk(
    'communityConnection/getPending',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/community/connection/pending-requests');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const handleConnectionRequest = createAsyncThunk(
    'communityConnection/handleRequest',
    async ({ connectionId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/community/connection/handle-request', { 
                connectionId, 
                status 
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const checkConnectionStatus = createAsyncThunk(
    'communityConnection/checkStatus',
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/community/connection/status/${userId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const communityConnectionSlice = createSlice({
    name: 'communityConnection',
    initialState: {
        pendingRequests: [],
        connections: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Send request cases
            .addCase(sendConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Optionally add the new request to pendingRequests
                if (action.payload.connection) {
                    state.pendingRequests.push(action.payload.connection);
                }
            })
            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to send request';
            })
            // Get pending requests cases
            .addCase(getPendingRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingRequests = action.payload.requests || [];
                state.error = null;
            })
            .addCase(getPendingRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
            });
    }
});

export const { clearConnectionStatus } = communityConnectionSlice.actions;
export default communityConnectionSlice.reducer;