import React from 'react';

const Search = ({ setParPage, setSearchValue, searchValue }) => {
    return (
        <div className='flex justify-between items-center mb-5'>
            <select 
                className='px-4 py-2 focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-gray-700'
                onChange={(e) => setParPage(parseInt(e.target.value))}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
            </select>
            <input 
                type='text'
                placeholder='Search'
                className='px-4 py-2 focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-gray-700'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );
};

export default Search;