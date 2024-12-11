import React, { useEffect, useState } from 'react';
import { LuArrowDownSquare } from "react-icons/lu";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)
    const { myOrders, totalOrder } = useSelector(state => state.order)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_admin_orders(obj))
    }, [searchValue, currentPage, parPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-xl font-semibold text-gray-700'>All Orders</h1>
                    <div className='flex items-center gap-3'>
                        <select 
                            onChange={(e) => setParPage(parseInt(e.target.value))} 
                            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <input 
                            type="text"
                            placeholder='Search...'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
                        />
                    </div>
                </div>

                <div className='w-full overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead className=' border-b border-gray-100 bg-blue-500'>
                            <tr className='bg-gray-50 border-b border-gray-100'>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Order ID</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Price</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Payment Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Order Status</th>
                                <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map((o) => (
                                <tr key={o._id} className='text-black'>
                                    <td className='py-3 w-[25%] font-medium whitespace-nowrap'>#{o._id}</td>
                                    <td className='py-3 w-[13%] font-medium'>{o.price} INR</td>
                                    <td className='py-3 w-[18%] font-medium'>{o.payment_status}</td>
                                    <td className='py-3 w-[18%] font-medium'>{o.delivery_status}</td>
                                    <td className='py-3 w-[18%] font-medium'>
                                        <Link to={`/admin/dashboard/order/details/${o._id}`}>View</Link>
                                    </td>
                                    <td 
                                        onClick={() => setShow(show === o._id ? false : o._id)} 
                                        className='py-3 w-[8%] font-medium'
                                    >
                                        <LuArrowDownSquare />
                                    </td>
                                </tr>
                            ))}

                            {myOrders.map((o) => (
                                <tr key={`suborder-${o._id}`} className={show === o._id ? 'block' : 'hidden'}>
                                    <td colSpan="6" className='bg-[#8288ed]'>
                                        {o.suborder.map((so) => (
                                            <div key={so._id} className='flex justify-start items-start border-b border-slate-700'>
                                                <div className='py-3 w-[25%] font-medium whitespace-nowrap pl-3'>#{so._id}</div>
                                                <div className='py-3 w-[13%] font-medium'>{so.price} INR</div>
                                                <div className='py-3 w-[18%] font-medium'>{so.payment_status}</div>
                                                <div className='py-3 w-[18%] font-medium'>{so.delivery_status}</div>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {totalOrder > parPage && (
                        <div className='mt-4 flex justify-end'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalOrder}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
