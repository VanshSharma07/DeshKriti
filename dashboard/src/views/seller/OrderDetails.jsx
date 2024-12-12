import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import moment from 'moment';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    useEffect(() => {
        dispatch(get_seller_order(orderId));
    }, [orderId]);

    const status_update = (e) => {
        const newStatus = e.target.value;
        dispatch(seller_order_status_update({ orderId, info: { status: newStatus } }));
        setStatus(newStatus);
    };

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

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full bg-white p-6 rounded-lg shadow-md'>
                {/* Header Section */}
                <div className='flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                    <h1 className='text-2xl font-semibold text-gray-700'>Order Details</h1>
                    <div className='flex items-center gap-3'>
                        <select
                            onChange={status_update}
                            value={status}
                            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="placed">Placed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Order Information */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold text-gray-700 mb-3'>Order Information</h2>
                        <div className='space-y-2'>
                            <p className='text-gray-600'><span className='font-medium'>Order ID:</span> #{order?._id}</p>
                            <p className='text-gray-600'><span className='font-medium'>Total Amount:</span> {order?.price} INR</p>
                            <p className='text-gray-600'>
                                <span className='font-medium'>Payment Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                    order?.payment_status === 'paid'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {order?.payment_status}
                                </span>
                            </p>
                            <p className='text-gray-600'>
                                <span className='font-medium'>Order Date:</span> {moment(order?.date).format('MMMM Do YYYY')}
                            </p>
                        </div>
                    </div>

                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-lg font-semibold text-gray-700 mb-3'>Customer Information</h2>
                        <div className='space-y-2'>
                            <p className='text-gray-600'><span className='font-medium'>Deliver To:</span> {order?.shippingInfo?.name}</p>
                            <p className='text-gray-600'><span className='font-medium'>Address:</span> {order?.shippingInfo?.address}</p>
                            <p className='text-gray-600'><span className='font-medium'>Phone:</span> {order?.shippingInfo?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className='mt-8'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-4'>Order Items</h2>
                    <div className='space-y-4'>
                        {order?.products?.map((p, i) => (
                            <div key={i} className='flex items-center gap-4 p-4 border border-gray-100 rounded-lg'>
                                <img
                                    src={p.images[0]}
                                    alt={p.name}
                                    className='w-20 h-20 object-cover rounded-lg'
                                />
                                <div className='flex-1'>
                                    <h3 className='text-lg font-medium text-gray-700'>{p.name}</h3>
                                    <p className='text-gray-500'>Brand: {p.brand}</p>
                                    <div className='flex items-center gap-4 mt-2'>
                                        <span className='text-gray-600'>Quantity: {p.quantity}</span>
                                        <span className='text-gray-600'>Price: {p.price} INR</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;