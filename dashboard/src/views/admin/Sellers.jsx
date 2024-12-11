import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';

const Sellers = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)
    const {sellers , totalSeller , } = useSelector(state => state.seller)
    useEffect(()=>{
        const obj = {
            parPage: parseInt(parPage),
            page : parseInt(currentPage),
            searchValue
        }
        dispatch(get_active_sellers(obj))
    },[searchValue,currentPage,parPage])
    return (
        <div className='px-2 lg:px-7 pt-5'>
             <div className='bg-white p-6 rounded-lg shadow-md'>
            
             <div className='flex flex-wrap justify-between items-center mb-6 gap-4'>
                    <h1 className='text-2xl font-semibold text-gray-700'>Active Sellers</h1>
                    <div className='flex items-center gap-4'>
                        <select 
                            onChange={(e) => setParPage(parseInt(e.target.value))} 
                            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="15">15 per page</option>
                        </select>
                        <input 
                            type="text"
                            placeholder='Search sellers...'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-600'
                        />
                    </div>
                </div>

                <div className='overflow-x-auto'>
    <table className='w-full whitespace-nowrap'>
        <thead>
          <tr className='bg-gray-50 border-b border-gray-100'>
            <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Seller</th>
            <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Shop Info</th>
            <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Status</th>
            <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Payment Status</th>
            <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600'>Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller, i) => (
            <tr key={i} className='border-b border-gray-50 hover:bg-gray-50'>
              <td className='py-3 px-4'>
                <div className='flex items-center gap-3'>
                  <img 
                    src={seller.image} 
                    alt={seller.name} 
                    className='w-12 h-12 rounded-full object-cover'
                  />
                  <div>
                    <h2 className='text-gray-700 font-medium'>{seller.name}</h2>
                    <p className='text-sm text-gray-500'>{seller.email}</p>
                  </div>
                </div>
              </td>
              <td className='py-3 px-4'>
                <div>
                  <h3 className='text-gray-700'>{seller.shopInfo?.shopName}</h3>
                  <p className='text-sm text-gray-500'>{seller.shopInfo?.division}</p>
                </div>
              </td>
              <td className='py-3 px-4'>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  seller.status === 'active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {seller.status}
                </span>
              </td>
              <td className='py-3 px-4'>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  seller.payment === 'active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {seller.payment}
                </span>
              </td>
              <td className='py-3 px-4'>
                <Link 
                  to={`/admin/dashboard/seller/details/${seller._id}`}
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

    {/* Pagination */}
    {totalSeller > parPage && (
      <div className='mt-4 flex justify-end'>
        <Pagination
          pageNumber={currentPage}
          setPageNumber={setCurrentPage}
          totalItem={totalSeller}
          parPage={parPage}
          showItem={3}
        />
      </div>
    )}
  </div>
</div>
    );
};

export default Sellers;