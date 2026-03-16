"use client";
import { useState } from "react";
import PageHeader from "@/components/features/projects/PageHeader";
import ProjectsTable from "@/components/features/projects/ProjectsTable";
export default function ProjectsPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
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
      </div>
    </div>
  );
}
