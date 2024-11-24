import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getCampaignDonations } from '../../../store/Reducers/campaignReducer';

const CampaignDonations = () => {
    const dispatch = useDispatch();
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const { campaigns, donations, loading } = useSelector(state => state.campaign);

    useEffect(() => {
        if (selectedCampaign) {
            dispatch(getCampaignDonations(selectedCampaign));
        }
    }, [dispatch, selectedCampaign]);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-white">Campaign Donations</h2>
                    <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="p-2 bg-gray-700 text-white rounded"
                    >
                        <option value="">Select Campaign</option>
                        {campaigns?.map(campaign => (
                            <option key={campaign._id} value={campaign._id}>
                                {campaign.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-white">
                        <thead className="bg-gray-800 text-left">
                            <tr>
                                <th className="p-3">Donor</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations?.map(donation => (
                                <tr key={donation._id} className="border-b border-gray-700">
                                    <td className="p-3">
                                        {donation.isAnonymous ? 'Anonymous' : donation.userId.name}
                                    </td>
                                    <td className="p-3">₹{donation.amount}</td>
                                    <td className="p-3">
                                        {moment(donation.date).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded bg-green-500 text-white">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {loading && (
                        <div className="text-center py-4">
                            <span className="text-white">Loading...</span>
                        </div>
                    )}

                    {!loading && (!donations || donations.length === 0) && (
                        <div className="text-center py-4">
                            <span className="text-white">No donations found</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDonations;