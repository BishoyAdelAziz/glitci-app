"use client";

import { Dispatch, SetStateAction, useState } from "react";
import usePositions from "@/hooks/usePositions";
import PositionsRow from "./PositionsRaw";
import { Position } from "@/types/positions";
import AddPositionModal from "./AddPositionModal";
import DeletePositionModal from "./DeletePositionModal";
import EditPositionModal from "./EditPositionModal";
import { useForm } from "react-hook-form";
import useDepartments from "@/hooks/useDepartments";
import { SelectInput } from "@/components/forms/SelectInput";
import { useSearchParam } from "@/hooks/useSearchParam";
import StackedPagination from "@/components/ui/Pagination";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";
import { formatDate } from "@/utils/functions";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PositionsTable({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const [page, setPage] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [selectAll, setSelectAll] = useState(false);
  const [isEditOpen, setIsEditOPen] = useState(false);
  const [isDeleteOpen, setIsDeleteOPen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<
    string[] | undefined
  >([]);

  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const filterDepartment = watch("department");

  const { departments } = useDepartments();
  const { isError, isLoading, pagination, positions } = usePositions({
    department: filterDepartment,
    name: search,
    page,
  });

  const refinedDepartments = [
    { id: undefined, name: "All" },
    ...(departments?.map((d) => ({ id: d.id, name: d.name })) ?? []),
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPositions([]);
    } else {
      setSelectedPositions(positions?.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectPosition = (id: string) => {
    const current = selectedPositions ?? [];
    if (current.includes(id)) {
      setSelectedPositions(current.filter((pId) => pId !== id));
    } else {
      setSelectedPositions([...current, id]);
    }
  };

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
          Error loading Positions. Please try again.
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <>
        {DepartmentFilter}
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No Positions found.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {DepartmentFilter}
      <div>
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto ring-1 ring-gray-700/20 dark:ring-white/15">
            <table className="w-full grid">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr className="grid grid-cols-14 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <th className="flex items-center col-span-1">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-[#B72D2D] border-gray-300 dark:border-gray-600 text-[#B72D2D] focus:ring-2 focus:ring-[#B72D2D] border-0"
                    />
                  </th>
                  <th className="col-span-6 flex items-center justify-start text-center">
                    Positions
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
                  <th className="text-center col-span-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {positions.map((position) => (
                  <PositionsRow
                    key={position.id}
                    Position={position}
                    isSelected={selectedPositions?.includes(position.id)}
                    onSelect={handleSelectPosition}
                    onEdit={() => {
                      setSelectedPosition(position);
                      setIsEditOPen(true);
                    }}
                    onDelete={() => {
                      setSelectedPosition(position);
                      setIsDeleteOPen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4 ring-1 ring-gray-700/20 dark:ring-white/15">
            {positions.map((position: Position) => (
              <div
                key={position.id}
                className="bg-white dark:bg-gray-800 outline-1 outline-gray-700/30 dark:border-gray-700/30 rounded-xl p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedPositions?.includes(position.id)}
                      onChange={() => handleSelectPosition(position.id)}
                      className="mt-1 w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {position.name}
                      </h3>
                      {position.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {position.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: <EditIcon />,
                        onClick: () => {
                          setSelectedPosition(position);
                          setIsEditOPen(true);
                        },
                      },
                      {
                        label: "Delete",
                        icon: <TrashIcon />,
                        onClick: () => {
                          setSelectedPosition(position);
                          setIsDeleteOPen(true);
                        },
                        variant: "danger",
                      },
                    ]}
                  />
                </div>

                {/* Department */}
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Department:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {position.department.name}
                    </span>
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Created:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(position.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(position.updatedAt)}
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
              onChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>

      <AddPositionModal setIsOpen={setIsOpen} isOpen={isOpen} />
      {selectedPosition && (
        <>
          <EditPositionModal
            isOpen={isEditOpen}
            position={selectedPosition}
            setIsOpen={setIsEditOPen}
            setSelectedPosition={setSelectedPosition}
          />
          <DeletePositionModal
            isOpen={isDeleteOpen}
            position={selectedPosition}
            setIsOpen={setIsDeleteOPen}
            setSelectedPosition={setSelectedPosition}
          />
        </>
      )}
    </>
  );
}
