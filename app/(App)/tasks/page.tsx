"use client";

import TasksPageHeader from "@/components/features/tasks/TasksPageHeader";
import TasksContainer from "@/components/features/tasks/TasksContainer";
import { useState } from "react";

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  return (
    <div>
      <TasksPageHeader isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      <div className="mt-10">
        <TasksContainer isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      </div>
    </div>
  );
}
