"use client";

import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AssetsPageHeader({ isOpen, setIsOpen }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Assets</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and share project & client assets
        </p>
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white font-semibold text-sm transition-all ease-in-out duration-500 hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] shadow-md shadow-red-500/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Asset
      </button>
    </div>
  );
}
