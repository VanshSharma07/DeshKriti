import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Async Actions
export const getCampaigns = createAsyncThunk(
    'campaign/getCampaigns',
    async (status = '') => {
        const statusQuery = typeof status === 'string' ? status : status?.status || '';
        const { data } = await api.get(`/dashboard/campaigns?status=${statusQuery}`);
        return data;
    }
);

export const getCampaign = createAsyncThunk(
    'campaign/getCampaign',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/campaign/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaign');
        }
    }
);

export const createCampaign = createAsyncThunk(
    'campaign/createCampaign',
    async (campaignData) => {
        const { data } = await api.post('/dashboard/campaign/create', campaignData);
        return data;
    }
);

export const updateCampaign = createAsyncThunk(
    'campaign/updateCampaign',
    async ({ campaignId, formData }) => {
        const { data } = await api.put(`/dashboard/campaign/update/${campaignId}`, formData);
        return data;
    }
);

export const updateCampaignImages = createAsyncThunk(
    'campaign/updateCampaignImages',
    async ({ campaignId, imageForm }) => {
        const { data } = await api.put(`/campaign/update-images/${campaignId}`, imageForm);
        return data;
    }
);

export const updateCampaignStatus = createAsyncThunk(
    'campaign/updateStatus',
    async ({ campaignId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/dashboard/campaign/${campaignId}/status`, { status });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update status';
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    'campaign/deleteCampaign',
    async (campaignId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/dashboard/campaign/${campaignId}`);
            return { campaignId, ...data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete campaign');
        }
    }
);

export const getCampaignDonations = createAsyncThunk(
    'campaign/getCampaignDonations',
    async (campaignId) => {
        const { data } = await api.get(`/campaign/${campaignId}/donations`);
        return data;
    }
);

// Slice
const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaigns: [],
        campaign: null,
        donations: [],
        loading: false,
        error: null,
        success: false,
        message: ''
    },
    reducers: {
        clearMessage: (state) => {
            state.message = '';
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Campaigns
            .addCase(getCampaigns.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCampaigns.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload.campaigns;
            })
            .addCase(getCampaigns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get Single Campaign
            .addCase(getCampaign.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.campaign = action.payload.campaign;
            })
            .addCase(getCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create Campaign
            .addCase(createCampaign.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update Campaign
            .addCase(updateCampaign.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.campaign = action.payload.campaign;
            })
            .addCase(updateCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update Campaign Status
            .addCase(updateCampaignStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCampaignStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = state.campaigns.map(campaign => 
                    campaign._id === action.payload.campaign._id 
                        ? action.payload.campaign 
                        : campaign
                );
                state.message = action.payload.message;
            })
            .addCase(updateCampaignStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Campaign
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                state.campaigns = state.campaigns.filter(
                    campaign => campaign._id !== action.payload.campaignId
                );
                state.message = action.payload.message;
            })

            // Get Campaign Donations
            .addCase(getCampaignDonations.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCampaignDonations.fulfilled, (state, action) => {
                state.loading = false;
                state.donations = action.payload.donations;
            })
            .addCase(getCampaignDonations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearMessage } = campaignSlice.actions;
export default campaignSlice.reducer;