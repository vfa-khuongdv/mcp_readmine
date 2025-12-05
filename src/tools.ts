import {
  GetIssuesSchema,
  GetIssueSchema,
  GetProjectsSchema,
  GetProjectSchema,
  GetUsersSchema,
  SearchIssuesSchema,
  GetTimeEntriesSchema,
} from "./types.js";

export const tools = [
  {
    name: "get_issues",
    description:
      "Get a list of Redmine issues/tickets with optional filters. Returns paginated results with issue details including status, priority, assignee, and more.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "Filter issues by project ID",
        },
        status_id: {
          type: ["number", "string"],
          description:
            'Filter by status ID, or use "open", "closed", or "*" for all',
        },
        assigned_to_id: {
          type: "number",
          description: "Filter issues assigned to specific user ID",
        },
        limit: {
          type: "number",
          description: "Number of results to return (1-100, default: 25)",
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
          minimum: 0,
        },
      },
    },
  },
  {
    name: "get_issue",
    description:
      "Get detailed information about a specific Redmine issue/ticket by ID. Includes journals (history), attachments, and relations.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: {
          type: "number",
          description: "The ID of the issue to retrieve",
        },
      },
      required: ["issue_id"],
    },
  },
  {
    name: "get_projects",
    description:
      "Get a list of all Redmine projects. Returns paginated results with project details.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (1-100, default: 25)",
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
          minimum: 0,
        },
      },
    },
  },
  {
    name: "get_project",
    description:
      "Get detailed information about a specific Redmine project by ID.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "The ID of the project to retrieve",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "get_users",
    description:
      "Get a list of Redmine users. Returns paginated results with user details.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "registered", "locked"],
          description: "Filter users by status",
        },
        limit: {
          type: "number",
          description: "Number of results to return (1-100, default: 25)",
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
          minimum: 0,
        },
      },
    },
  },
  {
    name: "search_issues",
    description:
      "Search for Redmine issues/tickets by keyword in the subject field. Returns paginated results.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to match in issue subjects",
        },
        limit: {
          type: "number",
          description: "Number of results to return (1-100, default: 25)",
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
          minimum: 0,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_time_entries",
    description:
      "Get time entries logged in Redmine. Can be filtered by project, user, and date range.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "Filter by project ID",
        },
        user_id: {
          type: "number",
          description: "Filter by user ID",
        },
        from: {
          type: "string",
          description: "Start date in YYYY-MM-DD format",
        },
        to: {
          type: "string",
          description: "End date in YYYY-MM-DD format",
        },
        limit: {
          type: "number",
          description: "Number of results to return (1-100, default: 25)",
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: "number",
          description: "Offset for pagination (default: 0)",
          minimum: 0,
        },
      },
    },
  },
];

// Export schemas for validation
export const toolSchemas = {
  get_issues: GetIssuesSchema,
  get_issue: GetIssueSchema,
  get_projects: GetProjectsSchema,
  get_project: GetProjectSchema,
  get_users: GetUsersSchema,
  search_issues: SearchIssuesSchema,
  get_time_entries: GetTimeEntriesSchema,
};
