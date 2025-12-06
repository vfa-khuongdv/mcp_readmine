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
  CreateIssueParams,
  UpdateIssueParams,
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

  /**
   * Create a new issue
   */
  async createIssue(params: CreateIssueParams): Promise<RedmineIssue> {
    const response = await this.client.post("/issues.json", {
      issue: {
        project_id: params.project_id,
        subject: params.subject,
        description: params.description,
        tracker_id: params.tracker_id,
        status_id: params.status_id,
        priority_id: params.priority_id,
        assigned_to_id: params.assigned_to_id,
        start_date: params.start_date,
        due_date: params.due_date,
        done_ratio: params.done_ratio,
      },
    });
    return response.data.issue;
  }

  /**
   * Update an existing issue
   */
  async updateIssue(
    issueId: number,
    params: Omit<UpdateIssueParams, "issue_id">
  ): Promise<void> {
    // Build issue object, filtering out undefined values
    const issueData: Record<string, any> = {};

    if (params.project_id !== undefined)
      issueData.project_id = params.project_id;
    if (params.subject !== undefined) issueData.subject = params.subject;
    if (params.description !== undefined)
      issueData.description = params.description;
    if (params.tracker_id !== undefined)
      issueData.tracker_id = params.tracker_id;
    if (params.status_id !== undefined) issueData.status_id = params.status_id;
    if (params.priority_id !== undefined)
      issueData.priority_id = params.priority_id;
    if (params.assigned_to_id !== undefined)
      issueData.assigned_to_id = params.assigned_to_id;
    if (params.start_date !== undefined)
      issueData.start_date = params.start_date;
    if (params.due_date !== undefined) issueData.due_date = params.due_date;
    if (params.done_ratio !== undefined)
      issueData.done_ratio = params.done_ratio;
    if (params.notes !== undefined) issueData.notes = params.notes;

    await this.client.put(`/issues/${issueId}.json`, {
      issue: issueData,
    });
  }

  /**
   * Add a comment/note to an issue
   */
  async addComment(issueId: number, notes: string): Promise<void> {
    // Only send notes field, nothing else
    const payload = {
      issue: {
        notes,
      },
    };

    try {
      await this.client.put(`/issues/${issueId}.json`, payload);
    } catch (error: any) {
      // Log detailed error for debugging
      console.error("Error adding comment:", {
        issueId,
        notesLength: notes.length,
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      throw error;
    }
  }
  /**
   * Delete an issue
   */
  async deleteIssue(issueId: number): Promise<void> {
    try {
      await this.client.delete(`/issues/${issueId}.json`);
    } catch (error: any) {
      console.error("Error deleting issue:", {
        issueId,
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      throw error;
    }
  }
}
