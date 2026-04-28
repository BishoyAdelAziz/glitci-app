"use client";

import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function UsersPageHeader({ isOpen, setIsOpen }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">All Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage, track, and optimize your users.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-6 py-3 transition-all ease-in-out duration-700 font-semibold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Task
        </button>
      </div>
    </div>
  );
}
