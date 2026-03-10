"use client";

import useServices from "@/hooks/useServices";
import { Service } from "@/types/services";
import ServiceRow from "./ServiceRow";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import StackedPagination from "@/components/ui/Pagination";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import { SelectInput } from "@/components/forms/SelectInput";
import { useForm } from "react-hook-form";
import useDepartments from "@/hooks/useDepartments";
import { useSearchParam } from "@/hooks/useSearchParam";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";
import { formatDate } from "@/utils/functions";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ServicesTable({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1);
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const filterDepartment = watch("department");

  const { departments } = useDepartments();
  const [selectedServices, setSelectedServices] = useState<
    string[] | undefined
  >([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { isError, error, isLoading, pagination, services } = useServices({
    department: filterDepartment,
    name: search,
    page,
  });
  console.log(pagination);
  const onClose = () => setIsOpen(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services?.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectService = (id: string) => {
    const currentServices = selectedServices ?? [];
    if (currentServices.includes(id)) {
      setSelectedServices(currentServices.filter((pId) => pId !== id));
    } else {
      setSelectedServices([...currentServices, id]);
    }
  };

  const refinedDepartments = [
    { id: undefined, name: "All" },
    ...(departments?.map((position) => ({
      id: position.id,
      name: position.name,
    })) ?? []),
  ];

  const DepartmentFilter = (
    <div className="mb-5 w-[60%] lg:w-[30%]">
      <SelectInput
        register={register}
        control={control}
        errors={errors}
        label="Filter By Department"
        name="department"
        options={refinedDepartments}
        saveAsId
        setValue={setValue}
        required
      />
    </div>
  );

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
      <>
        {DepartmentFilter}
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No Services found.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {DepartmentFilter}
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300">
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
                <th className="col-span-6 flex items-center justify-start text-center">
                  Services
                </th>
                <th className="col-span-2 flex items-center justify-center text-center">
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
              {services?.map((service: Service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  isSelected={selectedServices?.includes(service?.id)}
                  onSelect={handleSelectService}
                  onEdit={() => {
                    setIsEditOpen(true);
                    setSelectedService(service);
                  }}
                  onDelete={() => {
                    setIsDeleteOpen(true);
                    setSelectedService(service);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4 ring-1 ring-gray-700/20 dark:ring-white/15">
          {services?.map((service: Service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 outline-1 outline-gray-700/30 dark:border-gray-700/30 rounded-xl p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedServices?.includes(service.id)}
                    onChange={() => handleSelectService(service.id)}
                    className="mt-1 w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
                <ActionsMenu
                  actions={[
                    {
                      label: "Edit",
                      icon: <EditIcon />,
                      onClick: () => {
                        setIsEditOpen(true);
                        setSelectedService(service);
                      },
                    },
                    {
                      label: "Delete",
                      icon: <TrashIcon />,
                      onClick: () => {
                        setIsDeleteOpen(true);
                        setSelectedService(service);
                      },
                      variant: "danger",
                    },
                  ]}
                />
              </div>

              {/* Department & Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Department:{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {service.department.name}
                  </span>
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    service.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Created:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(service.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Updated:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(service.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className=" py-6">
        <StackedPagination
          total={pagination?.totalPages}
          limit={1}
          currentPage={pagination?.currentPage}
          onChange={(page) => setPage(page)}
        />
      </div>

      <AddServiceModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {selectedService && (
        <>
          <EditServiceModal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            service={selectedService}
          />
          <DeleteServiceModal
            Service={selectedService}
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
          />
        </>
      )}
    </>
  );
}
