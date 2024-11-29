import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingRequests, handleConnectionRequest } from '../../../store/reducers/communityConnectionReducer';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ConnectionRequests = () => {
    const dispatch = useDispatch();
    const { pendingRequests, loading, error } = useSelector(state => state.communityConnection);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const result = await dispatch(getPendingRequests()).unwrap();
                console.log('API Response:', result);
                if (!result.success) {
                    toast.error(result.message || 'Failed to fetch requests');
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
                toast.error(error.message || 'Failed to fetch requests');
            }
        };
        fetchRequests();
    }, [dispatch]);

    const handleRequest = async (connectionId, status) => {
        try {
            console.log('Handling connection request:', { connectionId, status });
            const result = await dispatch(handleConnectionRequest({ connectionId, status })).unwrap();
            
            if (result.success) {
                toast.success(`Connection request ${status}`);
                // Refresh the pending requests
                dispatch(getPendingRequests());
            } else {
                toast.error(result.message || 'Failed to handle request');
            }
        } catch (error) {
            console.error('Error handling request:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    console.log('Pending Requests Data:', pendingRequests);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Connection Requests</h2>
            {!pendingRequests || pendingRequests.length === 0 ? (
                <p className="text-gray-500">No pending requests</p>
            ) : (
                pendingRequests.map(request => {
                    if (!request?.otherUser) {
                        console.error('Invalid request data:', request);
                        return null;
                    }

                    return (
                        <div key={request._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center gap-3">
                                <img
                                    src={request.otherUser?.image || '/images/user.png'}
                                    alt={request.otherUser?.firstName || 'User'}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="font-medium">
                                        {request.otherUser?.firstName || ''} {request.otherUser?.lastName || ''}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {request.isSender ? 
                                            'Request sent' : 
                                            'Wants to connect with you'}
                                    </p>
                                </div>
                            </div>
                            {!request.isSender && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRequest(request._id, 'accepted')}
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleRequest(request._id, 'rejected')}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ConnectionRequests;