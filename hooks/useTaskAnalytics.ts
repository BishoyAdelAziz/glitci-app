import { getTaskAnalytics } from "@/services/api/tasks";
import type { AnalyticsQueryParams } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";

export default function useTaskAnalytics(params?: AnalyticsQueryParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["taskAnalytics", params],
    queryFn: () => getTaskAnalytics(params),
    placeholderData: (prev) => prev,
  });

  return {
    analytics: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
