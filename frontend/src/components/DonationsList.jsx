import React from 'react';
import { formatDistance } from 'date-fns';

const DonationsList = ({ donations }) => {
    if (!donations || donations.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No donations yet. Be the first to donate!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {donations.map((donation) => (
                <div 
                    key={donation.id} 
                    className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">
                            {donation.isAnonymous ? 'Anonymous Donor' : donation.donor?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatDistance(new Date(donation.date), new Date(), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DonationsList;