import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_loan_requests, update_loan_status, messageClear } from '../../store/Reducers/loanReducer';
import Search from '../../components/Search';
import toast from 'react-hot-toast';
import moment from 'moment';
import Pagination from '../../components/Pagination';
import LoanDetailsModal from '../../components/LoanDetailsModal';

const LoanRequests = () => {
    const dispatch = useDispatch();
    const { loanRequests, totalRequests, successMessage, errorMessage } = useSelector(state => state.loan);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [showDetails, setShowDetails] = useState(null);

    useEffect(() => {
        dispatch(get_loan_requests({
            parPage,
            searchValue,
            page: currentPage
        }));
    }, [parPage, searchValue, currentPage]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const handleStatusUpdate = async (loanId, status) => {
        await dispatch(update_loan_status({ loanId, status }));
        dispatch(get_loan_requests({
            parPage,
            searchValue,
            page: currentPage
        }));
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'>Loan Requests</h1>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <Search 
                    setParPage={setParPage} 
                    setSearchValue={setSearchValue} 
                    searchValue={searchValue} 
                />
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Seller</th>
                                <th scope='col' className='py-3 px-4'>Amount</th>
                                <th scope='col' className='py-3 px-4'>Purpose</th>
                                <th scope='col' className='py-3 px-4'>Date</th>
                                <th scope='col' className='py-3 px-4'>Status</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanRequests.map((request, index) => (
                                <tr key={request._id}>
                                    <td scope='row' className='py-3 px-4'>{index + 1}</td>
                                    <td scope='row' className='py-3 px-4'>{request.seller?.name}</td>
                                    <td scope='row' className='py-3 px-4'>{request.amount} INR</td>
                                    <td scope='row' className='py-3 px-4'>{request.purpose}</td>
                                    <td scope='row' className='py-3 px-4'>
                                        {moment(request.createdAt).format('LL')}
                                    </td>
                                    <td scope='row' className='py-3 px-4'>
                                        <span className={`py-1 px-3 rounded-md ${
                                            request.status === 'pending' ? 'bg-yellow-500' :
                                            request.status === 'approved' ? 'bg-green-500' :
                                            'bg-red-500'
                                        } text-white`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td scope='row' className='py-3 px-4'>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => setShowDetails(request)}
                                                className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded px-3 py-1'
                                            >
                                                View Details
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request._id, 'approved')}
                                                        className='bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded px-3 py-1'
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                        className='bg-red-500 hover:shadow-red-500/50 hover:shadow-lg text-white rounded px-3 py-1'
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                    currentPage={currentPage}
                    totalItems={totalRequests}
                    parPage={parPage}
                    setCurrentPage={setCurrentPage}
                />
                {showDetails && (
                    <LoanDetailsModal 
                        loan={showDetails} 
                        onClose={() => setShowDetails(null)} 
                    />
                )}
            </div>
        </div>
    );
};

export default LoanRequests;