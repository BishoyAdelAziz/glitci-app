"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useSearchParam } from "@/hooks/useSearchParam";
import UseUsers from "@/hooks/useUsers";
import UserCard from "./UserCard";
import AddUserModal from "./AddUserModal";
import { User } from "@/types/user";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function UsersContainer({ isOpen, setIsOpen }: Props) {
  const [page, setPage] = useState(1);
  const [SelectedUser, setSelectedUser] = useState<User>(
    null as unknown as User,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const search = useSearchParam();
  const { Users, UsersError, UsersIsError, UsersIsLoading } = UseUsers();
  const HandleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-center gap-x-6 gap-y-12">
        {Users?.data.map((user: User) => (
          <UserCard
            key={user.id}
            employee={user}
            onDelete={handleDelete}
            onEdit={HandleEdit}
          />
        ))}
      </div>
      <AddUserModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <EditUserModal
        key={SelectedUser?.id}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        user={SelectedUser}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        user={SelectedUser}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
