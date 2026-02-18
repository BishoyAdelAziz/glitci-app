"use client";

// import ServiceRow from "./ServiceRow";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import usePositions from "@/hooks/usePositions";
import PositionsRow from "./PositionsRaw";
import { Position } from "@/types/positions";
import AddPositionModal from "./AddPositionModal";
import DeletePositionModal from "./DeletePositionModal";
import EditPositionModal from "./EditPositionModal";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function PositionsTable({ isOpen, setIsOpen }: Props) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );

  const [selectAll, setSelectAll] = useState(false);
  const [isEditOpen, setIsEditOPen] = useState(false);
  const [isDeleteOpen, setIsDeleteOPen] = useState(false);
  const [SelectedPositions, SetSlectedPositions] = useState<
    string[] | undefined
  >([]);

  const { isError, error, isLoading, pagination, positions } = usePositions();
  const onClose = () => {
    setIsOpen(false);
  };
  const onDeleteClose = () => {
    // setIsDeleteModalOpen(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      SetSlectedPositions([]);
    } else {
      SetSlectedPositions(positions?.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectService = (id: string) => {
    // Use optional chaining and a fallback to ensure we are always working with an array
    const currentServices = SelectedPositions ?? [];

    if (currentServices.includes(id)) {
      SetSlectedPositions(currentServices.filter((pId) => pId !== id));
    } else {
      // Spreading the fallback ensures no 'undefined' iterator error
      SetSlectedPositions([...currentServices, id]);
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
          Error loading Positions. Please try again.
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No Positions found.
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
              <tr className="grid grid-cols-14 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="flex items-center col-span-1">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded accent-[#B72D2D] border-gray-300 dark:border-gray-600 text-[#B72D2D] focus:ring-2 focus:ring-[#B72D2D] border-0"
                  />
                </th>
                <th className="col-span-6 flex items-center justify-start text-center ">
                  Positions
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
                <th className="text-center col-span-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {positions.map((position) => (
                <PositionsRow
                  key={position.id}
                  Position={position}
                  isSelected={SelectedPositions?.includes(position.id)}
                  onSelect={handleSelectService}
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
      <AddPositionModal setIsOpen={setIsOpen} isOpen={isOpen} />
      {selectedPosition && (
        <>
          <EditPositionModal
            isOpen={isEditOpen}
            position={selectedPosition}
            setIsOpen={setIsEditOPen}
          />

          <DeletePositionModal
            isOpen={isDeleteOpen}
            position={selectedPosition}
            setIsOpen={setIsDeleteOPen}
          />
        </>
      )}
    </>
  );
}
