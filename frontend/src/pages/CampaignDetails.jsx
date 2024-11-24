import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCampaign, getCampaignDonations, clearCampaign } from '../store/reducers/campaignReducer';
import moment from 'moment';
import { FaRegClock, FaRupeeSign, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import DonationModal from '../components/DonationModal';
import { toast } from 'react-hot-toast';
import DonationsList from '../components/DonationsList';
import Header2 from '../components/Header2';

const CampaignDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { campaign, donations, loading, error } = useSelector(state => state.campaign);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [donationsLoading, setDonationsLoading] = useState(false);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        console.log('Current error state:', error);
        console.log('Error type:', typeof error);
        if (error) {
            console.log('Error structure:', JSON.stringify(error, null, 2));
        }
    }, [error]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching campaign data for slug:', slug);
                const result = await dispatch(getCampaign(slug)).unwrap();
                console.log('Campaign fetch result:', result);
                
                if (result && result._id) {
                    setDonationsLoading(true);
                    try {
                        const donationsResult = await dispatch(getCampaignDonations(result._id)).unwrap();
                        console.log('Donations fetch result:', donationsResult);
                    } catch (donationError) {
                        console.log('Donation error type:', typeof donationError);
                        console.log('Donation error structure:', donationError);
                    }
                }
            } catch (error) {
                console.log('Campaign fetch error type:', typeof error);
                console.log('Campaign fetch error structure:', error);
            }
        };

        if (slug) {
            fetchData();
        }

        return () => {
            dispatch(clearCampaign());
        };
    }, [dispatch, slug, navigate]);

    useEffect(() => {
        console.log('Current campaign state:', campaign);
        console.log('Current donations state:', donations);
    }, [campaign, donations]);

    const handleDonateClick = () => {
        if (!userInfo) {
            toast.error('Please login to donate');
            navigate('/login');
            return;
        }
        setShowDonateModal(true);
    };

    // Render donations section
    const renderDonations = () => {
        if (donationsLoading) {
            return (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!donations || donations.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500">
                    No donations yet. Be the first to donate!
                </div>
            );
        }

        return (

            <div className="space-y-4">
                {donations.map((donation, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold">
                                {donation.isAnonymous ? 'Anonymous' : donation.userId?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {moment(donation.date).fromNow()}
                            </p>
                        </div>
                        <p className="font-semibold">₹{donation.amount}</p>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!campaign && !loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">
                        {(() => {
                            if (!error) return 'Campaign not found';
                            if (typeof error === 'string') return error;
                            if (error?.message) return error.message;
                            return 'An error occurred';
                        })()}
                    </h2>
                    <Link 
                        to="/donate-india" 
                        className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
                    >
                        Return to Campaigns
                    </Link>
                </div>
            </div>
        );
    }

    const progressPercentage = (campaign.currentAmount / campaign.targetAmount) * 100;

    return (
        <>
        <Header2 />
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-96">
                        <img 
                            src={campaign.images.main} 
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                            <h1 className="text-3xl font-bold text-white mb-2">{campaign.title}</h1>
                            <p className="text-gray-200">{campaign.shortDescription}</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="flex-1">
                                <div className="mb-6">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>₹{campaign.currentAmount} raised</span>
                                        <span>of ₹{campaign.targetAmount} goal</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded">
                                        <FaRegClock className="mx-auto mb-2 text-blue-500" />
                                        <p className="text-sm text-gray-600">
                                            {moment(campaign.endDate).fromNow(true)} left
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded">
                                        <FaChartLine className="mx-auto mb-2 text-blue-500" />
                                        <p className="text-sm text-gray-600">
                                            {campaign.donors?.length || 0} donors
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded">
                                        <FaMapMarkerAlt className="mx-auto mb-2 text-blue-500" />
                                        <p className="text-sm text-gray-600">
                                            {campaign.beneficiary.location}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDonateClick}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Donate Now
                                </button>
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-4">About the Campaign</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
                            </div>
                        </div>

                        {/* Recent Donations Section */}
                        <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recent Donations</h2>
                {loading ? (
                    <div className="text-center py-4">Loading donations...</div>
                ) : (
                    <DonationsList donations={donations} />
                )}
            </div>
                    </div>
                </div>
            </div>

            {/* Donation Modal */}
            {showDonateModal && (
                <DonationModal
                    campaign={campaign}
                    onClose={() => setShowDonateModal(false)}
                />
            )}
        </div>
        </>
    );
};

export default CampaignDetails;