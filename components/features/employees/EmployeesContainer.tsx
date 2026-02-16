"use client";
import { Dispatch, SetStateAction } from "react";
import AddEmployeeMddal from "./AddEmployeeModal";
import EmployeeCard from "./EmployeeCard";
import useEmployees from "@/hooks/useEmployees";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function EmployeesCOntainer({ isOpen, setIsOpen }: Props) {
  const { employees, isError, isLoading } = useEmployees();
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading projects. Please try again.
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-x-6 gap-y-12">
      {employees?.map((employee) => {
        return <EmployeeCard employee={employee} key={employee.id} />;
      })}
      <AddEmployeeMddal isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
    </div>
  );
}
