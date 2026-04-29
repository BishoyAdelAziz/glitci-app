"use client";
import ClientCard from "./ClientCard";
import useClients from "@/hooks/useClients";
import { Dispatch, SetStateAction, useState } from "react";
import AddClient from "./AddClientModal";
import { useSearchParam } from "@/hooks/useSearchParam";
import StackedPagination from "@/components/ui/Pagination";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ClientsContainer({ isOpen, setIsOpen }: Props) {
  const [page, setPage] = useState(1);
  const search = useSearchParam();
  const { clients, error, isError, isLoading, pagination } = useClients({
    name: search,
    page,
  });
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
      <div className="grid grid-cols-1 md:grid-cols-3  items-stretch justify-center gap-x-6 gap-y-12">
        {clients?.map((client) => {
          return <ClientCard client={client} key={client.id} />;
        })}
      </div>
      <div className="w-full flex items-center justify-center mt-[5vh]">
        <StackedPagination
          currentPage={pagination?.currentPage}
          limit={pagination?.limit}
          total={pagination?.totalPages}
          onChange={(page) => setPage(page)}
        />
      </div>
      {isOpen && (
        <AddClient isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
      )}
    </>
  );
}
