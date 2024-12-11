import React from 'react';

const Search = ({setParPage, setSearchValue, searchValue}) => {
    return (
        <div className='flex justify-between items-center gap-4'>
            <select 
                onChange={(e) => setParPage(parseInt(e.target.value))} 
                className='px-4 py-2 outline-none bg-white border border-gray-200 rounded-lg text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all'
            >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
            </select>
            
            <div className='relative'>
                <input 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    value={searchValue} 
                    className='w-[250px] px-4 py-2 outline-none bg-white border border-gray-200 rounded-lg text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all' 
                    type="text" 
                    placeholder='Search...' 
                />
                <button className='absolute right-2 top-2.5 text-gray-400'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Search;