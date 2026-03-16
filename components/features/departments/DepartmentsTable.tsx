"use client";

import { Department } from "@/types/departments";
import DepartmentRow from "./DepartmentRow";
import AddDepartmentModal from "./AddDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";
import DeleteDepartmentModal from "./DeleteDepartmentModal";
import { useSearchParam } from "@/hooks/useSearchParam";
import { Dispatch, SetStateAction, useState } from "react";
import useDepartments from "@/hooks/useDepartments";
import StackedPagination from "@/components/ui/Pagination";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";
import { formatDate } from "@/utils/functions";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DepartmentsTable({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const [page, setPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditOpen, setIsEditOPen] = useState(false);
  const [isDeleteOpen, setIsDeleteOPen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<
    string[] | undefined
  >([]);

  const { departments, isError, isLoading, pagination } = useDepartments({
    name: search,
    page,
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(departments?.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDepartment = (id: string) => {
    const current = selectedDepartments ?? [];
    if (current.includes(id)) {
      setSelectedDepartments(current.filter((pId) => pId !== id));
    } else {
      setSelectedDepartments([...current, id]);
    }
  };

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
          Error loading Departments. Please try again.
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No Departments found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto ring-1 ring-gray-700/20 dark:ring-white/15">
            <table className="w-full grid">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr className="grid grid-cols-13 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <th className="flex items-center col-span-1">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-[#B72D2D] border-gray-300 dark:border-gray-600 text-[#B72D2D] focus:ring-2 focus:ring-[#B72D2D] border-0"
                    />
                  </th>
                  <th className="col-span-6 flex items-center justify-start text-center">
                    Department
                  </th>
                  <th className="col-span-2 flex items-center justify-center text-center">
                    Created At
                  </th>
                  <th className="col-span-2 flex items-center justify-center text-center">
                    Updated At
                  </th>
                  <th className="col-span-1 text-center">Status</th>
                  <th className="text-center col-span-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {departments?.map((department: Department) => (
                  <DepartmentRow
                    key={department.id}
                    department={department}
                    isSelected={selectedDepartments?.includes(department?.id)}
                    onSelect={handleSelectDepartment}
                    onEdit={() => {
                      setIsEditOPen(true);
                      setSelectedDepartment(department);
                    }}
                    onDelete={() => {
                      setIsDeleteOPen(true);
                      setSelectedDepartment(department);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4 ring-1 ring-gray-700/20 dark:ring-white/15">
            {departments?.map((department: Department) => (
              <div
                key={department.id}
                className="bg-white dark:bg-gray-800 outline-1 outline-gray-700/30 dark:border-gray-700/30 rounded-xl p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedDepartments?.includes(department.id)}
                      onChange={() => handleSelectDepartment(department.id)}
                      className="mt-1 w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {department.name}
                    </h3>
                  </div>
                  <ActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: <EditIcon />,
                        onClick: () => {
                          setIsEditOPen(true);
                          setSelectedDepartment(department);
                        },
                      },
                      {
                        label: "Delete",
                        icon: <TrashIcon />,
                        onClick: () => {
                          setIsDeleteOPen(true);
                          setSelectedDepartment(department);
                        },
                        variant: "danger",
                      },
                    ]}
                  />
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      department.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Created:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(department.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(department.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="translate-y-8 relative transform">
          {pagination && (
            <StackedPagination
              total={pagination.totalPages}
              limit={1}
              currentPage={pagination.currentPage}
              onChange={(page) => setPage(page)}
            />
          )}
        </div>
      </div>

      <AddDepartmentModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {selectedDepartment && (
        <>
          <EditDepartmentModal
            department={selectedDepartment}
            isOpen={isEditOpen}
            setIsOpen={setIsEditOPen}
          />
          <DeleteDepartmentModal
            department={selectedDepartment}
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOPen}
          />
        </>
      )}
    </>
  );
}
