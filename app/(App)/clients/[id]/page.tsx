"use client";

import ClientProjectsTable from "@/components/features/clients/singleClient/ClientProjectsTable";
import ClientTransactionsTable from "@/components/features/clients/singleClient/ClientTransactionsTable";
import ClientMeta from "@/components/features/clients/singleClient/SingleClientMetaData";
import ProjectsTable from "@/components/features/projects/ProjectsTable";
import { useClientPaymentsHistory } from "@/hooks/useClientPaymentHistory";
import useClients from "@/hooks/useClients";
import useProjects from "@/hooks/useProjects";
import { SingleProject } from "@/types/projects";
import { useParams } from "next/navigation";

const STATUS_DOT: Record<SingleProject["status"], string> = {
  planning: "bg-blue-500",
  active: "bg-green-600",
  on_hold: "bg-yellow-500",
  completed: "bg-gray-400",
};

export default function SingleClientPage() {
  const { id: clientId } = useParams();

  // ✅ Client
  const {
    singleClient,
    singleClientError,
    SingleCLientIsError,
    SingleClientIsPending,
  } = useClients({ clientId });

  // ✅ Projects
  const { projects } = useProjects({ client: clientId });

  // ✅ Extract project IDs safely
  const projectIds = projects?.map((project) => project.id) ?? [];

  // ✅ NEW HOOK (already flattened 🔥)
  const { transactions, isLoading: transactionsLoading } =
    useClientPaymentsHistory(projectIds);

  const dotColor = STATUS_DOT["active"] ?? "bg-gray-400";

  // ✅ Loading state
  if (SingleClientIsPending) {
    return <div className="p-6">Loading client...</div>;
  }

  // ✅ Error state
  if (SingleCLientIsError) {
    return (
      <div className="p-6 text-red-500">
        Error: {singleClientError?.message}
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-[2vh] items-start justify-start w-full">
        {/* Header */}
        <div className="flex items-center justify-start w-full gap-1">
          <div
            title={"active"}
            className={`w-3 h-3 rounded-full ${dotColor}`}
          />
          <h1 className="text-2xl font-bold">{singleClient?.data.name}</h1>
          <span className="text-sm font-semibold text-gray-600">
            @{singleClient?.data.industry}
          </span>
        </div>

        {/* Notes */}
        <p className="text-gray-400 font-poppins font-medium">
          {singleClient?.data.notes}
        </p>

        {/* Meta */}
        <ClientMeta
          clientName={singleClient?.data.name as string}
          companyName={singleClient?.data.companyName as string}
          endDate="2023-12-31"
          startDate={singleClient?.data.createdAt as string}
          phones={singleClient?.data?.phones}
          industry={singleClient?.data.industry as string}
        />

        {/* Projects */}
        <ProjectsTable clientId={clientId} />

        {/* Transactions */}
        {/* Transactions */}
        {transactionsLoading ? (
          <div className="p-4">Loading transactions...</div>
        ) : (
          <ClientTransactionsTable data={transactions} />
        )}
      </div>
    </section>
  );
}
