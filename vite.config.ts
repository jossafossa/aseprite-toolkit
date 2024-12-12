import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { configDefaults } from "vitest/config";
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      exclude: [...(configDefaults.coverage?.exclude ?? []), "**/index.ts"],
    },
    environment: "happy-dom",
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.test.*"],
    }),
  ],
  build: {
    lib: {
      name: "ShortcutListener",
      entry: "src/index.ts",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["fs", "fs-extra", "sharp", "path", "child_process"],
    },
  },
});
