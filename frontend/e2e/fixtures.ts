import { test as base, expect, type APIRequestContext } from "@playwright/test";
import { authFile, type RoleUser } from "./global-setup";
import { Factory } from "./factories";

interface Fixtures {
  /** Admin API client (same-origin through the Next.js rewrite). */
  api: APIRequestContext;
  /** API client for any seeded role. */
  apiAs: (user: RoleUser | null) => Promise<APIRequestContext>;
  make: Factory;
  uid: string;
}
interface Options {
  /** Set when a test mocks 5xx / aborts requests on purpose. */
  allowServerErrors: boolean;
}

export const test = base.extend<Fixtures & Options>({
  allowServerErrors: [false, { option: true }],
  storageState: authFile("admin"),

  uid: async ({}, use, info) => {
    await use(`${Date.now().toString(36)}${info.repeatEachIndex}${Math.random().toString(36).slice(2, 6)}`);
  },

  apiAs: async ({ playwright, baseURL }, use) => {
    const made: APIRequestContext[] = [];
    await use(async (user) => {
      const ctx = await playwright.request.newContext({ baseURL: `${baseURL}/api/v1/`, storageState: user ? authFile(user) : { cookies: [], origins: [] } });
      made.push(ctx);
      return ctx;
    });
    for (const c of made) await c.dispose();
  },

  api: async ({ apiAs }, use) => {
    await use(await apiAs("admin"));
  },

  make: async ({ api, uid }, use) => {
    await use(new Factory(api, uid));
  },

  page: async ({ page, allowServerErrors }, use) => {
    const problems: string[] = [];
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const text = m.text();
      // the browser logs every non-2xx fetch; HTTP failures are asserted via the response listener
      if (/Failed to load resource|status of \d{3}/.test(text)) return;
      problems.push(`console: ${text}`);
    });
    page.on("response", (r) => {
      if (r.status() >= 500 && !allowServerErrors) problems.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`);
    });
    await use(page);
    expect(problems, "no console errors, page errors or unexpected 5xx").toEqual([]);
  },
});

export { expect };
