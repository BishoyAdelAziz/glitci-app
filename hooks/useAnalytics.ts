import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview, getStats } from "@/services/api/analytics";
import { AnalyticsQueryParams, CurrencyCode } from "@/types/analytics";
import { useDateFilter } from "@/stores/useDateFilter";

export default function useAnalyticsOverview(currency: CurrencyCode = "USD") {
  const { startDate, endDate } = useDateFilter();

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : null;

  // Build params dynamically
  const from = formatDate(startDate);
  const to = formatDate(endDate);

  const params: AnalyticsQueryParams = {
    currency,
    ...(from && { from }), // Only adds 'from' if it exists
    ...(to && { to }), // Only adds 'to' if it exists
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    // The queryKey changes when params change, triggering a refetch
    queryKey: ["analytics-overview", params],
    queryFn: () => getAnalyticsOverview(params),
    placeholderData: (data) => {
      return data;
    },
    // enabled is now true so it fetches the API defaults when dates are cleared
    enabled: true,
  });

  const { data: statsData } = useQuery({
    queryKey: ["stats", currency],
    queryFn: () => getStats({ currency }),
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
