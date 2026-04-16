import { ClientPaymentHistory } from "@/services/api/transactions";
import { useQueries } from "@tanstack/react-query";

export function useTransactionsByProjects(projectIds: string[] = []) {
  const queries = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: ["transactions", projectId],

      queryFn: async () => {
        try {
          const res = await ClientPaymentHistory(projectId);

          return res?.data?.data ?? []; // ✅ ALWAYS return array
        } catch (err) {
          console.error("Transactions error:", err);
          return []; // ✅ fallback
        }
      },

      enabled: !!projectId, // ✅ prevents bad calls

      staleTime: 1000 * 60 * 5, // ✅ prevents refetch loop
    })),
  });

  const data = queries.reduce<Record<string, any>>((acc, query, i) => {
    if (!query.data) return acc;

    const projectId = projectIds[i];
    acc[projectId] = query.data;

    return acc;
  }, {});

  return {
    transactionsByProject: data,
    isLoading: queries.some((q) => q.isPending),
    isError: queries.some((q) => q.isError),
  };
}
