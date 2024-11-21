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
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <h2 className='text-xl font-semibold text-white mb-4'>Request Microloan</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-3 mb-3'>
                        <label htmlFor='amount' className='text-white'>Loan Amount (INR)</label>
                        <input 
                            type='number'
                            id='amount'
                            min="1000"
                            max="100000"
                            className='px-3 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            required
                            disabled={loader}
                        />
                    </div>
                    <div className='flex flex-col gap-3 mb-3'>
                        <label htmlFor='repaymentPeriod' className='text-white'>Repayment Period (Months)</label>
                        <select
                            id='repaymentPeriod'
                            className='px-3 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            value={formData.repaymentPeriod}
                            onChange={(e) => setFormData({...formData, repaymentPeriod: e.target.value})}
                            disabled={loader}
                        >
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-3 mb-3'>
                        <label htmlFor='purpose' className='text-white'>Purpose</label>
                        <textarea
                            id='purpose'
                            className='px-3 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            value={formData.purpose}
                            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                            required
                            disabled={loader}
                            rows={3}
                            placeholder='Briefly describe the purpose of your loan request'
                        />
                    </div>
                    <div className='flex flex-col gap-3 mb-3'>
                        <label htmlFor='businessPlan' className='text-white'>Business Plan</label>
                        <textarea
                            id='businessPlan'
                            className='px-3 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                            value={formData.businessPlan}
                            onChange={(e) => setFormData({...formData, businessPlan: e.target.value})}
                            required
                            disabled={loader}
                            rows={6}
                            placeholder='Provide a detailed business plan'
                        />
                    </div>
                    <div className='mt-4'>
                        <button
                            type='submit'
                            disabled={loader}
                            className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-full'
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