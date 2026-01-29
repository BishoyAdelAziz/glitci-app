"use client";
import { useMemo, useState } from "react";

interface UseStackedPaginationProps {
  total?: number; // total items
  limit?: number; // items per page
  stackSize?: number; // number of pages per stack
}

export const useStackedPagination = ({
  total = 0,
  limit = 1,
  stackSize = 6,
}: UseStackedPaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);
  const [stackIndex, setStackIndex] = useState(0); // which stack is currently visible

  const stacks = useMemo(() => {
    const result: number[][] = [];
    for (let i = 1; i <= totalPages; i += stackSize) {
      result.push(
        Array.from(
          { length: Math.min(stackSize, totalPages - i + 1) },
          (_, idx) => i + idx,
        ),
      );
    }
    return result;
  }, [totalPages, stackSize]);

  const currentStack = stacks[stackIndex] || [];

  const goToPage = (p: number) => {
    setPage(p);
    const newStackIndex = Math.floor((p - 1) / stackSize);
    setStackIndex(newStackIndex);
  };

  return {
    page,
    setPage: goToPage,
    currentStack,
    totalPages,
    stackIndex,
    totalStacks: stacks.length,
  };
};
