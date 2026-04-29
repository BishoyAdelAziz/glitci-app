"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useSearchParam } from "@/hooks/useSearchParam";
import UseUsers from "@/hooks/useUsers";
import UserCard from "./UserCard";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function UsersContainer({ isOpen, setIsOpen }: Props) {
  const [page, setPage] = useState(1);
  const search = useSearchParam();
  const { Users, UsersError, UsersIsError, UsersIsLoading } = UseUsers();
  if (UsersIsLoading) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  if (UsersIsError) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading projects. Please try again.
        </div>
      </div>
    );
  }
  console.log(Users.data);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-x-6 gap-y-12">
        {Users.data.map((user) => (
          <UserCard employee={user} onDelete={() => {}} onEdit={() => {}} />
        ))}
      </div>
    </>
  );
}
