import React, { useEffect } from 'react';
import { MdCurrencyExchange,MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import seller from '../../assets/seller.png'
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
const AdminDashboard = () => {
    const dispatch = useDispatch()
    const {totalSale,totalOrder,totalProduct,totalSeller,recentOrder,recentMessage} = useSelector(state=> state.dashboard)
    const {userInfo} = useSelector(state=> state.auth)
    useEffect(() => {
        dispatch(get_admin_dashboard_data())
    }, [])

    const state = {


        
        
        series : [
            {
                name : "Orders",
                data : [23,34,45,56,76,34,23,76,87,78,34,45]
            },
            {
                name : "Revenue",
                data : [67,39,45,56,90,56,23,56,87,78,67,78]
            },
            {
                name : "Sellers",
                data : [34,39,56,56,80,67,23,56,98,78,45,56]
            },
        ],
        options : {
            color : ['#181ee8','#181ee8'],
            plotOptions: {
                radius : 30
            },
            chart : {
                background : 'transparent',
                foreColor : '#d0d2d6'
            },
            dataLabels : {
                enabled : false
            },
            strock : {
                show : true,
                curve : ['smooth','straight','stepline'],
                lineCap : 'butt',
                colors : '#f0f0f0',
                width  : .5,
                dashArray : 0
            },
            xaxis : {
                categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            legend : {
                position : 'top'
            },
            responsive : [
                {
                    breakpoint : 565,
                    yaxis : {
                        categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                    },
                    options : {
                        plotOptions: {
                            bar : {
                                horizontal : true
                            }
                        },
                        chart : {
                            height : "550px"
                        }
                    }
                }
            ]
        }
    }




    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                <div className='flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100'>
                    <div className='flex flex-col justify-start items-start'>
                        <h2 className='text-3xl font-bold text-gray-700'>{totalSale} INR</h2>
                        <span className='text-sm font-medium text-gray-500'>Total Sales</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100'>
                    <div className='flex flex-col justify-start items-start'>
                        <h2 className='text-3xl font-bold text-gray-700'>{totalOrder}</h2>
                        <span className='text-sm font-medium text-gray-500'>Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100'>
                    <div className='flex flex-col justify-start items-start'>
                        <h2 className='text-3xl font-bold text-gray-700'>{totalProduct}</h2>
                        <span className='text-sm font-medium text-gray-500'>Products</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100'>
                    <div className='flex flex-col justify-start items-start'>
                        <h2 className='text-3xl font-bold text-gray-700'>{totalSeller}</h2>
                        <span className='text-sm font-medium text-gray-500'>Sellers</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <FaUsers className='text-white' />
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-wrap mt-7'>
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-white p-4 rounded-lg shadow-md'>
                        <Chart
                            options={{
                                ...state.options,
                                theme: {
                                    mode: 'light',
                                    palette: 'palette8'
                                }
                            }}
                            series={state.series}
                            type='bar'
                            height={300}
                        />
                    </div>
                </div>

                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-white p-4 rounded-lg shadow-md'>
                        <div className='flex justify-between items-center border-b border-gray-100 pb-3'>
                            <h2 className='font-semibold text-lg text-gray-700'>Recent Orders</h2>
                            <Link to='/admin/dashboard/orders' className='text-sm text-blue-500 hover:text-blue-600'>View All</Link>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-gray-100'>
                                        <th className='py-3 text-left text-gray-600'>Order ID</th>
                                        <th className='py-3 text-left text-gray-600'>Price</th>
                                        <th className='py-3 text-left text-gray-600'>Payment Status</th>
                                        <th className='py-3 text-left text-gray-600'>Order Status</th>
                                        <th className='py-3 text-left text-gray-600'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrder.map((order, i) => (
                                        <tr key={i} className='border-b border-gray-50'>
                                            <td className='py-3 text-gray-700'>#{order._id}</td>
                                            <td className='py-3 text-gray-700'>{order.price} INR</td>
                                            <td className='py-3 text-gray-700'>{order.payment_status}</td>
                                            <td className='py-3 text-gray-700'>{order.delivery_status}</td>
                                            <td className='py-3'>
                                                <Link to={`/admin/dashboard/order/details/${order._id}`} 
                                                      className='text-blue-500 hover:text-blue-600'>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;