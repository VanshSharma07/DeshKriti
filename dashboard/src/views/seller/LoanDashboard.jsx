import React, { forwardRef, useEffect, useState } from 'react';
import { MdCurrencyExchange } from "react-icons/md";
import { FixedSizeList as List } from 'react-window';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_loans, messageClear } from '../../store/Reducers/loanReducer';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Link } from "react-router-dom";

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel', deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
))

const LoanDashboard = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { 
        loans, 
        activeLoans, 
        totalLoanAmount, 
        repaidAmount, 
        pendingAmount, 
        successMessage, 
        errorMessage 
    } = useSelector(state => state.loan)

    useEffect(() => {
        dispatch(get_seller_loans(userInfo._id))
    }, [])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    const Row = ({ index, style }) => {
        return (
            <div style={style} className='flex text-sm text-white font-medium'>
                <div className='w-[20%] p-2 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>{activeLoans[index]?.amount} INR</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    <span className='py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm'>
                        {activeLoans[index]?.status}
                    </span>
                </div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    {moment(activeLoans[index]?.dueDate).format('LL')}
                </div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    <Link to={`/seller/dashboard/loan/details/${activeLoans[index]?._id}`}>
                        View
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-5'>
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200'>
                    <div className='flex flex-col justify-start items-start text-slate-700'>
                        <h2 className='text-2xl font-bold'>{totalLoanAmount} INR</h2>
                        <span className='text-sm font-medium text-slate-600'>Total Loan Amount</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200'>
                    <div className='flex flex-col justify-start items-start text-slate-700'>
                        <h2 className='text-2xl font-bold'>{repaidAmount} INR</h2>
                        <span className='text-sm font-medium text-slate-600'>Repaid Amount</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-[#ecebff] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-2xl font-bold'>{pendingAmount} INR</h2>
                        <span className='text-sm font-bold'>Pending Amount</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-[#fae8e8] shadow-lg' />
                    </div>
                </div>
            </div>

            <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-medium pb-5 text-slate-700">Active Loans</h2>
                <div className="w-full overflow-x-auto">
                    <div className="flex bg-slate-100 uppercase text-xs font-medium text-slate-600 min-w-[340px] rounded-md">
                        <div className="w-[20%] p-2">No</div>
                        <div className="w-[20%] p-2">Amount</div>
                        <div className="w-[20%] p-2">Status</div>
                        <div className="w-[20%] p-2">Due Date</div>
                        <div className="w-[20%] p-2">Action</div>
                    </div>
                    <List
                        style={{ minWidth: '340px' }}
                        className='List'
                        height={350}
                        itemCount={activeLoans.length}
                        itemSize={35}
                        outerElementType={outerElementType}
                    >
                        {Row}
                    </List>
                </div>
            </div>
        </div>
    )
}

export default LoanDashboard;