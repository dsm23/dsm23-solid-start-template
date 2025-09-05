import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solid(), tailwindcss(), tsconfigPaths()],
  resolve: {
    conditions: ["development", "browser"],
  },
});
