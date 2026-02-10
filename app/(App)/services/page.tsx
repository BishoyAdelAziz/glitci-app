"use client";
import PageHeader from "@/components/features/services/PageHeader";
import ServicesTable from "@/components/features/services/ServicesTable";
import { useState } from "react";

export default function ServicesPage() {
  const [isCreateServiceOpen, setIsCreateServiceOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PageHeader
        isOpen={isCreateServiceOpen}
        setIsOpen={setIsCreateServiceOpen}
      />
      <div className="mt-20">
        <ServicesTable
          isOpen={isCreateServiceOpen}
          setIsOpen={setIsCreateServiceOpen}
        />
      </div>
    </div>
  );
}
