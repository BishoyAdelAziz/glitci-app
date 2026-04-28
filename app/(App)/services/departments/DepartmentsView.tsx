// DepartmentsView.tsx
"use client";
import { useState } from "react";
import DepartmentPageHeader from "@/components/features/departments/PageHeader";
import DepartmentsTable from "@/components/features/departments/DepartmentsTable";
import AddDepartmentModal from "@/components/features/departments/AddDepartmentModal";

export default function DepartmentsView() {
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);

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

      <AddDepartmentModal
        isOpen={isCreateDepartmentOpen}
        setIsOpen={setIsCreateDepartmentOpen}
      />
    </div>
  );
}
