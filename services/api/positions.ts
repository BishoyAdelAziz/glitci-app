import axiosInstance from "@/lib/axios";
import {
  PositionsQueryParams,
  PositionsResponse,
  SinglePosition,
} from "@/types/positions";
import { EditPositionFormFields } from "../validations/positions";
import { AddSkillFormFIelds } from "../validations/skill";

// Get all positions with optional filters
export const getPositions = async (
  params?: PositionsQueryParams,
): Promise<PositionsResponse> => {
  const response = await axiosInstance.get("/positions", { params });
  return response.data;
};

// Get single position by ID
export const getSinglePosition = async (
  positionId?: string,
): Promise<SinglePosition> => {
  if (!positionId) throw new Error("Position ID is required");
  const response = await axiosInstance.get(`/positions/${positionId}`);
  return response.data;
};

// Create a new position
export const createPosition = async (
  data: AddSkillFormFIelds,
): Promise<SinglePosition> => {
  const response = await axiosInstance.post("/positions", data);
  return response.data;
};

// Update an existing position
export const updatePosition = async (
  positionId: string,
  data: EditPositionFormFields,
) => {
  const response = await axiosInstance.patch(`/positions/${positionId}`, data);
  return response.data;
};

// Delete a position
export const deletePosition = async (positionId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/positions/${positionId}`);
  return response.data;
};
