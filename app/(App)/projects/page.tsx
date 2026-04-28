"use client";
import { useState } from "react";
import PageHeader from "@/components/features/projects/PageHeader";
import ProjectsTable from "@/components/features/projects/ProjectsTable";
import AddProjectModal from "@/components/features/projects/AddProjectModal";
export default function ProjectsPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
  const onClose = () => {
    setIsCreateProjectOpen(false);
  };
  return (
    <div>
      <PageHeader
        isOpen={isCreateProjectOpen}
        setIsOpen={setIsCreateProjectOpen}
      />
      <div className="mt-10 md:mt-20">
        <ProjectsTable
          isOpen={isCreateProjectOpen}
          setIsOpen={setIsCreateProjectOpen}
        />
        <AddProjectModal isOpen={isCreateProjectOpen} onClose={onClose} />
      </div>
    </div>
  );
}
