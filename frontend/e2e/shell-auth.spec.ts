import { expect, test } from "./fixtures";
import { hydrated, SCREENS, signIn } from "./helpers";

test.describe("AUTH · login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("[AUTH-01][S1] admin logs in and lands on the dashboard", async ({ page }) => {
    await page.goto("/login");
    await signIn(page, "admin", "admin123");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  });

  test("[AUTH-01][S2] every role logs in with Enter; manager has no admin settings", async ({ page }) => {
    for (const user of ["manager", "courier1", "auditor1", "agent1"]) {
      await page.context().clearCookies();
      await page.goto("/login");
      await hydrated(page);
      await page.getByLabel("Login").fill(user);
      await page.getByLabel("Parol", { exact: true }).fill("demo123");
      await page.getByLabel("Parol", { exact: true }).press("Enter");
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByRole("link", { name: "Xodimlar va rollar" })).toHaveCount(0);
    }
  });

  test("[AUTH-01][S3] wrong password shows an alert, empty fields send nothing", async ({ page, make }) => {
    const u = await make.user("courier");
    await page.goto("/login");
    await hydrated(page);
    let calls = 0;
    page.on("request", (r) => r.url().includes("/auth/login") && calls++);
    await page.getByRole("button", { name: "Tizimga kirish" }).click();
    expect(calls).toBe(0);

    await page.getByLabel("Login").fill(u.username);
    await page.getByLabel("Parol", { exact: true }).fill("notogri-parol");
    await page.getByRole("button", { name: "Tizimga kirish" }).click();
    await expect(page.locator("form").getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe(() => {
    test.use({ allowServerErrors: true });
    test("[AUTH-01][S3] API 503 during login → error text, button usable again", async ({ page }) => {
      await page.goto("/login");
      await page.route("**/api/v1/auth/login", (r) => r.fulfill({ status: 503, json: { error: "Server xatosi" } }));
      await signIn(page, "admin", "admin123");
      await expect(page.locator("form").getByRole("alert")).toContainText("Server xatosi");
      await expect(page.getByRole("button", { name: "Tizimga kirish" })).toBeEnabled();
    });
  });

  test("[AUTH-02][S1] show / hide password does not submit", async ({ page }) => {
    await page.goto("/login");
    await hydrated(page);
    const pass = page.getByLabel("Parol", { exact: true });
    await pass.fill("abc");
    await page.getByRole("button", { name: "Parolni ko'rsatish" }).click();
    await expect(pass).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Parolni yashirish" }).click();
    await expect(pass).toHaveAttribute("type", "password");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("[AUTH-03][S3] next redirect: deep link returns after login; external next stays on-site", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Forders/);
    await signIn(page, "admin", "admin123");
    await expect(page).toHaveURL(/\/dashboard\/orders$/);

    await page.context().clearCookies();
    await page.goto("/login?next=https://evil.example.com");
    await signIn(page, "admin", "admin123");
    await expect(page).toHaveURL(/localhost:\d+\/dashboard$/);
  });
});

test.describe("G · shell", () => {
  test("[G-02][S1] every sidebar item opens its screen with heading and active state", async ({ page }) => {
    await page.goto("/dashboard");
    const nav = page.getByRole("navigation", { name: "CRM" });
    for (const [path, label, heading] of SCREENS) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
      await expect(page.getByRole("status")).toHaveCount(0, { timeout: 15_000 });
    }
  });

  test("[G-02][S2] deep link + reload keeps the page; revisit renders from cache without a spinner", async ({ page }) => {
    await page.goto("/dashboard/products");
    await expect(page.getByRole("table")).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Tovarlar" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    const nav = page.getByRole("navigation", { name: "CRM" });
    await nav.getByRole("link", { name: "Mijozlar" }).click();
    await expect(page.getByRole("table")).toBeVisible();
    await page.route("**/api/v1/products?*", async (r) => {
      await new Promise((res) => setTimeout(res, 1500));
      await r.continue();
    });
    await nav.getByRole("link", { name: "Tovarlar" }).click();
    await expect(page.getByRole("table")).toBeVisible({ timeout: 1000 });
  });

  test("[G-02][S3] unknown dashboard route shows not-found without crashing", async ({ page }) => {
    const res = await page.goto("/dashboard/mavjud-emas");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/could not be found|topilmadi/i).first()).toBeVisible();
  });

  test("[G-01][S3] no cookie → /login?next=…", async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto("/dashboard/finance");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Ffinance/);
    await ctx.close();
  });

  test("[G-04][S1] logout clears the session; back button cannot reopen the dashboard", async ({ page, make }) => {
    const u = await make.user("manager");
    await page.context().clearCookies();
    await page.goto("/login");
    await signIn(page, u.username, u.password);
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole("button", { name: "Chiqish" }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect((await page.context().cookies()).find((c) => c.name === "tf_token")).toBeUndefined();
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
    await page.reload();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: "Tizimga kirish" })).toBeVisible();
  });

  test("[G-05][S3] session revoked mid-use → next request redirects to /login?next=", async ({ page, make, api }) => {
    const u = await make.user("manager");
    await page.context().clearCookies();
    await page.goto("/login");
    await signIn(page, u.username, u.password);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Kunlik tushum — 30 kun")).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
    expect((await api.post(`users/${u.id}/sessions/revoke`)).ok()).toBe(true);
    await page.getByRole("navigation", { name: "CRM" }).getByRole("link", { name: "Buyurtmalar" }).click();
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Forders/);
  });

  test("[G-03][S1] mobile menu opens, navigates and closes @mobile", async ({ page }) => {
    await page.goto("/dashboard");
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Menyuni ochish" }).click();
      await page.getByRole("button", { name: "Menyuni yopish" }).click();
    }
    await page.getByRole("button", { name: "Menyuni ochish" }).click();
    await page.getByRole("navigation", { name: "CRM" }).getByRole("link", { name: "Buyurtmalar" }).click();
    await expect(page).toHaveURL(/\/dashboard\/orders$/);
    await expect(page.getByRole("heading", { level: 1, name: "Buyurtmalar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Menyuni yopish" })).toBeHidden();
  });

  test("[DSH-03][S3] dashboard charts at 375px without horizontal overflow @mobile", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Kunlik tushum — 30 kun")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
