import axios, { type AxiosInstance } from "axios";
import type {
  CreateIssueParams,
  GetIssuesParams,
  GetProjectsParams,
  GetTimeEntriesParams,
  LogTimeParams,
  RedmineConfig,
  RedmineIssue,
  RedmineProject,
  RedmineTimeEntry,
  RedmineUser,
  RedmineVersion,
  TimeEntryActivity,
  UpdateIssueParams,
} from "./types.js";

export class RedmineClient {
  private client: AxiosInstance;

  constructor(config: RedmineConfig) {
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
   * Get list of project versions
   */
  async getProjectVersions(projectId: number): Promise<{
    versions: RedmineVersion[];
    total_count: number;
  }> {
    const response = await this.client.get(
      `/projects/${projectId}/versions.json`
    );
    return {
      versions: response.data.versions,
      total_count: response.data.versions.length,
    };
  }

  /**
   * Get list of users in a specific project
   */
  async getUsers(params: {
    project_id: number;
    limit?: number;
    offset?: number;
  }): Promise<{
    users: RedmineUser[];
    total_count: number;
  }> {
    if (!params.project_id) {
      throw new Error("project_id is required");
    }

    try {
      const response = await this.client.get(
        `/projects/${params.project_id}/memberships.json`,
        {
          params: {
            limit: params.limit || 25,
            offset: params.offset || 0,
          },
        }
      );

      // Transform memberships to users format
      const users = response.data.memberships.map((membership: any) => ({
        id: membership.user.id,
        login: membership.user.login,
        firstname: membership.user.firstname,
        lastname: membership.user.lastname,
        name: membership.user.name,
        mail: membership.user.mail,
        roles: membership.roles,
      }));

      return {
        users,
        total_count: response.data.total_count,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Project with ID ${params.project_id} not found`);
      }
      throw error;
    }
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
        fixed_version_id: params.fixed_version_id,
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
    if (params.fixed_version_id !== undefined)
      issueData.fixed_version_id = params.fixed_version_id;
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

  /**
   * Log time entry
   */
  async logTime(params: LogTimeParams): Promise<RedmineTimeEntry> {
    const response = await this.client.post("/time_entries.json", {
      time_entry: {
        issue_id: params.issue_id,
        project_id: params.project_id,
        hours: params.hours,
        activity_id: params.activity_id,
        comments: params.comments,
        spent_on: params.spent_on,
      },
    });
    return response.data.time_entry;
  }

  /**
   * Get time entry activities

   */
  async getTimeEntryActivities(): Promise<{
    time_entry_activities: TimeEntryActivity[];
  }> {
    const response = await this.client.get(
      "/enumerations/time_entry_activities.json"
    );
    return response.data;
  }
}
