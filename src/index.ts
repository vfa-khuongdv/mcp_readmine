#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { RedmineClient } from "./redmine-client.js";
import { tools, toolSchemas } from "./tools.js";
import type { RedmineConfig } from "./types.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "REDMINE_URL",
  "REDMINE_API_KEY",
  "REDMINE_USERNAME",
  "REDMINE_PASSWORD",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("Error: Missing required environment variables:");
  missingEnvVars.forEach((varName) => console.error(`  - ${varName}`));
  console.error("\nPlease create a .env file with all required variables.");
  console.error("See .env.example for reference.");
  process.exit(1);
}

// Initialize Redmine client
const config: RedmineConfig = {
  url: process.env.REDMINE_URL!,
  apiKey: process.env.REDMINE_API_KEY!,
  username: process.env.REDMINE_USERNAME!,
  password: process.env.REDMINE_PASSWORD!,
};

const redmineClient = new RedmineClient(config);

// Create MCP server
const server = new Server(
  {
    name: "mcp-redmine",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_issues": {
        const params = toolSchemas.get_issues.parse(args);
        const result = await redmineClient.getIssues(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_issue": {
        const params = toolSchemas.get_issue.parse(args);
        const result = await redmineClient.getIssue(params.issue_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_projects": {
        const params = toolSchemas.get_projects.parse(args);
        const result = await redmineClient.getProjects(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_project": {
        const params = toolSchemas.get_project.parse(args);
        const result = await redmineClient.getProject(params.project_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_users": {
        const params = toolSchemas.get_users.parse(args);
        const result = await redmineClient.getUsers(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_issues": {
        const params = toolSchemas.search_issues.parse(args);
        const result = await redmineClient.searchIssues(
          params.query,
          params.limit,
          params.offset
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_time_entries": {
        const params = toolSchemas.get_time_entries.parse(args);
        const result = await redmineClient.getTimeEntries(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_issue": {
        const params = toolSchemas.create_issue.parse(args);
        const result = await redmineClient.createIssue(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_issue": {
        const params = toolSchemas.update_issue.parse(args);
        await redmineClient.updateIssue(params.issue_id, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Issue ${params.issue_id} updated successfully`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "add_comment": {
        const params = toolSchemas.add_comment.parse(args);
        await redmineClient.addComment(params.issue_id, params.notes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Comment added to issue ${params.issue_id}`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "delete_issue": {
        const params = toolSchemas.delete_issue.parse(args);
        await redmineClient.deleteIssue(params.issue_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Issue ${params.issue_id} deleted successfully`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "log_time": {
        const params = toolSchemas.log_time.parse(args);
        const result = await redmineClient.logTime(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_time_entry_activities": {
        const result = await redmineClient.getTimeEntryActivities();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Error executing ${name}: ${error.message}`
      );
    }
    throw error;
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Redmine MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
