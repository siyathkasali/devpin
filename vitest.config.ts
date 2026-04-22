import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: [
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
      "actions/**/*.test.ts",
      "actions/**/*.spec.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/components/**",
      "**/app/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/components/**",
        "**/app/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/src": path.resolve(__dirname, "./src"),
    },
  },
});