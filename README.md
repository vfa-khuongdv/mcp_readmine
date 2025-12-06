# Redmine MCP Server

[![npm version](https://badge.fury.io/js/@duongkhuong%2Fmcp-redmine.svg)](https://www.npmjs.com/package/@duongkhuong/mcp-redmine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) server cho phép AI agents truy cập Redmine API để lấy thông tin về tickets, projects, users và time entries.

## Tính năng

- ✅ Hỗ trợ xác thực kép: Basic Auth + API Key
- ✅ 11 tools để tương tác với Redmine:
  - `get_issues` - Lấy danh sách issues với filters
  - `get_issue` - Lấy chi tiết issue theo ID
  - `get_projects` - Lấy danh sách projects
  - `get_project` - Lấy chi tiết project theo ID
  - `get_users` - Lấy danh sách users
  - `search_issues` - Tìm kiếm issues theo keyword
  - `get_time_entries` - Lấy time entries
  - `create_issue` - Tạo issue mới
  - `update_issue` - Cập nhật issue
  - `add_comment` - Thêm comment vào issue
  - `delete_issue` - Xóa issue
- ✅ Type-safe với TypeScript và Zod validation
- ✅ Pagination support cho tất cả list endpoints

## Cài đặt

### Cài đặt từ npm (Khuyến nghị)

```bash
npm install -g @duongkhuong/mcp-redmine
```

### Hoặc cài đặt từ source

```bash
git clone https://github.com/khuongdv/mcp-redmine.git
cd mcp-redmine
npm install
npm run build
```

### Cấu hình

Bạn cần cung cấp các biến môi trường sau:

- `REDMINE_URL` - URL của Redmine instance (ví dụ: https://redmine.example.com)
- `REDMINE_API_KEY` - API key từ account settings
- `REDMINE_USERNAME` - Username cho Basic Authentication
- `REDMINE_PASSWORD` - Password cho Basic Authentication

**Lưu ý:** Redmine API yêu cầu **CẢ HAI** Basic Auth (username/password) **VÀ** API Key để xác thực.

## Sử dụng

### Với Claude Desktop

Thêm vào file cấu hình Claude Desktop:

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

Restart Claude Desktop để load MCP server.

### Với Cursor IDE

Thêm vào file cấu hình Cursor:

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

Restart Cursor để load MCP server.

### Với VS Code

**Cách 1: Sử dụng file mcp.json (Không cần extension)**

Tạo hoặc chỉnh sửa file cấu hình MCP:

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

Reload VS Code để load MCP server.

**Cách 2: Sử dụng Cline Extension**

1. Cài đặt extension [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
2. Mở VS Code Settings (JSON)
3. Thêm cấu hình MCP:

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

Reload VS Code để load MCP server.

````

Reload VS Code để load MCP server.

### Lấy Redmine API Key

1. Đăng nhập vào Redmine
2. Vào **My account** (góc trên bên phải)
3. Click tab **API access key**
4. Click **Show** để hiển thị API key
5. Copy API key và paste vào config

### Chạy standalone (Development)

```bash
npm start
````

### Test với MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx -y @duongkhuong/mcp-redmine
```

## Available Tools

### 1. get_issues

Lấy danh sách issues với optional filters.

**Parameters:**

- `project_id` (number, optional) - Filter theo project ID
- `status_id` (number | "open" | "closed" | "\*", optional) - Filter theo status
- `assigned_to_id` (number, optional) - Filter theo assignee
- `limit` (number, optional) - Số lượng kết quả (1-100, default: 25)
- `offset` (number, optional) - Offset cho pagination (default: 0)

**Example:**

```json
{
  "project_id": 1,
  "status_id": "open",
  "limit": 10
}
```

### 2. get_issue

Lấy chi tiết một issue theo ID, bao gồm journals, attachments, và relations.

**Parameters:**

- `issue_id` (number, required) - ID của issue

**Example:**

```json
{
  "issue_id": 123
}
```

### 3. get_projects

Lấy danh sách tất cả projects.

**Parameters:**

- `limit` (number, optional) - Số lượng kết quả (1-100, default: 25)
- `offset` (number, optional) - Offset cho pagination (default: 0)

### 4. get_project

Lấy chi tiết một project theo ID.

**Parameters:**

- `project_id` (number, required) - ID của project

### 5. get_users

Lấy danh sách users.

**Parameters:**

- `status` ("active" | "registered" | "locked", optional) - Filter theo status
- `limit` (number, optional) - Số lượng kết quả (1-100, default: 25)
- `offset` (number, optional) - Offset cho pagination (default: 0)

### 6. search_issues

Tìm kiếm issues theo keyword trong subject.

**Parameters:**

- `query` (string, required) - Từ khóa tìm kiếm
- `limit` (number, optional) - Số lượng kết quả (1-100, default: 25)
- `offset` (number, optional) - Offset cho pagination (default: 0)

**Example:**

```json
{
  "query": "bug",
  "limit": 20
}
```

### 7. get_time_entries

Lấy time entries với filters.

**Parameters:**

- `project_id` (number, optional) - Filter theo project
- `user_id` (number, optional) - Filter theo user
- `from` (string, optional) - Ngày bắt đầu (YYYY-MM-DD)
- `to` (string, optional) - Ngày kết thúc (YYYY-MM-DD)
- `limit` (number, optional) - Số lượng kết quả (1-100, default: 25)
- `offset` (number, optional) - Offset cho pagination (default: 0)

**Example:**

```json
{
  "project_id": 1,
  "from": "2024-01-01",
  "to": "2024-12-31"
}
```

### 8. create_issue

Tạo một issue/ticket mới trong Redmine.

**Parameters:**

- `project_id` (number, required) - ID của project
- `subject` (string, required) - Tiêu đề của issue
- `description` (string, optional) - Mô tả chi tiết
- `tracker_id` (number, optional) - ID của tracker (Bug, Feature, Support...)
- `status_id` (number, optional) - ID của status
- `priority_id` (number, optional) - ID của priority
- `assigned_to_id` (number, optional) - ID của user được assign
- `start_date` (string, optional) - Ngày bắt đầu (YYYY-MM-DD)
- `due_date` (string, optional) - Ngày deadline (YYYY-MM-DD)
- `done_ratio` (number, optional) - Phần trăm hoàn thành (0-100)

**Example:**

```json
{
  "project_id": 1,
  "subject": "Fix login bug",
  "description": "Users cannot login with special characters in password",
  "tracker_id": 1,
  "priority_id": 3,
  "assigned_to_id": 5
}
```

### 9. update_issue

Cập nhật một issue/ticket đã tồn tại. Chỉ các fields được cung cấp sẽ được cập nhật.

**Parameters:**

- `issue_id` (number, required) - ID của issue cần update
- `project_id` (number, optional) - Chuyển issue sang project khác
- `subject` (string, optional) - Cập nhật tiêu đề
- `description` (string, optional) - Cập nhật mô tả
- `tracker_id` (number, optional) - Thay đổi tracker
- `status_id` (number, optional) - Thay đổi status
- `priority_id` (number, optional) - Thay đổi priority
- `assigned_to_id` (number, optional) - Reassign cho user khác
- `start_date` (string, optional) - Cập nhật ngày bắt đầu (YYYY-MM-DD)
- `due_date` (string, optional) - Cập nhật deadline (YYYY-MM-DD)
- `done_ratio` (number, optional) - Cập nhật phần trăm hoàn thành (0-100)
- `notes` (string, optional) - Thêm ghi chú về update này

**Example:**

```json
{
  "issue_id": 123,
  "status_id": 3,
  "done_ratio": 80,
  "notes": "Almost done, just need final testing"
}
```

### 10. add_comment

Thêm comment/ghi chú vào một issue. Đây là cách đơn giản để thêm comment mà không cần update các fields khác.

**Parameters:**

- `issue_id` (number, required) - ID của issue
- `notes` (string, required) - Nội dung comment

**Example:**

```json
{
  "issue_id": 123,
  "notes": "I've reviewed the code and it looks good to merge"
}
```

### 11. delete_issue

Xóa một issue/ticket khỏi Redmine.

**Parameters:**

- `issue_id` (number, required) - ID của issue cần xóa

**Example:**

```json
{
  "issue_id": 123
}
```

## Roadmap / Future Tools

Các tools dự kiến sẽ được support trong tương lai:

- #NA

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

Đảm bảo bạn đã cung cấp đầy đủ:

- ✅ REDMINE_URL (không có trailing slash)
- ✅ REDMINE_API_KEY (từ account settings)
- ✅ REDMINE_USERNAME
- ✅ REDMINE_PASSWORD

### Connection errors

- Kiểm tra REDMINE_URL có đúng không
- Kiểm tra network/firewall có block không
- Verify API key còn valid không

### Tool not found

- Đảm bảo đã build: `npm run build`
- Restart Claude Desktop sau khi update config

## License

MIT
