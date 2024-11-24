import { useDispatch, useSelector } from 'react-redux';
import { 
    getCampaigns, 
    getCampaign,
    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign 
} from '../store/reducers/campaignReducer';

export const useCampaign = () => {
    const dispatch = useDispatch();
    const { campaigns, campaign, loading, error, success, message } = useSelector(state => state.campaign);

    const fetchCampaigns = (filters) => dispatch(getCampaigns(filters));
    const fetchCampaign = (id) => dispatch(getCampaign(id));
    const createNewCampaign = (formData) => dispatch(createCampaign(formData));
    const updateExistingCampaign = (campaignId, formData) => dispatch(updateCampaign({ campaignId, formData }));
    const updateStatus = (campaignId, status) => dispatch(updateCampaignStatus({ campaignId, status }));
    const removeCampaign = (campaignId) => dispatch(deleteCampaign(campaignId));

    return {
        // State
        campaigns,
        campaign,
        loading,
        error,
        success,
        message,
        // Actions
        fetchCampaigns,
        fetchCampaign,
        createNewCampaign,
        updateExistingCampaign,
        updateStatus,
        removeCampaign
    };
};