import React, { useEffect, useState } from 'react'; 
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination'; 
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';
const Orders = () => {

    const dispatch = useDispatch()
    const {myOrders,totalOrder } = useSelector(state => state.order)
    const {userInfo } = useSelector(state => state.auth)



    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sellerId: userInfo._id
        }
        dispatch(get_seller_orders(obj))
    },[searchValue,currentPage,parPage])
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-xl font-semibold text-gray-700'>Orders Management</h1>
                    <Search 
                        setParPage={setParPage} 
                        setSearchValue={setSearchValue} 
                        searchValue={searchValue} 
                    />
                </div>

                <div className='w-full overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead>
                            <tr className='bg-gray-50 border-b border-gray-100'>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Order ID</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Price</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Payment Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Order Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map((order, i) => (
                                <tr key={i} className='border-b border-gray-50 hover:bg-gray-50'>
                                    <td className='py-3 px-4 text-sm text-gray-700'>#{order._id}</td>
                                    <td className='py-3 px-4 text-sm text-gray-700'>{order.price} INR</td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            order.payment_status === 'paid' 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            order.delivery_status === 'delivered' 
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {order.delivery_status}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <Link 
                                            to={`/seller/dashboard/order/details/${order._id}`}
                                            className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all'
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalOrder > parPage && (
                    <div className='mt-4 flex justify-end'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalOrder}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;