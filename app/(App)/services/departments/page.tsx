"use client";
import { useState } from "react";
import DepartmentPageHeader from "@/components/features/departments/PageHeader";
import DepartmentsTable from "@/components/features/departments/DepartmentsTable";
export default function DepartmentsPage() {
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] =
    useState<boolean>(false);
  return (
    <div>
      <DepartmentPageHeader
        isOpen={isCreateDepartmentOpen}
        setIsOpen={setIsCreateDepartmentOpen}
      />
      <div className="mt-20">
        <DepartmentsTable
          isOpen={isCreateDepartmentOpen}
          setIsOpen={setIsCreateDepartmentOpen}
        />
      </div>
    </div>
  );
}
