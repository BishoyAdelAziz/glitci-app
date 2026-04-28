import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "@/services/api/assets";
import type {
  AssetsQueryParams,
  CreateAssetPayload,
  UpdateAssetPayload,
} from "@/types/assets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useAssets(params?: AssetsQueryParams) {
  const queryClient = useQueryClient();

  // ─── Get Assets ─────────────────────────────────────────────────────────────────

  const {
    data: assetsData,
    isPending: assetsIsPending,
    isError: assetsIsError,
    error: assetsError,
    refetch: refetchAssets,
  } = useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAssets(params),
    placeholderData: (prev) => prev,
  });

  // ─── Create ──────────────────────────────────────────────────────────────────────

  const {
    mutate: createAssetMutation,
    isPending: createAssetIsPending,
    isError: createAssetIsError,
    error: createAssetError,
  } = useMutation({
    mutationFn: (data: CreateAssetPayload) => createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  // ─── Update ──────────────────────────────────────────────────────────────────────

  const {
    mutate: updateAssetMutation,
    isPending: updateAssetIsPending,
    isError: updateAssetIsError,
    error: updateAssetError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssetPayload }) =>
      updateAsset({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  // ─── Delete ──────────────────────────────────────────────────────────────────────

  const {
    mutate: deleteAssetMutation,
    isPending: deleteAssetIsPending,
    isError: deleteAssetIsError,
    error: deleteAssetError,
  } = useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  return {
    assets: assetsData?.data ?? [],
    assetsIsPending,
    assetsIsError,
    assetsError,
    refetchAssets,
    // Create
    createAssetMutation,
    createAssetIsPending,
    createAssetIsError,
    createAssetError,
    // Update
    updateAssetMutation,
    updateAssetIsPending,
    updateAssetIsError,
    updateAssetError,
    // Delete
    deleteAssetMutation,
    deleteAssetIsPending,
    deleteAssetIsError,
    deleteAssetError,
  };
}
