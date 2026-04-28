"use client";
import UsersPageHeader from "@/components/features/users/UsersPageHeader";
import { useState } from "react";
export default function UsersPage() {
  const [isCreateOpen,setIsCreateOpen] = useState<boolean>(false)
  return (
    <div>
      <UsersPageHeader isOpen={isCreateOpen} setIsOpen={setIsCreateOpen}/>
      {/* <UsersContainer isOpen={isCreateOpen} setIsOpen={setIsCreateOpen}/> */}
    </div>
  );
}