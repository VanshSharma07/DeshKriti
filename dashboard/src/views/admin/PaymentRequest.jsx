import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { confirm_payment_request, get_payment_request,messageClear } from '../../store/Reducers/PaymentReducer';
import moment from 'moment';
import toast from 'react-hot-toast';

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel',deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} /> 
 ))

const PaymentRequest = () => {

    const dispatch = useDispatch()
    const {successMessage, errorMessage, pendingWithdrows,loader } = useSelector(state => state.payment)
    const [paymentId, setPaymentId] = useState('')
    
    useEffect(() => { 
        dispatch(get_payment_request())
    },[])

    const confirm_request = (id) => {
        setPaymentId(id)
        dispatch(confirm_payment_request(id))
    }
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    },[successMessage,errorMessage])

    return (
<div className='px-2 lg:px-7 pt-5'>
  <div className='bg-white p-6 rounded-lg shadow-md'>
    {/* Header */}
    <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
      <h1 className='text-2xl font-semibold text-gray-700'>Payment Requests</h1>
      <div className='flex gap-3'>
        <select 
          className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    {/* Requests List */}
    <div className='overflow-x-auto'>
      <div className='min-w-[340px]'>
        {/* Table Header */}
        <div className='grid grid-cols-4 bg-gray-50 p-4 rounded-lg mb-2'>
          <div className='text-sm font-semibold text-gray-600'>Seller</div>
          <div className='text-sm font-semibold text-gray-600'>Amount</div>
          <div className='text-sm font-semibold text-gray-600'>Date</div>
          <div className='text-sm font-semibold text-gray-600'>Action</div>
        </div>

        {/* Requests List */}
        <div className='h-[350px] overflow-y-auto custom-scrollbar'>
          <List
            height={350}
            itemCount={pendingWithdrows.length}
            itemSize={80}
            outerElementType={outerElementType}
            className='List'
          >
            {({ index, style }) => (
              <div style={style} className='p-4 border-b border-gray-100 hover:bg-gray-50'>
                <div className='grid grid-cols-4 items-center'>
                  <div className='flex items-center gap-3'>
                    <img 
                      src={pendingWithdrows[index]?.seller?.image} 
                      alt='' 
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div>
                      <h2 className='text-gray-700 font-medium'>{pendingWithdrows[index]?.seller?.name}</h2>
                      <span className='text-sm text-gray-500'>{pendingWithdrows[index]?.seller?.email}</span>
                    </div>
                  </div>
                  <div className='text-gray-700 font-medium'>
                    {pendingWithdrows[index]?.amount} INR
                  </div>
                  <div className='text-gray-600'>
                    {moment(pendingWithdrows[index]?.createdAt).format('MMMM Do YYYY')}
                  </div>
                  <div>
                    <button
                      onClick={() => confirm_request(pendingWithdrows[index]?._id)}
                      disabled={loader}
                      className={`px-4 py-2 rounded-lg text-white ${
                        loader ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                      } transition-all`}
                    >
                      {loader && paymentId === pendingWithdrows[index]?._id ? (
                        <span className='flex items-center gap-2'>
                          Processing...
                          <span className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                        </span>
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </List>
        </div>
      </div>
    </div>

    {/* No Requests Message */}
    {pendingWithdrows.length === 0 && (
      <div className='text-center py-8'>
        <p className='text-gray-500'>No pending payment requests</p>
      </div>
    )}
  </div>
</div>
    );
};

export default PaymentRequest;