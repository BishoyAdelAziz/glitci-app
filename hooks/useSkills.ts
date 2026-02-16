import {
  getSkills,
  getSingleSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/services/api/skills";
import { SkillsQueryParams } from "@/types/skills";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useSkills(params?: SkillsQueryParams) {
  const queryClient = useQueryClient();

  // Get all skills
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["skills", params],
    queryFn: () => getSkills(params),
  });

  // Get single skill
  const {
    data: singleSkill,
    isPending: singleSkillIsPending,
    isError: singleSkillIsError,
    error: singleSkillError,
  } = useQuery({
    queryKey: ["skill", params?.skillId],
    queryFn: () => getSingleSkill(params?.skillId),
    enabled: !!params?.skillId,
  });

  // Create skill mutation
  const {
    mutate: createSkillMutation,
    isPending: createSkillIsPending,
    isError: createSkillIsError,
    error: createSkillError,
  } = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  // Update skill mutation
  const {
    mutate: updateSkillMutation,
    isPending: updateSkillIsPending,
    isError: updateSkillIsError,
    error: updateSkillError,
  } = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", params?.skillId] });
    },
  });

  // Delete skill mutation
  const {
    mutate: deleteSkillMutation,
    isPending: deleteSkillIsPending,
    isError: deleteSkillIsError,
    error: deleteSkillError,
  } = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  return {
    // List data
    skills: data?.data,
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

    // Single skill
    singleSkill,
    singleSkillIsPending,
    singleSkillIsError,
    singleSkillError,

    // Create mutation
    createSkillMutation,
    createSkillIsPending,
    createSkillIsError,
    createSkillError,

    // Update mutation
    updateSkillMutation,
    updateSkillIsPending,
    updateSkillIsError,
    updateSkillError,

    // Delete mutation
    deleteSkillMutation,
    deleteSkillIsPending,
    deleteSkillIsError,
    deleteSkillError,
  };
}