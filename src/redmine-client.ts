import axios, { AxiosInstance } from "axios";
import type {
  RedmineConfig,
  RedmineIssue,
  RedmineProject,
  RedmineUser,
  RedmineTimeEntry,
  GetIssuesParams,
  GetProjectsParams,
  GetTimeEntriesParams,
} from "./types.js";

export class RedmineClient {
  private client: AxiosInstance;
  private config: RedmineConfig;

  constructor(config: RedmineConfig) {
    this.config = config;

    // Create axios instance with both Basic Auth and API Key
    this.client = axios.create({
      baseURL: `${config.url}/`,
      headers: {
        "Content-Type": "application/json",
        "X-Redmine-API-Key": config.apiKey,
      },
      auth: {
        username: config.username,
        password: config.password,
      },
    });
  }

  /**
   * Get list of issues with optional filters
   */
  async getIssues(
    params: Partial<GetIssuesParams> = {}
  ): Promise<{ issues: RedmineIssue[]; total_count: number }> {
    const response = await this.client.get("/issues.json", {
      params: {
        project_id: params.project_id,
        status_id: params.status_id,
        assigned_to_id: params.assigned_to_id,
        limit: params.limit ?? 25,
        offset: params.offset ?? 0,
      },
    });
    return response.data;
  }

  /**
   * Get a single issue by ID
   */
  async getIssue(issueId: number): Promise<RedmineIssue> {
    const response = await this.client.get(`/issues/${issueId}.json`, {
      params: {
        include: "journals,attachments,relations",
      },
    });
    return response.data.issue;
  }

  /**
   * Get list of projects
   */
  async getProjects(
    params: Partial<GetProjectsParams> = {}
  ): Promise<{ projects: RedmineProject[]; total_count: number }> {
    const response = await this.client.get("/projects.json", {
      params: {
        limit: params.limit ?? 25,
        offset: params.offset ?? 0,
      },
    });
    return response.data;
  }

  /**
   * Get a single project by ID
   */
  async getProject(projectId: number): Promise<RedmineProject> {
    const response = await this.client.get(`/projects/${projectId}.json`);
    return response.data.project;
  }

  /**
   * Get list of users
   */
  async getUsers(
    params: { status?: string; limit?: number; offset?: number } = {}
  ): Promise<{
    users: RedmineUser[];
    total_count: number;
  }> {
    const response = await this.client.get("/users.json", {
      params: {
        status: params.status,
        limit: params.limit || 25,
        offset: params.offset || 0,
      },
    });
    return response.data;
  }

  /**
   * Search issues by text query
   */
  async searchIssues(
    query: string,
    limit: number = 25,
    offset: number = 0
  ): Promise<{
    issues: RedmineIssue[];
    total_count: number;
  }> {
    // Redmine doesn't have a dedicated search endpoint, so we filter by subject
    const response = await this.client.get("/issues.json", {
      params: {
        subject: `~${query}`, // ~ means contains
        limit,
        offset,
      },
    });
    return response.data;
  }

  /**
   * Get time entries
   */
  async getTimeEntries(params: Partial<GetTimeEntriesParams> = {}): Promise<{
    time_entries: RedmineTimeEntry[];
    total_count: number;
  }> {
    const response = await this.client.get("/time_entries.json", {
      params: {
        project_id: params.project_id,
        user_id: params.user_id,
        from: params.from,
        to: params.to,
        limit: params.limit ?? 25,
        offset: params.offset ?? 0,
      },
    });
    return response.data;
  }
}
