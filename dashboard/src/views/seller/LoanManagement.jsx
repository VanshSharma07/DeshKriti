import React, { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { get_seller_loans, process_loan_repayment, messageClear } from '../../store/Reducers/loanReducer';
import moment from 'moment';
import toast from 'react-hot-toast';

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
));

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel', deltaY);
}

const LoanManagement = () => {
    const dispatch = useDispatch();
    const { loans, successMessage, errorMessage, loader } = useSelector(state => state.loan);
    const [amount, setAmount] = useState(0);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        dispatch(get_seller_loans());
    }, [dispatch, successMessage]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setAmount(0);
            setSelectedLoan(null);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const handleRepayment = (e) => {
        e.preventDefault();
        if (selectedLoan && amount > 0) {
            if (amount > selectedLoan.repaymentAmount - (selectedLoan.repaidAmount || 0)) {
                toast.error('Amount exceeds remaining balance');
                return;
            }
            dispatch(process_loan_repayment({
                loanId: selectedLoan._id,
                amount: parseFloat(amount)
            }));
        }
    };

    const Row = ({ index, style }) => {
        const loan = loans[index];
        const remainingAmount = loan.repaymentAmount ? 
            (loan.repaymentAmount - (loan.repaidAmount || 0)) : 
            loan.amount;
        
        return (
            <div style={style} className='flex text-sm text-white font-medium'>
                <div className='w-[20%] p-2 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>{loan.amount} INR</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>{remainingAmount} INR</div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    <span className={`py-[1px] px-[5px] rounded-md text-sm ${
                        loan.status === 'active' ? 'bg-green-500' :
                        loan.status === 'approved' ? 'bg-blue-500' :
                        loan.status === 'repaid' ? 'bg-gray-500' :
                        'bg-red-500'
                    }`}>
                        {loan.status}
                    </span>
                </div>
                <div className='w-[20%] p-2 whitespace-nowrap'>
                    {moment(loan.dueDate || loan.createdAt).format('LL')}
                </div>
            </div>
        );
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='w-full flex flex-wrap'>
                    <div className='w-full lg:w-1/2 px-2 mb-4'>
                        <h2 className='text-lg pb-4 text-white'>Make Repayment</h2>
                        <form onSubmit={handleRepayment}>
                            <div className='flex flex-col gap-3 mb-3'>
                                <select 
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                                    onChange={(e) => setSelectedLoan(loans.find(l => l._id === e.target.value))}
                                    value={selectedLoan?._id || ''}
                                    disabled={loader}
                                >
                                    <option value="">Select Loan</option>
                                    {loans.filter(loan => loan.status === 'active' || loan.status === 'approved').map(loan => (
                                        <option key={loan._id} value={loan._id}>
                                            Loan #{loan._id.slice(-4)} - Amount: {loan.amount} INR
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white'
                                    placeholder='Enter amount'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={!selectedLoan || loader}
                                />
                                <button 
                                    type="submit"
                                    className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 my-2'
                                    disabled={!selectedLoan || amount <= 0 || loader}
                                >
                                    {loader ? 'Processing...' : 'Make Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='w-full lg:w-1/2 px-2 mb-4'>
                        <h2 className='text-lg pb-4 text-white'>Payment History</h2>
                        <div className='bg-[#283046] p-4 rounded-md'>
                            {selectedLoan ? (
                                <div className='flex flex-col gap-3'>
                                    <div className='flex justify-between items-center text-[#d0d2d6]'>
                                        <span>Total Amount:</span>
                                        <span>{selectedLoan.amount} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center text-[#d0d2d6]'>
                                        <span>Repayment Amount:</span>
                                        <span>{selectedLoan.repaymentAmount} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center text-[#d0d2d6]'>
                                        <span>Repaid Amount:</span>
                                        <span>{selectedLoan.repaidAmount || 0} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center text-[#d0d2d6]'>
                                        <span>Remaining:</span>
                                        <span>{selectedLoan.repaymentAmount - (selectedLoan.repaidAmount || 0)} INR</span>
                                    </div>
                                    <div className='flex justify-between items-center text-[#d0d2d6]'>
                                        <span>Due Date:</span>
                                        <span>{moment(selectedLoan.dueDate).format('LL')}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-[#d0d2d6]'>Select a loan to view details</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-full mt-6'>
                    <h2 className='text-lg pb-4 text-white'>Loan History</h2>
                    <div className='w-full overflow-x-auto'>
                        <div className='flex bg-[#a7a3de] uppercase text-xs font-bold min-w-[340px] rounded-md'>
                            <div className='w-[20%] p-2'>No</div>
                            <div className='w-[20%] p-2'>Amount</div>
                            <div className='w-[20%] p-2'>Remaining</div>
                            <div className='w-[20%] p-2'>Status</div>
                            <div className='w-[20%] p-2'>Due Date</div>
                        </div>
                        <List
                            style={{ minWidth: '340px' }}
                            className='List'
                            height={350}
                            itemCount={loans.length}
                            itemSize={35}
                            outerElementType={outerElementType}
                        >
                            {Row}
                        </List>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanManagement;