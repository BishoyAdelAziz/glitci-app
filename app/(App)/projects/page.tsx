"use client";
import PageHeader from "@/components/features/projects/PageHeader";
import ProjectsTable from "@/components/features/projects/ProjectsTable";
import { useState } from "react";
export default function ProjectsPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PageHeader
        isOpen={isCreateProjectOpen}
        setIsOpen={setIsCreateProjectOpen}
      />
      <div className="mt-20">
        <ProjectsTable
          isOpen={isCreateProjectOpen}
          setIsOpen={setIsCreateProjectOpen}
        />
      </div>
    </div>
  );
}
