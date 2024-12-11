import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create_loan_request, messageClear } from '../../../store/Reducers/loanReducer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoanRequest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.loan);
    const [formData, setFormData] = useState({
        amount: '',
        purpose: '',
        businessPlan: '',
        repaymentPeriod: '3' // default 3 months
    });

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
        
        // Validate amount
        if (formData.amount < 1000 || formData.amount > 100000) {
            toast.error('Amount must be between 1,000 and 100,000 INR');
            return;
        }

        // Validate purpose
        if (formData.purpose.length < 10 || formData.purpose.length > 200) {
            toast.error('Purpose must be between 10 and 200 characters');
            return;
        }

        // Validate business plan
        if (formData.businessPlan.length < 50 || formData.businessPlan.length > 1000) {
            toast.error('Business plan must be between 50 and 1000 characters');
            return;
        }

        dispatch(create_loan_request({
            ...formData,
            amount: parseFloat(formData.amount),
            repaymentPeriod: parseInt(formData.repaymentPeriod)
        }));
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto'>
                <h1 className='text-2xl font-semibold text-gray-700 mb-6'>Request Micro Loan</h1>

                <form onSubmit={handleSubmit}>
                    <div className='space-y-6'>
                        <div>
                            <label className='block text-gray-600 mb-2'>Loan Amount (INR)</label>
                            <input
                                type='number'
                                name='amount'
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                placeholder='Enter amount'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-gray-600 mb-2'>Purpose of Loan</label>
                            <input
                                type='text'
                                name='purpose'
                                value={formData.purpose}
                                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                placeholder='Brief purpose of the loan'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-gray-600 mb-2'>Repayment Period</label>
                            <select
                                name='repaymentPeriod'
                                value={formData.repaymentPeriod}
                                onChange={(e) => setFormData({...formData, repaymentPeriod: e.target.value})}
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                            >
                                <option value='3'>3 months</option>
                                <option value='6'>6 months</option>
                                <option value='12'>12 months</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-gray-600 mb-2'>Business Plan</label>
                            <textarea
                                name='businessPlan'
                                value={formData.businessPlan}
                                onChange={(e) => setFormData({...formData, businessPlan: e.target.value})}
                                rows='4'
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400'
                                placeholder='Detailed business plan and how you plan to use the loan'
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loader}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all disabled:bg-blue-300'
                        >
                            {loader ? 'Processing...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanRequest;