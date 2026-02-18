"use client";

// import ServiceRow from "./ServiceRow";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import useSkills from "@/hooks/useSkills";
// import SkillsRow from "./SkillsRaw";
import { Skill } from "@/types/skills";
import SkillRow from "./SkillRow";
import AddSkillModal from "./AddSkillModal";
import { SelectInput } from "@/components/forms/SelectInput";
import { useForm } from "react-hook-form";
import usePositions from "@/hooks/usePositions";
import EditSkillModal from "./EditSkillModal";
import DeleteSkillModal from "./DeleteSkillModal";
// import AddSkillModal from "./AddSkillModal";
// import DeleteSkillModal from "./DeleteSkillModal";
// import EditSkillModal from "./EditSkillModal";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function SkillsTable({ isOpen, setIsOpen }: Props) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [selectAll, setSelectAll] = useState(false);

  const [SelectedSkills, SetSlectedSkills] = useState<string[] | undefined>([]);
  const filterPosition = watch("position");
  const { Skills, SkillsIsError, SkillsIsPending } = useSkills({
    position: filterPosition,
  });
  const { positions } = usePositions();
  const onClose = () => {
    setIsOpen(false);
  };
  const onDelte = (skil) => {
    setSelectedSkill;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      SetSlectedSkills([]);
    } else {
      SetSlectedSkills(Skills?.data.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSkillSelect = (id: string) => {
    // Use optional chaining and a fallback to ensure we are always working with an array
    const currentServices = SelectedSkills ?? [];

    if (currentServices.includes(id)) {
      SetSlectedSkills(currentServices.filter((pId) => pId !== id));
    } else {
      // Spreading the fallback ensures no 'undefined' iterator error
      SetSlectedSkills([...currentServices, id]);
    }
  };

  const handleEdit = (projectId) => {
    // setEditProjectId(projectId);
    // setIsEditModalOpen(true);
  };
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

  const refinedPosition = [
    { id: undefined, name: "All" },
    ...(positions?.map((position) => ({
      id: position.id,
      name: position.name,
    })) ?? []),
  ];
  return (
    <>
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
      {!Skills || Skills?.data.length <= 0 ? (
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No Skills found.
          </div>
        </div>
      ) : (
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
                    Skills
                  </th>
                  <th className="col-span-2 flex items-center justify-center text-center ">
                    Position
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
                {Skills?.data?.map((Skill: Skill) => {
                  return (
                    <SkillRow
                      key={Skill.id}
                      Skill={Skill}
                      isSelected={SelectedSkills?.includes(Skill.id)}
                      onDelete={() => {
                        setSelectedSkill(Skill);
                        setIsDeleteOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedSkill(Skill);
                        setIsEditOpen(true);
                      }}
                      onSelect={() => {
                        handleSkillSelect;
                      }}
                    />
                  );
                })}
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
      )}

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
