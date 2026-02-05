import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview, getStats } from "@/services/api/analytics";
import { AnalyticsQueryParams, CurrencyCode } from "@/types/analytics";
import { useDateFilter } from "@/stores/useDateFilter";

export default function useAnalyticsOverview(currency: CurrencyCode = "USD") {
  const { startDate, endDate } = useDateFilter();

  // Helper to format Date object to YYYY-MM-DD
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  const params: AnalyticsQueryParams = {
    from: formatDate(startDate),
    to: formatDate(endDate),
    currency,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    // Important: QueryKey includes params so it refetches when dates change
    queryKey: ["analytics-overview", params],
    queryFn: () => getAnalyticsOverview(params),
    enabled: !!params.from && !!params.to, // Only fetch if dates are valid
  });
  const { data: statsData } = useQuery({
    queryKey: ["stats", params?.currency],
    queryFn: () =>
      getStats({
        currency: params?.currency,
      }),
  });

  return {
    overview: data?.data,
    isLoading,
    isError,
    error,
    refetch,
    statsData,
  };
}
