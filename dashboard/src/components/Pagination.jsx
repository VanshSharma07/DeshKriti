import React from 'react';

const Pagination = ({ currentPage, totalItems, parPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / parPage);
    
    return (
        <div className='flex justify-end mt-4 gap-2'>
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1 
                        ? 'bg-[#283046] text-gray-500'
                        : 'bg-[#283046] text-[#d0d2d6] hover:bg-[#3a4052]'
                }`}
            >
                Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#283046] text-[#d0d2d6] hover:bg-[#3a4052]'
                    }`}
                >
                    {index + 1}
                </button>
            ))}
            
            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages 
                        ? 'bg-[#283046] text-gray-500'
                        : 'bg-[#283046] text-[#d0d2d6] hover:bg-[#3a4052]'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;