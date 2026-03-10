"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useSkills from "@/hooks/useSkills";
import { Skill } from "@/types/skills";
import SkillRow from "./SkillRow";
import AddSkillModal from "./AddSkillModal";
import { SelectInput } from "@/components/forms/SelectInput";
import { useForm } from "react-hook-form";
import usePositions from "@/hooks/usePositions";
import EditSkillModal from "./EditSkillModal";
import DeleteSkillModal from "./DeleteSkillModal";
import { useSearchParam } from "@/hooks/useSearchParam";
import StackedPagination from "@/components/ui/Pagination";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";
import { formatDate } from "@/utils/functions";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SkillsTable({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const [page, setPage] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[] | undefined>(
    [],
  );

  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const filterPosition = watch("position");

  const { Skills, SkillsIsError, SkillsIsPending } = useSkills({
    position: filterPosition,
    name: search,
    page,
  });
  const { positions } = usePositions();

  const refinedPosition = [
    { id: undefined, name: "All" },
    ...(positions?.map((position) => ({
      id: position.id,
      name: position.name,
    })) ?? []),
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills(Skills?.data.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSkillSelect = (id: string) => {
    const current = selectedSkills ?? [];
    if (current.includes(id)) {
      setSelectedSkills(current.filter((pId) => pId !== id));
    } else {
      setSelectedSkills([...current, id]);
    }
  };

  const PositionFilter = (
    <div className="mb-5 w-[60%] lg:w-[30%]">
      <SelectInput
        register={register}
        control={control}
        errors={errors}
        label="Filter By Position"
        name="position"
        options={refinedPosition}
        saveAsId
        setValue={setValue}
        required
      />
    </div>
  );

  if (SkillsIsPending) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (SkillsIsError) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading Skills. Please try again.
        </div>
      </div>
    );
  }

  if (!Skills || Skills?.data.length <= 0) {
    return (
      <>
        {PositionFilter}
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No Skills found.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {PositionFilter}
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
                    Skills
                  </th>
                  <th className="col-span-2 flex items-center justify-center text-center">
                    Position
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
                {Skills?.data?.map((skill: Skill) => (
                  <SkillRow
                    key={skill.id}
                    Skill={skill}
                    isSelected={selectedSkills?.includes(skill.id)}
                    onSelect={() => handleSkillSelect(skill.id)}
                    onDelete={() => {
                      setSelectedSkill(skill);
                      setIsDeleteOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedSkill(skill);
                      setIsEditOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4 ring-1 ring-gray-700/20 dark:ring-white/15">
            {Skills?.data?.map((skill: Skill) => (
              <div
                key={skill.id}
                className="bg-white dark:bg-gray-800 outline-1 outline-gray-700/30 dark:border-gray-700/30 rounded-xl p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedSkills?.includes(skill.id)}
                      onChange={() => handleSkillSelect(skill.id)}
                      className="mt-1 w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {skill.name}
                    </h3>
                  </div>
                  <ActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: <EditIcon />,
                        onClick: () => {
                          setSelectedSkill(skill);
                          setIsEditOpen(true);
                        },
                      },
                      {
                        label: "Delete",
                        icon: <TrashIcon />,
                        onClick: () => {
                          setSelectedSkill(skill);
                          setIsDeleteOpen(true);
                        },
                        variant: "danger",
                      },
                    ]}
                  />
                </div>

                {/* Position */}
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Position:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {skill.position.name}
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
                      {formatDate(skill.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(skill.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="translate-y-8 relative transform">
          {Skills && (
            <StackedPagination
              total={Skills.totalPages}
              limit={1}
              currentPage={Skills.page}
              onChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>

      <AddSkillModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {selectedSkill && (
        <>
          <EditSkillModal
            isOpen={isEditOpen}
            skill={selectedSkill}
            setIsOpen={setIsEditOpen}
            setSelectedSkill={setSelectedSkill}
          />
          <DeleteSkillModal
            isOpen={isDeleteOpen}
            Skill={selectedSkill}
            setIsOpen={setIsDeleteOpen}
            setSelectedSkill={setSelectedSkill}
          />
        </>
      )}
    </>
  );
}
