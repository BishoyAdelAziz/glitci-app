import axiosInstance from "@/lib/axios";
import type {
  AssetsQueryParams,
  AssetsResponse,
  CreateAssetPayload,
  UpdateAssetPayload,
  AssetResponse,
  DeleteAssetResponse,
} from "@/types/assets";

// ─── Get Assets ──────────────────────────────────────────────────────────────────

export const getAssets = async (
  params?: AssetsQueryParams,
): Promise<AssetsResponse> => {
  const response = await axiosInstance.get("/assets", { params });
  return response.data;
};

// ─── Create Asset ────────────────────────────────────────────────────────────────

export const createAsset = async (
  data: CreateAssetPayload,
): Promise<AssetResponse> => {
  const response = await axiosInstance.post("/assets", data);
  return response.data;
};

// ─── Update Asset ────────────────────────────────────────────────────────────────

export const updateAsset = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateAssetPayload;
}): Promise<AssetResponse> => {
  const response = await axiosInstance.patch(`/assets/${id}`, data);
  return response.data;
};

// ─── Delete Asset ────────────────────────────────────────────────────────────────

export const deleteAsset = async (id: string): Promise<DeleteAssetResponse> => {
  const response = await axiosInstance.delete(`/assets/${id}`);
  return response.data;
};
