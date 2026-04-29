"use client";
import UsersContainer from "@/components/features/users/UsersContainer";
import UsersPageHeader from "@/components/features/users/UsersPageHeader";
import { useState } from "react";
export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  return (
    <div>
      <UsersPageHeader isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      <div className="mt-20">
        <UsersContainer isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      </div>
    </div>
  );
}
