import { request, type FullConfig } from "@playwright/test";
import { mkdir } from "node:fs/promises";

export const ROLES = { admin: "admin123", manager: "demo123", agent1: "demo123", courier1: "demo123", auditor1: "demo123" } as const;
export type RoleUser = keyof typeof ROLES;
export const authFile = (user: RoleUser) => `e2e/.auth/${user}.json`;

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!;
  if (new URL(baseURL).port === "3001" && !process.env.E2E_ALLOW_MAIN_DB) {
    throw new Error("E2E creates data: run it against the tradeflow-e2e stack (http://localhost:3101), not the main one on :3001.");
  }
  await mkdir("e2e/.auth", { recursive: true });

  const probe = await request.newContext({ baseURL });
  for (let i = 0; ; i++) {
    const res = await probe.get("/api/v1/auth/me").catch(() => null);
    if (res && res.status() < 500) break;
    if (i > 60) throw new Error(`API not reachable through ${baseURL}/api/v1`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  await probe.dispose();

  for (const [username, password] of Object.entries(ROLES)) {
    const ctx = await request.newContext({ baseURL });
    const res = await ctx.post("/api/v1/auth/login", { data: { username, password } });
    if (!res.ok()) throw new Error(`login ${username} → ${res.status()} ${await res.text()}`);
    await ctx.storageState({ path: authFile(username as RoleUser) });
    await ctx.dispose();
  }
}
