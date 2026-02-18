"use client";
import { Dispatch, SetStateAction, useState } from "react";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function DepartmentPageHeader({ isOpen, setIsOpen }: Props) {
  return (
    <div className="flex items-center justify-between ">
      <h3 className="capitalize font-bold text-2xl ">Departments</h3>

      <div className="flex items-center justify-evenly space-x-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-6 py-3 transition-all   ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646]"
        >
          + New Department
        </button>
      </div>
    </div>
  );
}
