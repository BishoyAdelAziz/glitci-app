"use client";
import { Dispatch, SetStateAction, useState } from "react";
import AddEmployeeMddal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import EmployeeCard from "./EmployeeCard";
import useEmployees from "@/hooks/useEmployees";
import { Employee } from "@/types/employees";
import { useSearchParam } from "@/hooks/useSearchParam";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EmployeesContainer({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const { employees, isError, isLoading } = useEmployees({ name: search });

  // ─── Source of truth ──────────────────────────────────────────────────────
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  const handleDelete = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedEmployee(null);
  };
  // ──────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading employees. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-x-6 gap-y-12">
        {employees?.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {/* Modals — rendered once at container level */}
      <AddEmployeeMddal isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />

      {selectedEmployee && (
        <>
          <EditEmployeeModal
            employee={selectedEmployee}
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            onClose={handleEditClose}
          />
          <DeleteEmployeeModal
            employee={selectedEmployee}
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            onClose={handleDeleteClose}
          />
        </>
      )}
    </>
  );
}
