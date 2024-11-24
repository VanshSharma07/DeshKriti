import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Public campaign actions
export const getCampaigns = createAsyncThunk(
    'campaign/getCampaigns',
    async (status = '') => {
        try {
            const { data } = await api.get(`/dashboard/campaigns`);
            return data.campaigns || [];
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch campaigns';
        }
    }
);

export const getCampaign = createAsyncThunk(
    'campaign/getCampaign',
    async (identifier) => {
        try {
            const { data } = await api.get(`/dashboard/campaign/${identifier}`);
            if (!data.campaign) {
                throw new Error('Campaign not found');
            }
            return data.campaign;
        } catch (error) {
            if (typeof error === 'string') throw error;
            if (error?.response?.data?.error) throw error.response.data.error;
            if (error?.message) throw error.message;
            throw 'Failed to fetch campaign';
        }
    }
);

export const getCampaignDonations = createAsyncThunk(
    'campaign/getCampaignDonations',
    async (campaignId) => {
        try {
            const { data } = await api.get(`/campaign/${campaignId}/donations`);
            console.log('Fetched donations:', data);
            return data.donations || [];
        } catch (error) {
            console.error('Failed to fetch donations:', error);
            throw error;
        }
    }
);

export const addDonation = createAsyncThunk(
    'campaign/addDonation',
    async ({ campaignId, amount, isAnonymous }) => {
        try {
            // Validate amount before sending
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new Error('Invalid donation amount');
            }

            console.log('Making donation request:', { 
                campaignId, 
                amount: parsedAmount,
                isAnonymous 
            });

            const { data } = await api.post(`/campaign/${campaignId}/donate`, {
                amount: parsedAmount,
                isAnonymous: Boolean(isAnonymous)
            });

            console.log('Donation response:', data);
            return data;
        } catch (error) {
            console.log('Donation error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Donation failed';
            throw new Error(errorMessage);
        }
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
        error: null
    },
    reducers: {
        clearCampaign: (state) => {
            state.campaign = null;
            state.donations = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Campaigns
            .addCase(getCampaigns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCampaigns.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload;
                state.error = null;
            })
            .addCase(getCampaigns.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.error.message === 'string' 
                    ? action.error.message 
                    : 'Failed to fetch campaigns';
            })

            // Get Single Campaign
            .addCase(getCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.campaign = action.payload;
                state.error = null;
            })
            .addCase(getCampaign.rejected, (state, action) => {
                state.loading = false;
                state.campaign = null;
                state.error = typeof action.error === 'string' 
                    ? action.error 
                    : action.error?.message || 'Failed to fetch campaign';
            })

            // Get Campaign Donations
            .addCase(getCampaignDonations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCampaignDonations.fulfilled, (state, action) => {
                state.loading = false;
                state.donations = action.payload;
                state.error = null;
            })
            .addCase(getCampaignDonations.rejected, (state, action) => {
                state.loading = false;
                state.donations = [];
                state.error = typeof action.error === 'string'
                    ? action.error
                    : action.error?.message || 'Failed to fetch donations';
            })

            // Add Donation
            .addCase(addDonation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDonation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addDonation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Donation failed';
            });
    }
});

export const { clearCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;