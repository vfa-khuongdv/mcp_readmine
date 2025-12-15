import { describe, it, expect, vi, beforeEach } from "vitest";
import { RedmineClient } from "../src/redmine-client.js";
import axios from "axios";

vi.mock("axios");

describe("RedmineClient", () => {
  const mockConfig = {
    url: "https://redmine.example.com",
    apiKey: "test-api-key",
    username: "test-user",
    password: "test-password",
  };

  let client: RedmineClient;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    (axios.create as any).mockReturnValue(mockAxios);
    client = new RedmineClient(mockConfig);
  });

  describe("getIssues", () => {
    it("should fetch issues with default parameters", async () => {
      const mockResponse = {
        data: {
          issues: [{ id: 1, subject: "Test Issue" }],
          total_count: 1,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getIssues();

      expect(mockAxios.get).toHaveBeenCalledWith("/issues.json", {
        params: {
          limit: 25,
          offset: 0,
          project_id: undefined,
          status_id: undefined,
          assigned_to_id: undefined,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch issues with custom parameters", async () => {
      const mockResponse = {
        data: {
          issues: [],
          total_count: 0,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      await client.getIssues({
        project_id: 1,
        status_id: "open",
        limit: 10,
      });

      expect(mockAxios.get).toHaveBeenCalledWith("/issues.json", {
        params: {
          limit: 10,
          offset: 0,
          project_id: 1,
          status_id: "open",
          assigned_to_id: undefined,
        },
      });
    });
  });

  describe("getIssue", () => {
    it("should fetch a single issue by ID", async () => {
      const mockResponse = {
        data: {
          issue: { id: 1, subject: "Test Issue" },
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getIssue(1);

      expect(mockAxios.get).toHaveBeenCalledWith("/issues/1.json", {
        params: {
          include: "journals,attachments,relations",
        },
      });
      expect(result).toEqual(mockResponse.data.issue);
    });
  });

  describe("createIssue", () => {
    it("should create an issue", async () => {
      const mockResponse = {
        data: {
          issue: { id: 1, subject: "New Issue" },
        },
      };
      mockAxios.post.mockResolvedValue(mockResponse);

      const params = {
        project_id: 1,
        subject: "New Issue",
        description: "Description",
      };

      const result = await client.createIssue(params);

      expect(mockAxios.post).toHaveBeenCalledWith("/issues.json", {
        issue: params,
      });
      expect(result).toEqual(mockResponse.data.issue);
    });
  });

  describe("updateIssue", () => {
    it("should update an issue", async () => {
      mockAxios.put.mockResolvedValue({ data: {} });

      const params = {
        subject: "Updated Subject",
        notes: "Updated note",
      };

      await client.updateIssue(1, params);

      expect(mockAxios.put).toHaveBeenCalledWith("/issues/1.json", {
        issue: params,
      });
    });
  });

  describe("deleteIssue", () => {
    it("should delete an issue", async () => {
      mockAxios.delete.mockResolvedValue({ data: {} });

      await client.deleteIssue(1);

      expect(mockAxios.delete).toHaveBeenCalledWith("/issues/1.json");
    });
  });

  describe("getProjects", () => {
    it("should fetch projects", async () => {
      const mockResponse = {
        data: {
          projects: [{ id: 1, name: "Test Project" }],
          total_count: 1,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getProjects();

      expect(mockAxios.get).toHaveBeenCalledWith("/projects.json", {
        params: { limit: 25, offset: 0 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getProject", () => {
    it("should fetch a single project", async () => {
      const mockResponse = {
        data: {
          project: { id: 1, name: "Test Project" },
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getProject(1);

      expect(mockAxios.get).toHaveBeenCalledWith("/projects/1.json");
      expect(result).toEqual(mockResponse.data.project);
    });
  });

  describe("getProjectVersions", () => {
    it("should fetch project versions", async () => {
      const mockResponse = {
        data: {
          versions: [{ id: 1, name: "v1.0" }],
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getProjectVersions(1);

      expect(mockAxios.get).toHaveBeenCalledWith("/projects/1/versions.json");
      expect(result).toEqual({
        versions: mockResponse.data.versions,
        total_count: 1,
      });
    });
  });

  describe("getUsers", () => {
    it("should fetch project members", async () => {
      const mockResponse = {
        data: {
          memberships: [
            {
              user: {
                id: 1,
                login: "user1",
                firstname: "User",
                lastname: "One",
                name: "User One",
                mail: "user1@example.com",
              },
              roles: [{ id: 1, name: "Developer" }],
            },
          ],
          total_count: 1,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getUsers({ project_id: 1 });

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/projects/1/memberships.json",
        {
          params: { limit: 25, offset: 0 },
        }
      );
      expect(result.users[0].id).toBe(1);
      expect((result.users[0] as any).roles).toHaveLength(1);
    });

    it("should throw error if project_id is missing", async () => {
      await expect(client.getUsers({} as any)).rejects.toThrow(
        "project_id is required"
      );
    });
  });

  describe("searchIssues", () => {
    it("should search issues by query", async () => {
      const mockResponse = {
        data: {
          issues: [{ id: 1, subject: "Found Issue" }],
          total_count: 1,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.searchIssues("Found");

      expect(mockAxios.get).toHaveBeenCalledWith("/issues.json", {
        params: { subject: "~Found", limit: 25, offset: 0 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getTimeEntries", () => {
    it("should fetch time entries", async () => {
      const mockResponse = {
        data: {
          time_entries: [{ id: 1, hours: 2.5 }],
          total_count: 1,
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getTimeEntries({ project_id: 1 });

      expect(mockAxios.get).toHaveBeenCalledWith("/time_entries.json", {
        params: {
          project_id: 1,
          user_id: undefined,
          from: undefined,
          to: undefined,
          limit: 25,
          offset: 0,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("addComment", () => {
    it("should add a comment to an issue", async () => {
      mockAxios.put.mockResolvedValue({ data: {} });

      await client.addComment(1, "New comment");

      expect(mockAxios.put).toHaveBeenCalledWith("/issues/1.json", {
        issue: { notes: "New comment" },
      });
    });
  });

  describe("logTime", () => {
    it("should log time for an issue", async () => {
      const mockResponse = {
        data: {
          time_entry: { id: 1, hours: 4 },
        },
      };
      mockAxios.post.mockResolvedValue(mockResponse);

      const params = {
        issue_id: 1,
        hours: 4,
        activity_id: 1,
        comments: "Dev work",
        spent_on: "2023-10-27",
      };

      const result = await client.logTime(params);

      expect(mockAxios.post).toHaveBeenCalledWith("/time_entries.json", {
        time_entry: params,
      });
      expect(result).toEqual(mockResponse.data.time_entry);
    });
  });

  describe("getTimeEntryActivities", () => {
    it("should fetch time entry activities", async () => {
      const mockResponse = {
        data: {
          time_entry_activities: [{ id: 1, name: "Design" }],
        },
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getTimeEntryActivities();

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/enumerations/time_entry_activities.json"
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
