"use client";
import { Suspense, useState } from "react";
import DepartmentPageHeader from "@/components/features/departments/PageHeader";
import DepartmentsTable from "@/components/features/departments/DepartmentsTable";

function DepartmentsContent() {
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

export default function DepartmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B72D2D]"></div>
        </div>
      }
    >
      <DepartmentsContent />
    </Suspense>
  );
}
