import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const Header = ({showSidebar, setShowSidebar}) => {
  const {userInfo} = useSelector(state => state.auth)
  
  return (
    <div className='fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40'>
      <div className='ml-0 lg:ml-[260px] rounded-xl h-[65px] flex justify-between items-center bg-white shadow-sm px-5 transition-all'>
        <div onClick={() => setShowSidebar(!showSidebar)} className='w-[35px] flex lg:hidden h-[35px] rounded-md bg-blue-500 shadow-lg hover:bg-blue-600 justify-center items-center cursor-pointer text-white transition-all'>
          <span><FaList/></span>
        </div>

        <div className='hidden md:block w-[400px]'>
          <div className='relative'>
            <input 
              className='w-full px-4 py-2 outline-none border bg-gray-50 border-gray-100 rounded-lg text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all' 
              type="text" 
              name='search' 
              placeholder='Search...' 
            />
            <button className='absolute right-2 top-2.5 text-gray-400'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className='flex items-center gap-8 relative'>
          <div className='flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg'>
            <div className='flex flex-col items-end'>
              <h2 className='text-sm font-semibold text-gray-700'>{userInfo.name}</h2>
              <span className='text-xs text-gray-500'>{userInfo.role}</span>
            </div>
            {userInfo.role === 'admin' ? 
              <img className='w-[40px] h-[40px] rounded-lg object-cover border-2 border-blue-500' src="http://localhost:3001/images/admin.jpg" alt="" /> : 
              <img className='w-[40px] h-[40px] rounded-lg object-cover border-2 border-blue-500' src={userInfo.image} alt="" />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;