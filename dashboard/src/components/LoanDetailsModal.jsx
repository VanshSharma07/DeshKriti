import React from 'react';
import moment from 'moment';
import { MdClose } from 'react-icons/md';

const LoanDetailsModal = ({ loan, onClose }) => {
    if (!loan) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-[#283046] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                <div className='p-4 border-b border-slate-700'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-semibold text-[#d0d2d6]'>Loan Request Details</h2>
                        <button 
                            onClick={onClose}
                            className='text-[#d0d2d6] hover:text-white'
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                </div>

                <div className='p-4'>
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <p className='text-sm text-gray-400'>Seller Name</p>
                            <p className='text-[#d0d2d6]'>{loan.seller?.name}</p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-400'>Amount</p>
                            <p className='text-[#d0d2d6]'>{loan.amount} INR</p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-400'>Status</p>
                            <span className={`py-1 px-3 rounded-md ${
                                loan.status === 'pending' ? 'bg-yellow-500' :
                                loan.status === 'approved' ? 'bg-green-500' :
                                'bg-red-500'
                            } text-white inline-block mt-1`}>
                                {loan.status}
                            </span>
                        </div>
                        <div>
                            <p className='text-sm text-gray-400'>Request Date</p>
                            <p className='text-[#d0d2d6]'>{moment(loan.createdAt).format('LLL')}</p>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <p className='text-sm text-gray-400'>Purpose</p>
                        <p className='text-[#d0d2d6] mt-1'>{loan.purpose}</p>
                    </div>

                    <div className='mb-4'>
                        <p className='text-sm text-gray-400'>Business Plan</p>
                        <p className='text-[#d0d2d6] mt-1 whitespace-pre-wrap'>{loan.businessPlan}</p>
                    </div>

                    <div>
                        <p className='text-sm text-gray-400'>Repayment Period</p>
                        <p className='text-[#d0d2d6]'>{loan.repaymentPeriod} Months</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDetailsModal;