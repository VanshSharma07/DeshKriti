import React, {useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import {get_seller_request} from '../../store/Reducers/sellerReducer'

const SellerRequest = () => {

    const dispatch = useDispatch()

    const {totalSeller,sellers} = useSelector(state=> state.seller)


    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)

    useEffect(()=>{
        dispatch(get_seller_request({
            parPage,
            searchValue,
            page: currentPage
        }))
    },[parPage,searchValue,currentPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='bg-white rounded-lg shadow-md'>
                <div className='p-4 border-b border-gray-100'>
                    <h1 className='text-xl font-semibold text-gray-700'>Seller Request</h1>
                </div>
                
                <div className='p-4'>
                    <Search 
                        setParPage={setParPage} 
                        setSearchValue={setSearchValue} 
                        searchValue={searchValue} 
                    />

                    <div className='relative overflow-x-auto mt-4'>
                        <table className='w-full text-sm text-left'>
                            <thead className='bg-gray-50 text-gray-600 uppercase'>
                                <tr>
                                    <th scope='col' className='py-3 px-4 font-semibold'>No</th>
                                    <th scope='col' className='py-3 px-4 font-semibold'>Name</th>
                                    <th scope='col' className='py-3 px-4 font-semibold'>Email</th>
                                    <th scope='col' className='py-3 px-4 font-semibold'>Payment Status</th>
                                    <th scope='col' className='py-3 px-4 font-semibold'>Status</th>
                                    <th scope='col' className='py-3 px-4 font-semibold'>Action</th>
                                </tr>
                            </thead>

                            <tbody className='divide-y divide-gray-100'>
                                {
                                    sellers.map((d, i) => (
                                        <tr key={i} className='hover:bg-gray-50'>
                                            <td scope='row' className='py-3 px-4 text-gray-600'>
                                                {i + 1}
                                            </td>
                                            <td scope='row' className='py-3 px-4 font-medium text-gray-700'>
                                                {d.name}
                                            </td>
                                            <td scope='row' className='py-3 px-4 text-gray-600'>
                                                {d.email}
                                            </td>
                                            <td scope='row' className='py-3 px-4'>
                                                <span className='px-3 py-1 rounded-full text-sm font-medium
                                                    ${d.payment === "paid" 
                                                        ? "bg-green-100 text-green-600" 
                                                        : "bg-yellow-100 text-yellow-600"
                                                    }'
                                                >
                                                    {d.payment}
                                                </span>
                                            </td>
                                            <td scope='row' className='py-3 px-4'>
                                                <span className='px-3 py-1 rounded-full text-sm font-medium
                                                    ${d.status === "active" 
                                                        ? "bg-blue-100 text-blue-600" 
                                                        : "bg-gray-100 text-gray-600"
                                                    }'
                                                >
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td scope='row' className='py-3 px-4'>
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link 
                                                        to={`/admin/dashboard/seller/details/${d._id}`} 
                                                        className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={50}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;