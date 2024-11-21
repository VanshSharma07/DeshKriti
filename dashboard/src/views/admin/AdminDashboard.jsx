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
        <div className='px-2 md:px-7 py-5'>


            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200">
                    <div className="flex flex-col justify-start items-start text-slate-700">
                        <h2 className="text-3xl font-bold">{totalSale} INR</h2>
                        <span className="text-sm font-medium text-slate-600">Total Sales</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl">
                        <MdCurrencyExchange className="text-white" />
                    </div>
                </div>


                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200">
                    <div className="flex flex-col justify-start items-start text-slate-700">
                        <h2 className="text-3xl font-bold">{totalProduct}</h2>
                        <span className="text-sm font-medium text-slate-600">Products</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl">
                        <MdProductionQuantityLimits className="text-white" />
                    </div>
                </div>


                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200">
                    <div className="flex flex-col justify-start items-start text-slate-700">
                        <h2 className="text-3xl font-bold">{totalSeller}</h2>
                        <span className="text-sm font-medium text-slate-600">Sellers</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl">
                        <FaUsers className="text-white" />
                    </div>
                </div>


                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-sm gap-3 border border-slate-200">
                    <div className="flex flex-col justify-start items-start text-slate-700">
                        <h2 className="text-3xl font-bold">{totalOrder}</h2>
                        <span className="text-sm font-medium text-slate-600">Orders</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-slate-700 flex justify-center items-center text-xl">
                        <FaCartShopping className="text-white" />
                    </div>
                </div>
 
            </div>

        
        
        <div className='w-full flex flex-wrap mt-7'>
            <div className='w-full lg:w-7/12 lg:pr-3'>
                <div className='w-full bg-white shadow-md p-4 rounded-md'>
            <Chart options={state.options} series={state.series} type='bar' height={350} />
                </div>
            </div>

        
        <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
            <div className='w-full bg-white shadow-md p-4 rounded-md'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-gray-700 pb-3'>Recent Seller Message</h2>
                    <Link className='font-semibold text-sm text-gray-700'>View All</Link>
                </div>

        <div className='flex flex-col gap-2 pt-6 text-gray-600'>
            <ol className='relative border-l border-gray-200 ml-4'>


                 {
                recentMessage.map((m, i) => <li className='mb-3 ml-6'>
                <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10'>
                {
                    m.senderId === userInfo._id ? <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> : <img className='w-full rounded-full h-full shadow-lg' src={seller} alt="" />
                } 
                </div>
                <div className='p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm'>
                <div className='flex justify-between items-center mb-2'>
            <Link className='text-md font-normal'>{m.senderName}</Link>
            <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'> {moment(m.createdAt).startOf('hour').fromNow()}</time>
                </div>
                <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                    {m.message}
                </div>
                </div>
            </li>)
               }

            </ol>

        </div>


            </div>
        </div>
        </div>


        <div className='w-full p-4 bg-white shadow-md rounded-md mt-6'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-lg text-gray-700 pb-3 '>Recent Orders</h2>
                <Link className='font-semibold text-sm text-gray-700'>View All</Link>
               </div>

    <div className='relative overflow-x-auto'>
    <table className='w-full text-sm text-left text-gray-600'>
        <thead className='text-sm text-gray-700 uppercase border-b border-gray-200'>
        <tr>
            <th scope='col' className='py-3 px-4'>Order Id</th>
            <th scope='col' className='py-3 px-4'>Price</th>
            <th scope='col' className='py-3 px-4'>Payment Status</th>
            <th scope='col' className='py-3 px-4'>Order Status</th>
            <th scope='col' className='py-3 px-4'>Active</th>
        </tr>
        </thead>

        <tbody>
            {
                 recentOrder.map((d, i) => <tr key={i}>
                 <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>#{d._id}</td>
                 <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>{d.price} INR</td>
                 <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>{d.payment_status}</td>
                 <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>{d.delivery_status}</td>
                <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                <Link to={`/admin/dashboard/order/details/${d._id}`}>View</Link> </td>
            </tr> )
            }

            
        </tbody>

    </table>

    </div>

        </div>




             
        </div>
    );
};

export default AdminDashboard;