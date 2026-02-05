import axiosInstance from "@/lib/axios";
import {
  AnalyticsQueryParams,
  AnalyticsResponse,
  StatsQueryParams,
  StatsResponse,
} from "@/types/analytics";

export const getAnalyticsOverview = async (
  params: AnalyticsQueryParams,
): Promise<AnalyticsResponse> => {
  const response = await axiosInstance.get("/analytics/overview", { params });
  return response.data;
};
export const getStats = async (
  params: StatsQueryParams,
): Promise<StatsResponse> => {
  const response = await axiosInstance.get("/analytics/stats", { params });
  return response.data;
};
