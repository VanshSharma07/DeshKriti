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
            <div className='bg-white p-6 rounded-lg shadow-md'>
                {/* Header Section */}
                <div className='flex flex-wrap justify-between items-center mb-6 gap-4'>
                    <h1 className='text-2xl font-semibold text-gray-700'>Loan Requests</h1>
                    <div className='flex items-center gap-4'>
                        <Search 
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />
                    </div>
                </div>

                {/* Loan Requests List */}
                <div className='overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead>
                            <tr className='bg-gray-50 border-b border-gray-100'>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Seller</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Amount</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Purpose</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanRequests.map((loan) => (
                                <tr key={loan._id} className='border-b border-gray-50 hover:bg-gray-50'>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={loan.seller.image} 
                                                alt={loan.seller.name} 
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                            <div>
                                                <h2 className='text-gray-700 font-medium'>{loan.seller.name}</h2>
                                                <p className='text-sm text-gray-500'>{loan.seller.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 font-medium'>
                                        {loan.amount} INR
                                    </td>
                                    <td className='py-3 px-4 text-gray-600'>
                                        {loan.purpose.substring(0, 30)}...
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            loan.status === 'approved' 
                                                ? 'bg-green-100 text-green-600'
                                                : loan.status === 'rejected'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => setShowDetails(loan)}
                                                className='text-blue-500 hover:text-blue-600'
                                            >
                                                View Details
                                            </button>
                                            {loan.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan._id, 'approved')}
                                                        className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm'
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan._id, 'rejected')}
                                                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
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

                {/* Pagination */}
                <div className='mt-4 flex justify-end'>
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={totalRequests}
                        parPage={parPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
            {showDetails && (
                <LoanDetailsModal 
                    loan={showDetails} 
                    onClose={() => setShowDetails(null)} 
                />
            )}
        </div>
    );
};

export default LoanRequests;