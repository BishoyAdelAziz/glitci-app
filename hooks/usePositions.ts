import {
  getPositions,
  getSinglePosition,
  createPosition,
  updatePosition,
  deletePosition,
} from "@/services/api/positions";
import { AddPositionFormFields } from "@/services/validations/positions";
import { PositionsQueryParams } from "@/types/positions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePositions(params?: PositionsQueryParams) {
  const queryClient = useQueryClient();

  // Get all positions
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["positions", params],
    queryFn: () => getPositions(params),
    placeholderData: (data) => {
      return data;
    },
  });

  // Get single position
  const {
    data: singlePosition,
    isPending: singlePositionIsPending,
    isError: singlePositionIsError,
    error: singlePositionError,
  } = useQuery({
    queryKey: ["position", params?.positionId],
    queryFn: () => getSinglePosition(params?.positionId),
    enabled: !!params?.positionId,
    placeholderData: (data) => {
      return data;
    },
  });

  // Create position mutation
  const {
    mutate: createPositionMutation,
    isPending: createPositionIsPending,
    isError: createPositionIsError,
    error: createPositionError,
  } = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  const {
    mutate: updatePositionMutation,
    isPending: updatePositionIsPending,
    isError: updatePositionIsError,
    error: updatePositionError,
  } = useMutation({
    mutationFn: ({
      positionId,
      data,
    }: {
      positionId: string;
      data: AddPositionFormFields;
    }) => updatePosition(positionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({
        queryKey: ["position", params?.positionId],
      });
    },
  });

  // Delete position mutation
  const {
    mutate: deletePositionMutation,
    isPending: deletePositionIsPending,
    isError: deletePositionIsError,
    error: deletePositionError,
  } = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  return {
    // List data
    positions: data?.data,
    pagination: data
      ? {
          totalPages: data.totalPages,
          currentPage: data.page,
          limit: data.limit,
          results: data.results,
        }
      : undefined,
    isLoading,
    isError,
    error,
    refetch,

    // Single position
    // singlePosition,
    // singlePositionIsPending,
    // singlePositionIsError,
    // singlePositionError,

    // Create mutation
    createPositionMutation,
    createPositionIsPending,
    createPositionIsError,
    createPositionError,

    // Update mutation
    updatePositionMutation,
    updatePositionIsPending,
    updatePositionIsError,
    updatePositionError,

    // Delete mutation
    deletePositionMutation,
    deletePositionIsPending,
    deletePositionIsError,
    deletePositionError,
  };
}
