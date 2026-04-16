import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/services/api/projects";
import { ParamValue } from "next/dist/server/request/params";
export function useProject(id?: string | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
