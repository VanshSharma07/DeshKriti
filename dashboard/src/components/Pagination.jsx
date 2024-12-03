import React from 'react';

const Pagination = ({ pageNumber, setPageNumber, totalItems, perPage }) => {
    // Ensure all inputs are valid numbers and handle edge cases
    const safePageNumber = Math.max(1, Number(pageNumber) || 1);
    const safePerPage = Math.max(1, Number(perPage) || 10);
    const safeTotalItems = Math.max(0, Number(totalItems) || 0);

    // Calculate total pages
    const totalPages = Math.ceil(safeTotalItems / safePerPage);

    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1) return null;

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show limited pages with ellipsis
            if (safePageNumber <= 3) {
                // Near the start
                for (let i = 1; i <= 3; i++) pages.push(i);
                if (totalPages > 4) pages.push('...');
                pages.push(totalPages);
            } else if (safePageNumber >= totalPages - 2) {
                // Near the end
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle
                pages.push(1);
                pages.push('...');
                pages.push(safePageNumber - 1);
                pages.push(safePageNumber);
                pages.push(safePageNumber + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            {/* Previous button */}
            <button
                onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                disabled={safePageNumber <= 1}
                className={`px-3 py-1 rounded-md ${
                    safePageNumber <= 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
                Prev
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (typeof page === 'number') {
                            setPageNumber(page);
                        }
                    }}
                    disabled={page === '...'}
                    className={`px-3 py-1 rounded-md ${
                        page === safePageNumber
                            ? 'bg-purple-600 text-white'
                            : page === '...'
                            ? 'bg-transparent text-gray-400 cursor-default'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))}
                disabled={safePageNumber >= totalPages}
                className={`px-3 py-1 rounded-md ${
                    safePageNumber >= totalPages
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;