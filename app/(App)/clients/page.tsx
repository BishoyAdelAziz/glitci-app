"use client";
import { useState } from "react";
import PageHeader from "@/components/features/clients/PageHeader";
import ClientsContainer from "@/components/features/clients/ClientsContainer";

export default function ClientsPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PageHeader
        isOpen={isCreateProjectOpen}
        setIsOpen={setIsCreateProjectOpen}
      />
      <div className="mt-20">
        <ClientsContainer
          isOpen={isCreateProjectOpen}
          setIsOpen={setIsCreateProjectOpen}
        />
      </div>
    </div>
  );
}
