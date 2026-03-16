"use client";
import PositionsPageHeader from "@/components/features/positions/PositionsPageHeader";
import PositionsTable from "@/components/features/positions/PositionsTable";
import { useState } from "react";
export default function PositionsPage() {
  const [isCreatePositionOpen, setIsCreatePositionOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PositionsPageHeader
        isOpen={isCreatePositionOpen}
        setIsOpen={setIsCreatePositionOpen}
      />
      <div className="mt-10">
        <PositionsTable
          isOpen={isCreatePositionOpen}
          setIsOpen={setIsCreatePositionOpen}
        />
      </div>
    </div>
  );
}
