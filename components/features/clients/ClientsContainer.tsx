"use client";
import ClientCard from "./ClientCard";
import useClients from "@/hooks/useClients";
import { Dispatch, SetStateAction } from "react";
import AddClient from "./AddClientModal";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ClientsContainer({ isOpen, setIsOpen }: Props) {
  const { clients, error, isError, isLoading, pagination } = useClients();
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  if (isError) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-stretch justify-center gap-x-6 gap-y-12">
        {clients?.map((client) => {
          return <ClientCard client={client} key={client.id} />;
        })}
      </div>
      {isOpen && (
        <AddClient isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
      )}
    </>
  );
}
