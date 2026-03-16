// Single skill position (nested in skill)
export interface SkillPosition {
  id: string;
  name: string;
}

// Single skill response (from getSkillById)
export interface SingleSkill {
  id: string;
  name: string;
  position: SkillPosition;
  createdAt: string;
  updatedAt: string;
}

// List skill response (from getSkills - same as single in this case)
export interface Skill {
  id: string;
  name: string;
  position: SkillPosition;
  createdAt: string;
  updatedAt: string;
}

// Query parameters for filtering skills
export interface SkillsQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  position?: string; // position id
  skillId?: string; // for single skill queries
}

// API response structure
export interface SkillsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Skill[];
}

// DTO for creating a new skill
export interface CreateSkillDto {
  name: string;
  position: string; // position id
}

// DTO for updating a skill
export interface UpdateSkillDto {
  name?: string;
  position?: string; // position id
}

// Alias for backward compatibility
export type SkillFilters = SkillsQueryParams;
