import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDonation, getCampaignDonations } from '../store/reducers/campaignReducer';
import { toast } from 'react-hot-toast';

const DonationModal = ({ campaign, onClose }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const { loading, error } = useSelector(state => state.campaign);

    const handleDonate = async (e) => {
        e.preventDefault();
        
        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Please enter a valid donation amount');
            return;
        }

        try {
            await dispatch(addDonation({
                campaignId: campaign._id,
                amount: parsedAmount,
                isAnonymous
            })).unwrap();
            
            // Refresh donations list after successful donation
            await dispatch(getCampaignDonations(campaign._id));
            
            toast.success('Donation successful!');
            onClose();
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : err?.message || 'Donation failed';
            toast.error(errorMessage);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Only allow positive numbers
        if (value === '' || (Number(value) > 0)) {
            setAmount(value);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
                {error && (
                    <div className="text-red-500 mb-4">
                        {typeof error === 'string' ? error : 'An error occurred'}
                    </div>
                )}
                <form onSubmit={handleDonate}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            min="1"
                            step="any"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Enter amount"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-gray-700">Donate anonymously</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Donate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationModal;