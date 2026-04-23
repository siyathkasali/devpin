import { describe, it, expect } from "vitest";
import { updateItemSchema } from "./items";

describe("updateItemSchema", () => {
  describe("title", () => {
    it("validates a non-empty title", () => {
      const result = updateItemSchema.safeParse({ title: "My Snippet" });
      expect(result.success).toBe(true);
    });

    it("rejects an empty title", () => {
      const result = updateItemSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });

    it("rejects a title with only whitespace", () => {
      const result = updateItemSchema.safeParse({ title: "   " });
      expect(result.success).toBe(false);
    });

    it("trims whitespace from title", () => {
      const result = updateItemSchema.safeParse({ title: "  My Snippet  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("My Snippet");
      }
    });
  });

  describe("description", () => {
    it("accepts null description", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", description: null });
      expect(result.success).toBe(true);
    });

    it("accepts a string description", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", description: "A description" });
      expect(result.success).toBe(true);
    });

    it("accepts undefined description", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", description: undefined });
      expect(result.success).toBe(true);
    });
  });

  describe("content", () => {
    it("accepts null content", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", content: null });
      expect(result.success).toBe(true);
    });

    it("accepts a string content", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", content: "const x = 1;" });
      expect(result.success).toBe(true);
    });
  });

  describe("url", () => {
    it("accepts null url", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", url: null });
      expect(result.success).toBe(true);
    });

    it("accepts a valid URL", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", url: "https://example.com" });
      expect(result.success).toBe(true);
    });

    it("accepts an empty string url", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", url: "" });
      expect(result.success).toBe(true);
    });

    it("rejects an invalid URL", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", url: "not-a-url" });
      expect(result.success).toBe(false);
    });
  });

  describe("language", () => {
    it("accepts null language", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", language: null });
      expect(result.success).toBe(true);
    });

    it("accepts a string language", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", language: "TypeScript" });
      expect(result.success).toBe(true);
    });
  });

  describe("tags", () => {
    it("accepts undefined tags", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", tags: undefined });
      expect(result.success).toBe(true);
    });

    it("accepts an array of non-empty strings", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", tags: ["react", "hooks"] });
      expect(result.success).toBe(true);
    });

    it("rejects an array with empty string", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", tags: ["react", ""] });
      expect(result.success).toBe(false);
    });

    it("trims tag strings", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", tags: ["  react  ", "hooks"] });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual(["react", "hooks"]);
      }
    });

    it("accepts an empty array", () => {
      const result = updateItemSchema.safeParse({ title: "Valid", tags: [] });
      expect(result.success).toBe(true);
    });
  });

  describe("complete valid payload", () => {
    it("accepts a fully populated payload", () => {
      const result = updateItemSchema.safeParse({
        title: "My Snippet",
        description: "A useful snippet",
        content: "const x = 1;",
        url: null,
        language: "TypeScript",
        tags: ["snippet", "utility"],
      });
      expect(result.success).toBe(true);
    });
  });
});
