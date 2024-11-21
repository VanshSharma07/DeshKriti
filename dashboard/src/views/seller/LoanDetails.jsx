import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_loan_details, messageClear } from '../../store/Reducers/loanReducer';
import moment from 'moment';
import toast from 'react-hot-toast';
import { MdCurrencyExchange } from "react-icons/md";

const LoanDetails = () => {
    const navigate = useNavigate();
    const { loanId } = useParams();
    const dispatch = useDispatch();
    const { loan, successMessage, errorMessage, loader } = useSelector(state => state.loan);

    useEffect(() => {
        dispatch(get_loan_details(loanId));
    }, [loanId]);

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

    const remainingAmount = loan ? loan.repaymentAmount - (loan.repaidAmount || 0) : 0;

    // Add back navigation
    const handleBack = () => {
        navigate(-1);
    };

    if (loader) {
        return (
            <div className='px-2 lg:px-7 pt-5'>
                <div className='w-full p-4 bg-[#6a5fdf] rounded-md flex justify-center items-center min-h-[200px]'>
                    <div className='text-[#d0d2d6]'>Loading...</div>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className='px-2 lg:px-7 pt-5'>
                <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                    <div className='text-[#d0d2d6]'>Loan not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <button
                        onClick={handleBack}
                        className='bg-[#283046] text-[#d0d2d6] px-4 py-2 rounded-md hover:bg-[#3a4052]'
                    >
                        ← Back
                    </button>
                    {loan?.status === 'active' && (
                        <Link
                            to="/seller/dashboard/loan/repayment"
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Make Payment
                        </Link>
                    )}
                </div>
                <div className='w-full flex flex-wrap'>
                    <div className='w-full lg:w-1/2 px-2 mb-4'>
                        <h2 className='text-xl font-semibold text-[#d0d2d6] pb-4'>Loan Overview</h2>
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between items-center p-4 bg-[#283046] rounded-md'>
                                <div className='flex flex-col'>
                                    <span className='text-[#d0d2d6] text-sm'>Total Amount</span>
                                    <span className='text-[#d0d2d6] text-lg font-bold'>{loan?.amount} INR</span>
                                </div>
                                <div className='w-[40px] h-[40px] rounded-full bg-[#0200f8] flex justify-center items-center'>
                                    <MdCurrencyExchange className='text-[#fae8e8] text-xl' />
                                </div>
                            </div>
                            
                            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
                                <div className='flex flex-col'>
                                    <span className='text-slate-600 text-sm'>Remaining Amount</span>
                                    <span className='text-slate-800 text-lg font-bold'>{remainingAmount} INR</span>
                                </div>
                            </div>

                            <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
                                <div className='flex flex-col'>
                                    <span className='text-slate-600 text-sm'>Status</span>
                                    <span className={`py-1 px-3 rounded-md ${
                                        loan.status === 'active' ? 'bg-emerald-500' :
                                        loan.status === 'repaid' ? 'bg-sky-500' :
                                        'bg-rose-500'
                                    } text-white inline-block mt-1`}>
                                        {loan.status}
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-between items-center p-4 bg-[#283046] rounded-md'>
                                <div className='flex flex-col'>
                                    <span className='text-[#d0d2d6] text-sm'>Due Date</span>
                                    <span className='text-[#d0d2d6] text-lg'>{moment(loan.dueDate).format('LL')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full lg:w-1/2 px-2 mb-4'>
                        <h2 className='text-xl font-semibold text-[#d0d2d6] pb-4'>Payment History</h2>
                        <div className='flex flex-col gap-3'>
                            {loan?.payments?.map((payment, index) => (
                                <div key={index} className='p-4 bg-[#283046] rounded-md'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[#d0d2d6]'>Amount Paid:</span>
                                        <span className='text-[#d0d2d6] font-bold'>{payment.amount} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <span className='text-[#d0d2d6]'>Date:</span>
                                        <span className='text-[#d0d2d6]'>{moment(payment.date).format('LLL')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDetails;