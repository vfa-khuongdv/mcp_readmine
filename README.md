# Redmine MCP Server

[![npm version](https://badge.fury.io/js/@duongkhuong%2Fmcp-redmine.svg)](https://www.npmjs.com/package/@duongkhuong/mcp-redmine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server that allows AI agents to interact with the Redmine API to manage tickets, projects, users, and time entries.

## Features

- ✅ Dual Authentication Support: Basic Auth + API Key
- ✅ Comprehensive Toolset for Redmine interaction:
  - `get_issues` - List issues with filters
  - `get_issue` - Get issue details including journals and attachments
  - `get_projects` - List projects
  - `get_project` - Get project details
  - `get_project_members` - List project members (Users)
  - `get_project_versions` - List project versions (Milestones)
  - `search_issues` - Search issues by keyword
  - `create_issue` - Create a new issue
  - `update_issue` - Update an existing issue
  - `add_comment` - Add a comment to an issue
  - `delete_issue` - Delete an issue
  - `log_time` - Log time entries
  - `get_time_entries` - List logged time entries
  - `get_time_entry_activities` - List available time entry activities
- ✅ Type-safe with TypeScript and Zod validation
- ✅ Pagination support for all list endpoints

## Installation

### From npm (Recommended)

```bash
npm install -g @duongkhuong/mcp-redmine
```

### From Source

```bash
git clone git@github.com:vfa-khuongdv/mcp_readmine.git
cd mcp_readmine
npm install
npm run build
```

### Configuration

You need to provide the following environment variables:

- `REDMINE_URL` - URL of your Redmine instance (e.g., https://redmine.example.com)
- `REDMINE_API_KEY` - API key from your account settings
- `REDMINE_USERNAME` - Username for Basic Authentication
- `REDMINE_PASSWORD` - Password for Basic Authentication

**Note:** The Redmine API often requires **BOTH** Basic Auth (username/password) **AND** an API Key for full access depending on server configuration.

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@duongkhuong/mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.com",
        "REDMINE_API_KEY": "your_api_key_here",
        "REDMINE_USERNAME": "your_username",
        "REDMINE_PASSWORD": "your_password"
      }
    }
  }
}
```

Restart Claude Desktop to load the MCP server.

### With Cursor IDE

Add to your Cursor configuration file:

**macOS/Linux**: `~/.cursor/mcp.json`

**Windows**: `%APPDATA%\Cursor\User\mcp.json`

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@duongkhuong/mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.com",
        "REDMINE_API_KEY": "your_api_key_here",
        "REDMINE_USERNAME": "your_username",
        "REDMINE_PASSWORD": "your_password"
      }
    }
  }
}
```

Restart Cursor to load the MCP server.

### With VS Code

**Option 1: Using mcp.json (No extension required)**

Create or edit your MCP configuration file:

**macOS/Linux**: `~/.vscode/mcp.json`

**Windows**: `%APPDATA%\Code\User\mcp.json`

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@duongkhuong/mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.com",
        "REDMINE_API_KEY": "your_api_key_here",
        "REDMINE_USERNAME": "your_username",
        "REDMINE_PASSWORD": "your_password"
      }
    }
  }
}
```

Reload VS Code to load the MCP server.

**Option 2: Using Cline Extension**

1. Install the [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) extension.
2. Open VS Code Settings (JSON).
3. Add the MCP configuration:

```json
{
  "cline.mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@duongkhuong/mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.com",
        "REDMINE_API_KEY": "your_api_key_here",
        "REDMINE_USERNAME": "your_username",
        "REDMINE_PASSWORD": "your_password"
      }
    }
  }
}
```

Reload VS Code to load the MCP server.

### How to get your Redmine API Key

1. Log in to your Redmine instance.
2. Go to **My account** (top right corner).
3. Click on **API access key** (right sidebar or link).
4. Click **Show** to reveal the key.
5. Copy the API key and paste it into your configuration.

### Running Standalone (Development)

```bash
npm start
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx -y @duongkhuong/mcp-redmine
```

## Available Tools

### 1. get_issues

Get a list of issues/tickets with optional filters.

**Parameters:**

- `project_id` (number, optional) - Filter by project ID
- `status_id` (number | "open" | "closed" | "\*", optional) - Filter by status
- `assigned_to_id` (number, optional) - Filter by assignee ID
- `limit` (number, optional) - Number of results (1-100, default: 25)
- `offset` (number, optional) - Pagination offset (default: 0)

**Example:**

```json
{
  "project_id": 1,
  "status_id": "open",
  "limit": 10
}
```

### 2. get_issue

Get detailed information about a specific issue by ID, including journals, attachments, and relations.

**Parameters:**

- `issue_id` (number, required) - The ID of the issue

### 3. get_projects

Get a list of all projects.

**Parameters:**

- `limit` (number, optional) - Number of results (1-100, default: 25)
- `offset` (number, optional) - Pagination offset (default: 0)

### 4. get_project

Get detailed information about a specific project by ID.

**Parameters:**

- `project_id` (number, required) - The ID of the project

### 5. get_project_members

Get a list of project members (users) in a specific project.

**Parameters:**

- `project_id` (number, required) - The ID of the project
- `limit` (number, optional) - Number of results (1-100, default: 25)
- `offset` (number, optional) - Pagination offset (default: 0)

### 6. get_project_versions

Get a list of versions (milestones) for a specific project.

**Parameters:**

- `project_id` (number, required) - The ID of the project

### 7. search_issues

Search for issues by keyword in the subject field.

**Parameters:**

- `query` (string, required) - Search keyword
- `limit` (number, optional) - Number of results (1-100, default: 25)
- `offset` (number, optional) - Pagination offset (default: 0)

### 8. log_time

Log time stats for an issue or project.

**Parameters:**

- `issue_id` (number, optional) - The ID of the issue to log time for
- `project_id` (number, optional) - The ID of the project to log time for
- `hours` (number, required) - The number of hours to log
- `activity_id` (number, optional) - The ID of the activity
- `comments` (string, optional) - Short comment for the time entry
- `spent_on` (string, optional) - Date the time was spent (YYYY-MM-DD)

### 9. get_time_entries

Get a list of time entries with filters.

**Parameters:**

- `project_id` (number, optional) - Filter by project
- `user_id` (number, optional) - Filter by user
- `from` (string, optional) - Start date (YYYY-MM-DD)
- `to` (string, optional) - End date (YYYY-MM-DD)
- `limit` (number, optional) - Number of results (1-100, default: 25)
- `offset` (number, optional) - Pagination offset (default: 0)

### 10. get_time_entry_activities

Get a list of available time entry activities.

**Parameters:** None

### 11. create_issue

Create a new issue/ticket in Redmine.

**Parameters:**

- `project_id` (number, required) - ID of the project
- `subject` (string, required) - Title of the issue
- `description` (string, optional) - Detailed description
- `tracker_id` (number, optional) - Tracker ID (Bug, Feature, etc.)
- `status_id` (number, optional) - Status ID
- `priority_id` (number, optional) - Priority ID
- `assigned_to_id` (number, optional) - User ID to assign
- `start_date` (string, optional) - Start date (YYYY-MM-DD)
- `due_date` (string, optional) - Due date (YYYY-MM-DD)
- `done_ratio` (number, optional) - Completion percentage (0-100)
- `fixed_version_id` (number, optional) - Target version/milestone ID

### 12. update_issue

Update an existing issue/ticket. Only provided fields will be updated.

**Parameters:**

- `issue_id` (number, required) - ID of the issue to update
- `project_id` (number, optional) - Move to another project
- `subject` (string, optional) - Update title
- `description` (string, optional) - Update description
- `tracker_id` (number, optional) - Change tracker
- `status_id` (number, optional) - Change status
- `priority_id` (number, optional) - Change priority
- `assigned_to_id` (number, optional) - Reassign to another user
- `start_date` (string, optional) - Update start date
- `due_date` (string, optional) - Update due date
- `done_ratio` (number, optional) - Update completion percentage
- `fixed_version_id` (number, optional) - Update target version
- `notes` (string, optional) - Add a note/comment about the update

### 13. add_comment

Add a comment/note to an issue.

**Parameters:**

- `issue_id` (number, required) - ID of the issue
- `notes` (string, required) - Comment content

### 14. delete_issue

Delete an issue/ticket from Redmine.

**Parameters:**

- `issue_id` (number, required) - ID of the issue to delete

## Example Prompts

Here are some example prompts you can use to interact with the Redmine MCP server:

**🔍 Querying & Search**

- "List all open bugs in project 'Mobile App'"
- "Show me high priority issues assigned to me"
- "Search for issues about 'login failure'"
- "Get details of issue #1234 including history"
- "Who are the members of project ID 5?"

**📝 Issue Management**

- "Create a new feature request in 'Web Platform' project: Add Dark Mode toggle"
- "Update issue #567 status to 'Resolved' and set done ratio to 100%"
- "Reassign issue #890 to user 'John Doe'"
- "Add a comment to issue #123: 'Fixed in commit abc1234'"
- "Delete issue #999"

**⏱️ Time Tracking**

- "Log 2 hours on issue #123 for 'Development'"
- "Show my time entries for this week"
- "List time entries for project 'Website Redesign' in January"
- "What are the available activities for time logging?"

## Development

### Watch mode

```bash
npm run dev
```

### Project structure

```
mcp-redmine/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── redmine-client.ts # Redmine API client
│   ├── tools.ts          # MCP tool definitions
│   └── types.ts          # TypeScript types & Zod schemas
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Authentication errors

Ensure you have provided:

- ✅ REDMINE_URL (no trailing slash)
- ✅ REDMINE_API_KEY (from account settings)
- ✅ REDMINE_USERNAME
- ✅ REDMINE_PASSWORD

### Connection errors

- Check if REDMINE_URL is correct.
- Check network/firewall settings.
- Verify if API key is still valid.

### Tool not found

- Ensure you have built the project: `npm run build`
- Restart your AI client (Claude, Cursor, VS Code) after updating config.

## License

MIT
