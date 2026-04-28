"use client";
import AddPositionModal from "@/components/features/positions/AddPositionModal";
import PositionsPageHeader from "@/components/features/positions/PositionsPageHeader";
import PositionsTable from "@/components/features/positions/PositionsTable";
import { useState } from "react";

export default function PositionsView() {
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
        <AddPositionModal
          isOpen={isCreatePositionOpen}
          setIsOpen={setIsCreatePositionOpen}
        />
      </div>
    </div>
  );
}
