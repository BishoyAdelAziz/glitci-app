"use client";

import useServices from "@/hooks/useServices";
import { Service } from "@/types/services";
import ServiceRow from "./ServiceRow";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import StackedPagination from "@/components/ui/Pagination";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ServicesTable({ isOpen, setIsOpen }: Props) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedServices, setSelectedServices] = useState<
    string[] | undefined
  >([]);

  const { isError, error, isLoading, pagination, services } = useServices();
  const onClose = () => {
    setIsOpen(false);
  };
  const onDeleteClose = () => {
    // setIsDeleteModalOpen(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services?.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectService = (id: string) => {
    // Use optional chaining and a fallback to ensure we are always working with an array
    const currentServices = selectedServices ?? [];

    if (currentServices.includes(id)) {
      setSelectedServices(currentServices.filter((pId) => pId !== id));
    } else {
      // Spreading the fallback ensures no 'undefined' iterator error
      setSelectedServices([...currentServices, id]);
    }
  };

  const handleEdit = (projectId) => {
    // setEditProjectId(projectId);
    // setIsEditModalOpen(true);
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
          Error loading Services. Please try again.
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No Services found.
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300 ">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto ring-1 ring-gray-700/20 dark:ring-white/15">
          <table className="w-full grid">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr className="grid grid-cols-15 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="flex items-center col-span-1">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded accent-[#B72D2D] border-gray-300 dark:border-gray-600 text-[#B72D2D] focus:ring-2 focus:ring-[#B72D2D] border-0"
                  />
                </th>
                <th className="col-span-6 flex items-center justify-start text-center ">
                  services
                </th>
                <th className="col-span-2 flex items-center justify-center text-center ">
                  Department
                </th>
                <th className="col-span-2 flex items-center justify-center text-center ">
                  Created At
                </th>
                <th className="col-span-2 flex items-center justify-center text-center ">
                  Updated At
                </th>
                <th className="col-span-1 text-center">Status</th>
                <th className="text-center col-span-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {services?.map((service: Service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  isSelected={selectedServices?.includes(service?.id)}
                  onSelect={handleSelectService}
                  isDeleteModalOpen={false}
                  setIsDeleteModalOpen={() => {}}
                  setIsEditModalOpen={() => {}}
                  setEditProjectId={() => {}}
                  isEditModalOpen={false}
                  onDeleteClose={() => onDeleteClose}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {/* {pagination && (
            <StackedPagination
              currentPage={pagination.currentPage}
              limit={pagination.limit}
              total={pagination.totalPages}
            />
          )} */}
        </div>
      </div>
    </>
  );
}
