import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Two workers on the 2-vCPU CI runners; the server is static, so tests
  // don't contend for state.
  workers: process.env.CI ? 2 : undefined,
  // On CI, also write the HTML report (with first-retry traces) that the
  // workflow uploads when the job fails.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run preview",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
