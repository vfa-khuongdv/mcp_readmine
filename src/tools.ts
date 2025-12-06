import {
  GetIssuesSchema,
  GetIssueSchema,
  GetProjectsSchema,
  GetProjectSchema,
  GetUsersSchema,
  SearchIssuesSchema,
  GetTimeEntriesSchema,
  CreateIssueSchema,
  UpdateIssueSchema,
  AddCommentSchema,
  DeleteIssueSchema,
  LogTimeSchema,
  GetTimeEntryActivitiesSchema,
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
  {
    name: "create_issue",
    description:
      "Create a new issue/ticket in Redmine. Returns the created issue with its ID and details.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "The ID of the project to create the issue in",
        },
        subject: {
          type: "string",
          description: "The title/subject of the issue",
        },
        description: {
          type: "string",
          description: "Detailed description of the issue",
        },
        tracker_id: {
          type: "number",
          description: "The tracker type ID (e.g., Bug, Feature, Support)",
        },
        status_id: {
          type: "number",
          description: "The status ID (e.g., New, In Progress, Resolved)",
        },
        priority_id: {
          type: "number",
          description: "The priority ID (e.g., Low, Normal, High, Urgent)",
        },
        assigned_to_id: {
          type: "number",
          description: "The user ID to assign the issue to",
        },
        start_date: {
          type: "string",
          description: "Start date in YYYY-MM-DD format",
        },
        due_date: {
          type: "string",
          description: "Due date in YYYY-MM-DD format",
        },
        done_ratio: {
          type: "number",
          description: "Percentage of completion (0-100)",
        },
      },
      required: ["project_id", "subject"],
    },
  },
  {
    name: "update_issue",
    description:
      "Update an existing Redmine issue/ticket. Only provided fields will be updated.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: {
          type: "number",
          description: "The ID of the issue to update",
        },
        project_id: {
          type: "number",
          description: "Move issue to a different project",
        },
        subject: {
          type: "string",
          description: "Update the title/subject of the issue",
        },
        description: {
          type: "string",
          description: "Update the detailed description",
        },
        tracker_id: {
          type: "number",
          description: "Change the tracker type",
        },
        status_id: {
          type: "number",
          description: "Change the status",
        },
        priority_id: {
          type: "number",
          description: "Change the priority",
        },
        assigned_to_id: {
          type: "number",
          description: "Reassign the issue to a different user",
        },
        start_date: {
          type: "string",
          description: "Update start date in YYYY-MM-DD format",
        },
        due_date: {
          type: "string",
          description: "Update due date in YYYY-MM-DD format",
        },
        done_ratio: {
          type: "number",
          description: "Update percentage of completion (0-100)",
        },
        notes: {
          type: "string",
          description: "Add notes/comments about this update",
        },
      },
      required: ["issue_id"],
    },
  },
  {
    name: "add_comment",
    description:
      "Add a comment/note to an existing Redmine issue. This is a simple way to add comments without updating other issue fields.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: {
          type: "number",
          description: "The ID of the issue to comment on",
        },
        notes: {
          type: "string",
          description: "The comment text to add",
        },
      },
      required: ["issue_id", "notes"],
    },
  },
  {
    name: "delete_issue",
    description: "Delete a Redmine issue/ticket by ID.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: {
          type: "number",
          description: "The ID of the issue to delete",
        },
      },
      required: ["issue_id"],
    },
  },
  {
    name: "log_time",
    description: "Log time stats for an issue or project.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: {
          type: "number",
          description: "The ID of the issue to log time for",
        },
        project_id: {
          type: "number",
          description: "The ID of the project to log time for",
        },
        hours: {
          type: "number",
          description: "The number of hours to log",
        },
        activity_id: {
          type: "number",
          description: "The ID of the activity (optional)",
        },
        comments: {
          type: "string",
          description: "Short comment for the time entry",
        },
        spent_on: {
          type: "string",
          description: "Date the time was spent (YYYY-MM-DD)",
        },
      },
      required: ["hours"],
    },
  },
  {
    name: "get_time_entry_activities",
    description:
      "Get list of time entry activities (e.g. Design, Development).",
    inputSchema: {
      type: "object",
      properties: {},
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
  create_issue: CreateIssueSchema,
  update_issue: UpdateIssueSchema,
  add_comment: AddCommentSchema,
  delete_issue: DeleteIssueSchema,
  log_time: LogTimeSchema,
  get_time_entry_activities: GetTimeEntryActivitiesSchema,
};
