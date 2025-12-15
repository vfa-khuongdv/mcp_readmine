import { describe, it, expect } from "vitest";
import { tools, toolSchemas } from "../src/tools.js";
import { z } from "zod";

describe("Tools Configuration", () => {
  it("should have matching schemas for all tools", () => {
    tools.forEach((tool) => {
      const schema = toolSchemas[tool.name as keyof typeof toolSchemas];
      expect(schema).toBeDefined();
    });
  });

  it("should have valid Zod schemas", () => {
    Object.values(toolSchemas).forEach((schema) => {
      expect(schema).toBeInstanceOf(z.ZodType);
    });
  });

  it("should export required tools", () => {
    const requiredTools = [
      "get_issues",
      "get_issue",
      "create_issue",
      "update_issue",
    ];
    const exportedToolNames = tools.map((t) => t.name);

    requiredTools.forEach((toolName) => {
      expect(exportedToolNames).toContain(toolName);
    });
  });

  describe("Input Schemas", () => {
    it("should validate create_issue input", () => {
      const schema = toolSchemas.create_issue;
      const validInput = {
        project_id: 1,
        subject: "Test Issue",
        description: "Test Description",
      };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_issues input", () => {
      const schema = toolSchemas.get_issues;
      const validInput = {
        limit: 10,
        offset: 0,
        status_id: "open",
      };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_issue input", () => {
      const schema = toolSchemas.get_issue;
      const validInput = { issue_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_projects input", () => {
      const schema = toolSchemas.get_projects;
      const validInput = { limit: 10 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_project input", () => {
      const schema = toolSchemas.get_project;
      const validInput = { project_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_project_members input", () => {
      const schema = toolSchemas.get_project_members;
      const validInput = { project_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_project_versions input", () => {
      const schema = toolSchemas.get_project_versions;
      const validInput = { project_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate search_issues input", () => {
      const schema = toolSchemas.search_issues;
      const validInput = { query: "bug" };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_time_entries input", () => {
      const schema = toolSchemas.get_time_entries;
      const validInput = { project_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate update_issue input", () => {
      const schema = toolSchemas.update_issue;
      const validInput = { issue_id: 1, notes: "Update" };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate add_comment input", () => {
      const schema = toolSchemas.add_comment;
      const validInput = { issue_id: 1, notes: "Comment" };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate delete_issue input", () => {
      const schema = toolSchemas.delete_issue;
      const validInput = { issue_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate log_time input", () => {
      const schema = toolSchemas.log_time;
      const validInput = { hours: 4, issue_id: 1 };
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it("should validate get_time_entry_activities input", () => {
      const schema = toolSchemas.get_time_entry_activities;
      const validInput = {};
      expect(schema.safeParse(validInput).success).toBe(true);
    });
  });
});
