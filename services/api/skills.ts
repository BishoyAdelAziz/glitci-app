import axiosInstance from "@/lib/axios";
import {
  SkillsQueryParams,
  SkillsResponse,
  SingleSkill,
  CreateSkillDto,
  UpdateSkillDto,
} from "@/types/skills";

// Get all skills with optional filters
export const getSkills = async (
  params?: SkillsQueryParams
): Promise<SkillsResponse> => {
  const response = await axiosInstance.get("/skills", { params });
  return response.data;
};

// Get single skill by ID
export const getSingleSkill = async (
  skillId?: string
): Promise<SingleSkill> => {
  if (!skillId) throw new Error("Skill ID is required");
  const response = await axiosInstance.get(`/skills/${skillId}`);
  return response.data;
};

// Create a new skill
export const createSkill = async (
  data: CreateSkillDto
): Promise<SingleSkill> => {
  const response = await axiosInstance.post("/skills", data);
  return response.data;
};

// Update an existing skill
export const updateSkill = async ({
  data,
  skillId,
}: {
  data: UpdateSkillDto;
  skillId: string;
}): Promise<SingleSkill> => {
  const response = await axiosInstance.patch(`/skills/${skillId}`, data);
  return response.data;
};

// Delete a skill
export const deleteSkill = async (skillId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/skills/${skillId}`);
  return response.data;
};