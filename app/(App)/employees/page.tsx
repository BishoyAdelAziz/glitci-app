"use client";
import EmployeesCOntainer from "@/components/features/employees/EmployeesContainer";
import PageHeader from "@/components/features/employees/PageHeader";
import { useState } from "react";

export default function EmployeesPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PageHeader
        isOpen={isCreateProjectOpen}
        setIsOpen={setIsCreateProjectOpen}
      />
      <div className="mt-20">
        <EmployeesCOntainer
          isOpen={isCreateProjectOpen}
          setIsOpen={setIsCreateProjectOpen}
        />
      </div>
    </div>
  );
}
