import { z } from "zod";

// Configuration
export interface RedmineConfig {
  url: string;
  apiKey: string;
  username: string;
  password: string;
}

// Redmine API Response Types
export interface RedmineIssue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  subject: string;
  description: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
}

export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  is_public: boolean;
  created_on: string;
  updated_on: string;
}

export interface RedmineUser {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on?: string;
}

export interface RedmineTimeEntry {
  id: number;
  project: {
    id: number;
    name: string;
  };
  issue?: {
    id: number;
  };
  user: {
    id: number;
    name: string;
  };
  activity: {
    id: number;
    name: string;
  };
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
}

// Zod Schemas for MCP Tool Input Validation
export const GetIssuesSchema = z.object({
  project_id: z.number().optional(),
  status_id: z
    .union([z.number(), z.literal("open"), z.literal("closed"), z.literal("*")])
    .optional(),
  assigned_to_id: z.number().optional(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export const GetIssueSchema = z.object({
  issue_id: z.number(),
});

export const GetProjectsSchema = z.object({
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export const GetProjectSchema = z.object({
  project_id: z.number(),
});

export const GetUsersSchema = z.object({
  status: z.enum(["active", "registered", "locked"]).optional(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export const SearchIssuesSchema = z.object({
  query: z.string(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export const GetTimeEntriesSchema = z.object({
  project_id: z.number().optional(),
  user_id: z.number().optional(),
  from: z.string().optional(), // YYYY-MM-DD
  to: z.string().optional(), // YYYY-MM-DD
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export const CreateIssueSchema = z.object({
  project_id: z.number(),
  subject: z.string(),
  description: z.string().optional(),
  tracker_id: z.number().optional(),
  status_id: z.number().optional(),
  priority_id: z.number().optional(),
  assigned_to_id: z.number().optional(),
  start_date: z.string().optional(), // YYYY-MM-DD
  due_date: z.string().optional(), // YYYY-MM-DD
  done_ratio: z.number().min(0).max(100).optional(), // 0-100%
});

export const UpdateIssueSchema = z.object({
  issue_id: z.number(),
  project_id: z.number().optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  tracker_id: z.number().optional(),
  status_id: z.number().optional(),
  priority_id: z.number().optional(),
  assigned_to_id: z.number().optional(),
  start_date: z.string().optional(), // YYYY-MM-DD
  due_date: z.string().optional(), // YYYY-MM-DD
  done_ratio: z.number().min(0).max(100).optional(), // 0-100%
  notes: z.string().optional(), // Update notes/comments
});

export const AddCommentSchema = z.object({
  issue_id: z.number(),
  notes: z.string(),
});

export const DeleteIssueSchema = z.object({
  issue_id: z.number(),
});

export type GetIssuesParams = z.infer<typeof GetIssuesSchema>;
export type GetIssueParams = z.infer<typeof GetIssueSchema>;
export type GetProjectsParams = z.infer<typeof GetProjectsSchema>;
export type GetProjectParams = z.infer<typeof GetProjectSchema>;
export type GetUsersParams = z.infer<typeof GetUsersSchema>;
export type SearchIssuesParams = z.infer<typeof SearchIssuesSchema>;
export type GetTimeEntriesParams = z.infer<typeof GetTimeEntriesSchema>;
export type CreateIssueParams = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueParams = z.infer<typeof UpdateIssueSchema>;
export type AddCommentParams = z.infer<typeof AddCommentSchema>;
export type DeleteIssueParams = z.infer<typeof DeleteIssueSchema>;
