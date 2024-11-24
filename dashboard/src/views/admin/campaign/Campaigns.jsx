import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { getCampaigns, deleteCampaign, updateCampaignStatus } from '../../../store/Reducers/campaignReducer';
import { toast } from 'react-hot-toast';

const Campaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector(state => state.campaign);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        await dispatch(getCampaigns(filter !== 'all' ? filter : '')).unwrap();
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };
    fetchCampaigns();
  }, [dispatch, filter]);

  const handleStatusChange = async (campaignId, status) => {
    try {
      const result = await dispatch(updateCampaignStatus({ campaignId, status })).unwrap();
      toast.success(result.message || `Campaign status updated to ${status}`);
      await dispatch(getCampaigns(filter !== 'all' ? filter : '')).unwrap();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
      await dispatch(getCampaigns(filter !== 'all' ? filter : '')).unwrap();
    }
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await dispatch(deleteCampaign(campaignId)).unwrap();
        toast.success('Campaign deleted successfully');
        await dispatch(getCampaigns(filter !== 'all' ? filter : '')).unwrap();
      } catch (error) {
        toast.error(error || 'Failed to delete campaign');
      }
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-white">Campaigns</h2>
              <Link 
                to="/admin/dashboard/campaigns/create" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Campaign
              </Link>
            </div>

            <div className="flex gap-4 mb-5">
              {['all', 'draft', 'active', 'paused', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md ${
                    filter === status ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Raised</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => (
                    <tr key={campaign._id} className="border-b border-gray-600">
                      <td className="p-3">{campaign.title}</td>
                      <td className="p-3">{campaign.category}</td>
                      <td className="p-3">₹{campaign.targetAmount}</td>
                      <td className="p-3">₹{campaign.currentAmount}</td>
                      <td className="p-3">
                        <select
                          value={campaign.status}
                          onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                          className="bg-gray-700 text-white rounded-md p-1"
                        >
                          {['draft', 'active', 'paused', 'completed', 'cancelled'].map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">{moment(campaign.endDate).format('DD/MM/YYYY')}</td>
                      <td className="p-3 flex gap-3">
                        <Link 
                          to={`/admin/dashboard/campaigns/edit/${campaign._id}`}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit size={20} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(campaign._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;