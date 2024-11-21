import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { process_loan_repayment, messageClear } from '../../store/Reducers/loanReducer';
import toast from 'react-hot-toast';

const LoanRepayment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loans, successMessage, errorMessage, loader } = useSelector(state => state.loan);
    const [amount, setAmount] = useState('');
    const [selectedLoan, setSelectedLoan] = useState('');

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/seller/dashboard/loans');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedLoan || !amount) {
            toast.error('Please select a loan and enter amount');
            return;
        }
        dispatch(process_loan_repayment({
            loanId: selectedLoan,
            amount: parseFloat(amount)
        }));
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <h2 className='text-xl font-semibold text-[#d0d2d6] pb-4'>Make Repayment</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-3'>
                        <select
                            className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            value={selectedLoan}
                            onChange={(e) => setSelectedLoan(e.target.value)}
                            disabled={loader}
                        >
                            <option value="">Select Loan</option>
                            {loans.filter(loan => loan.status === 'active').map(loan => (
                                <option key={loan._id} value={loan._id}>
                                    Loan #{loan._id.slice(-4)} - Remaining: {loan.repaymentAmount - (loan.repaidAmount || 0)} INR
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            placeholder='Enter amount'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loader}
                        />
                        <button
                            type='submit'
                            disabled={loader}
                            className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-full'
                        >
                            {loader ? 'Processing...' : 'Submit Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanRepayment;