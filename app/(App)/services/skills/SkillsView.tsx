"use client";
import AddSkillModal from "@/components/features/skills/AddSkillModal";
import SkillPageHeader from "@/components/features/skills/SkillsPageHeader";
import SkillsTable from "@/components/features/skills/SkillsTable";
import { useState } from "react";

export default function SkillsView() {
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState<boolean>(false);
  return (
    <div>
      <SkillPageHeader
        isOpen={isCreateSkillOpen}
        setIsOpen={setIsCreateSkillOpen}
      />
      <div className="mt-10">
        <SkillsTable
          isOpen={isCreateSkillOpen}
          setIsOpen={setIsCreateSkillOpen}
        />
        <AddSkillModal
          isOpen={isCreateSkillOpen}
          setIsOpen={setIsCreateSkillOpen}
        />
      </div>
    </div>
  );
}
