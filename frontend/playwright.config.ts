import { defineConfig, devices } from "@playwright/test";

/**
 * Frontend origin; the API is reached through its /api/v1 rewrite, exactly like production.
 * Default = the separate `tradeflow-e2e` compose stack: tests create data, so they never run against the main one.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3101";

export default defineConfig({
  testDir: "e2e",
  globalSetup: "./e2e/global-setup.ts",
  retries: 0,
  repeatEach: Number(process.env.E2E_REPEAT ?? 3),
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "uz-UZ",
    timezoneId: "Asia/Tashkent",
    /** Default language is Russian; specs select by Uzbek text, so pages and API answer in Uzbek unless a test sets `tf_lang`. */
    extraHTTPHeaders: { "x-lang": "uz" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, grepInvert: /@mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
});
