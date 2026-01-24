import path from "node:path";
import storybookTest from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // temporary fix for jsx transformation issue in vitest v4
      // TODO: remove server inline deps when fixed with vitest
      server: {
        deps: {
          inline: [/@kobalte\/core/],
        },
      },
      globals: false,
      environment: "jsdom",
      setupFiles: "./src/vitest.setup.ts",
      coverage: {
        include: ["src/**/*.[jt]s?(x)"],
        exclude: ["src/**/*.stories.[jt]s?(x)", "**/*.d.ts"],
        thresholds: {
          lines: 3,
          functions: 3,
          branches: 3,
          statements: 3,
        },
      },
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/?(*.)+(spec|test).[jt]s?(x)"],
          },
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(import.meta.dirname, ".storybook"),
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
            setupFiles: [".storybook/vitest.setup.ts"],
          },
        },
      ],
    },
  }),
);
