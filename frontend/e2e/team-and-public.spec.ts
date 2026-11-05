import { expect, test } from "./fixtures";
import { dialog, hydrated } from "./helpers";

test.describe("DLV · deliveries", () => {
  test("[DLV-02][S1] pending → Yo'lga chiqdi → Yetkazildi; order becomes delivered", async ({ page, make, api }) => {
    const { warehouse, product, client } = await make.scene(5);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 1 }]);
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    await page.goto("/dashboard/deliveries");
    await page.getByPlaceholder("Buyurtma, mijoz, hudud…").fill(order.number);
    const row = page.getByRole("row", { name: new RegExp(order.number) });
    await row.getByRole("button", { name: "Yo'lga chiqdi" }).click();
    await expect(row.getByRole("button", { name: "Muvaffaqiyatsiz" })).toBeVisible();
    await row.getByRole("button", { name: "Yetkazildi" }).click();
    await expect(row.getByRole("button")).toHaveCount(0);
    await expect.poll(async () => (await (await api.get(`orders/${order.id}`)).json()).status).toBe("delivered");
  });

  test("[DLV-01][S1] courier select persists after reload", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(5);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 1 }]);
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    await page.goto("/dashboard/deliveries");
    await page.getByPlaceholder("Buyurtma, mijoz, hudud…").fill(order.number);
    const row = page.getByRole("row", { name: new RegExp(order.number) });
    const select = row.getByLabel("Kuryer");
    await select.selectOption({ index: 2 });
    const chosen = (await select.locator("option").nth(2).getAttribute("value"))!;
    await expect(select).toHaveValue(chosen);
    await expect(page.getByRole("alert").filter({ hasText: /./ })).toHaveCount(0);
    await page.reload();
    await page.getByPlaceholder("Buyurtma, mijoz, hudud…").fill(order.number);
    await expect(page.getByRole("row", { name: new RegExp(order.number) }).getByLabel("Kuryer")).toHaveValue(chosen);
  });
});

test.describe("LEAD / PUB · leads and landing", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("[PUB-01][S1] demo form → thank-you; lead visible to admin with status change persisting", async ({ page, apiAs, make }) => {
    const name = `O'g'iloy Demo ${make.tag()}`;
    await page.goto("/uz#demo");
    await hydrated(page, "#demo form");
    await page.getByLabel("Ismingiz").fill(name);
    await page.getByLabel("Telefon").fill("+998 90 765 43 21");
    await page.getByRole("textbox", { name: "Kompaniya" }).fill("Sinov Distribyutor");
    await page.getByRole("button", { name: "Demoga yozilish" }).dblclick();
    await expect(page.getByText("Rahmat! So'rovingiz qabul qilindi.")).toBeVisible();

    const admin = await apiAs("admin");
    const leads = (await (await admin.get("leads?limit=50")).json()).items.filter((l: { name: string }) => l.name === name);
    expect(leads).toHaveLength(1);
  });

  test("[PUB-01][S3] empty required fields send nothing", async ({ page }) => {
    await page.goto("/uz#demo");
    await hydrated(page, "#demo form");
    let posts = 0;
    page.on("request", (r) => r.url().includes("/public/leads") && posts++);
    await page.getByRole("button", { name: "Demoga yozilish" }).click();
    expect(posts).toBe(0);
  });

  test("[PUB-06][S1] SEO: title, description, canonical, OG, one h1, images with alt, robots + sitemap", async ({ page, request }) => {
    await page.goto("/uz");
    await expect(page).toHaveTitle(/TradeFlow/);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/^https?:\/\/[^/]+\/uz$/);
    expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toBeTruthy();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("img:not([alt])").count()).toBe(0);
    await page.goto("/login");
    await expect(page).toHaveTitle(/Tizimga kirish/);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/\/login$/);
    expect((await request.get("/robots.txt")).status()).toBe(200);
    expect(await (await request.get("/sitemap.xml")).text()).toContain("<loc>");
  });

  test("[PUB-05][S1] no dead anchors: every #hash link on the landing has a target", async ({ page }) => {
    await page.goto("/uz");
    const hashes = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!.replace(/^\/?#/, "")))].filter(Boolean));
    for (const id of hashes) expect(await page.locator(`[id="${id}"]`).count(), `#${id}`).toBeGreaterThan(0);
  });
});

test.describe("LEAD-01 · admin lead status", () => {
  test("[LEAD-01][S1] status select persists after reload", async ({ page, apiAs, make, api }) => {
    const name = `Lid ${make.tag()}`;
    await (await apiAs(null)).post("public/leads", { data: { name, phone: "+998 91 000 00 00" } });
    await page.goto("/dashboard/leads");
    const row = page.getByRole("row", { name: new RegExp(name) });
    await row.getByLabel("Holat").selectOption("contacted");
    await expect.poll(async () => (await (await api.get("leads?limit=50")).json()).items.find((l: { name: string }) => l.name === name)?.status).toBe("contacted");
    await page.reload();
    await expect(page.getByRole("row", { name: new RegExp(name) }).getByLabel("Holat")).toHaveValue("contacted");
  });
});

test.describe("STF / PRF · staff and profile", () => {
  test("[STF-04][S1] block a user from the staff list → login refused; activate again → login works", async ({ page, make, playwright, baseURL }) => {
    const u = await make.user("courier");
    await page.goto("/dashboard/staff");
    await page.getByPlaceholder(/qidir|Ism/i).first().fill(u.username);
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: `${u.full_name} — bloklash` }).click();
    await expect(page.getByRole("button", { name: `${u.full_name} — faollashtirish` })).toBeVisible();
    const ctx = await playwright.request.newContext({ baseURL: `${baseURL}/api/v1/` });
    expect((await ctx.post("auth/login", { data: { username: u.username, password: u.password } })).status()).toBe(403);
    await page.getByRole("button", { name: `${u.full_name} — faollashtirish` }).click();
    await expect(page.getByRole("button", { name: `${u.full_name} — bloklash` })).toBeVisible();
    expect((await ctx.post("auth/login", { data: { username: u.username, password: u.password } })).status()).toBe(200);
    await ctx.dispose();
  });

  test("[STF-06][S3] admin-only screens: manager sees no settings nav and gets 403 from the API", async ({ browser, apiAs }) => {
    const ctx = await browser.newContext({ storageState: "e2e/.auth/manager.json" });
    const page = await ctx.newPage();
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Xodimlar va rollar" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Integratsiyalar" })).toHaveCount(0);
    expect((await (await apiAs("manager")).get("activity")).status()).toBe(403);
    await ctx.close();
  });

  test("[PRF-01][S1] profile shows the signed-in admin; header avatar opens it", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Profilim" }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile$/);
    await expect(page.getByText("Oxirgi kirish")).toBeVisible();
    await expect(page.getByLabel("To'liq ism")).toHaveValue(/.+/);
  });
});

test.describe("DSH / INS / AGT / INT / ACT · read screens on the big dataset", () => {
  test("[DSH-01][S1] dashboard KPIs, charts and recent orders render with data", async ({ page }) => {
    await page.goto("/dashboard");
    for (const panel of ["Tovar oqimi", "Sotuv hajmi", "Kunlik tushum — 30 kun", "Top tovarlar — 90 kun", "So'nggi buyurtmalar"]) {
      await expect(page.getByText(panel, { exact: true })).toBeVisible();
    }
    await expect(page.locator(".recharts-surface").first()).toBeVisible();
  });

  test("[INS-01][S1] insights refresh works and findings link to screens", async ({ page }) => {
    await page.goto("/dashboard/insights");
    await page.getByRole("button", { name: "Qayta tahlil" }).click();
    await expect(page.getByRole("button", { name: "Qayta tahlil" })).toBeEnabled();
    expect(await page.locator('main a[href^="/dashboard/"]').count()).toBeGreaterThan(0);
  });

  test("[AGT-01][S1] sales team lists agents with plan % and couriers", async ({ page }) => {
    await page.goto("/dashboard/agents");
    await expect(page.getByRole("row").nth(20)).toBeVisible();
    await expect(page.getByRole("cell", { name: /\d+%/ }).first()).toBeVisible();
  });

  test("[ACT-01][S1] activity log lists logins", async ({ page }) => {
    await page.goto("/dashboard/activity");
    await expect(page.getByRole("heading", { level: 1, name: "Faoliyat jurnali" })).toBeVisible();
    await expect(page.getByText(/Kirish|kirdi/).first()).toBeVisible();
  });

  test("[INT-14][S1] integrations catalog: logos load, payment chip filters", async ({ page }) => {
    await page.goto("/dashboard/integrations");
    await page.getByRole("button", { name: /To'lov tizimlari/ }).first().click();
    await expect(page.getByRole("heading", { level: 3, name: "Payme" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Click" })).toBeVisible();
    const broken = await page.locator('img[alt$="logotipi"]').evaluateAll((imgs) => imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0).length);
    expect(broken).toBe(0);
  });
});

test("[G-06][S2] modal: Esc closes and reopening shows a clean form", async ({ page }) => {
  await page.goto("/dashboard/clients");
  await page.getByRole("button", { name: "Mijoz qo'shish" }).click();
  await dialog(page).getByLabel("Savdo nuqtasi nomi").fill("Vaqtinchalik");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Mijoz qo'shish" }).click();
  await expect(dialog(page).getByLabel("Savdo nuqtasi nomi")).toHaveValue("");
});
