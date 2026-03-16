"use client";
import React from "react";

interface Props {
  total: number | undefined; // total items from API
  limit: number | undefined; // items per page from filter
  currentPage: number | undefined; // current page from filter
  onChange: (page: number) => void; // sets page in useProjects
  stackSize?: number;
  className?: string;
}

const StackedPagination: React.FC<Props> = ({
  total,
  limit,
  currentPage = 1,
  onChange,
  stackSize = 6,
  className = "",
}) => {
  // Calculate total pages
  const totalPages = total && limit ? Math.ceil(total / limit) : 0;

  if (totalPages <= 1) return null;

  // Calculate current stack based on currentPage
  const currentStackIndex = Math.floor((currentPage - 1) / stackSize);
  const startPage = currentStackIndex * stackSize + 1;
  const endPage = Math.min(startPage + stackSize - 1, totalPages);
  const currentStack = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onChange(page);
    }
  };

  const hasPreviousStack = currentStackIndex > 0;
  const hasNextStack = (currentStackIndex + 1) * stackSize < totalPages;

  return (
    <div className={`flex gap-2 justify-start flex-wrap mt-2 ${className}`}>
      {/* Previous Stack Button */}
      {hasPreviousStack && (
        <button
          onClick={() => goToPage(startPage - stackSize)}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          title="Previous stack"
        >
          ←
        </button>
      )}

      {/* Current Stack Pages */}
      {currentStack.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1  ring-[0.01rem] rounded text-sm font-medium transition-all ${
            page === currentPage
              ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D] font-noor-bold text-white shadow-md"
              : "hover:bg-gray-100 hover:shadow-sm font-noor-bold text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis & Last Page */}
      {endPage < totalPages && (
        <>
          <span className="px-2 py-1 text-gray-400">...</span>
          <button
            onClick={() => goToPage(totalPages)}
            className={`px-3 py-1 border rounded text-sm font-medium transition-all ${
              currentPage === totalPages
                ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D] font-noor-bold text-white shadow-md"
                : "hover:bg-gray-100 hover:shadow-sm text-gray-700"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Stack Button */}
      {hasNextStack && (
        <button
          onClick={() => goToPage(startPage + stackSize)}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          title="Next stack"
        >
          →
        </button>
      )}
    </div>
  );
};

export default StackedPagination;
