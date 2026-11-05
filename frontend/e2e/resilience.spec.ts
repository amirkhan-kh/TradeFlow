import { expect, test } from "./fixtures";
import { dialog } from "./helpers";

/** Network failure, slow backend and partial outages: the UI must degrade gracefully and recover. */
test.describe("Resilience", () => {
  test.use({ allowServerErrors: true });

  const LISTS: [path: string, api: string][] = [
    ["/dashboard/orders", "orders"],
    ["/dashboard/products", "products"],
    ["/dashboard/clients", "clients"],
    ["/dashboard/stock", "stock"],
    ["/dashboard/finance", "payments"],
    ["/dashboard/deliveries", "deliveries"],
    ["/dashboard/audits", "audits"],
    ["/dashboard/warehouses", "warehouses"],
    ["/dashboard/leads", "leads"],
  ];

  for (const [path, endpoint] of LISTS) {
    test(`[L4][S3] ${path}: API 500 → error state, "Qayta urinish" recovers`, async ({ page }) => {
      let fail = true;
      await page.route(`**/api/v1/${endpoint}?*`, (r) => (fail ? r.fulfill({ status: 500, json: { error: "Server xatosi" } }) : r.continue()));
      await page.goto(path);
      await expect(page.getByRole("alert").filter({ hasText: "Server xatosi" }).first()).toBeVisible();
      fail = false;
      await page.getByRole("button", { name: "Qayta urinish" }).first().click();
      const ready = endpoint === "warehouses" ? page.getByText("TSH-01", { exact: true }) : page.getByRole("table");
      await expect(ready.first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Qayta urinish" })).toHaveCount(0);
    });
  }

  test("[L4][S1] slow API (2 s) → loading status first, then data", async ({ page }) => {
    await page.route("**/api/v1/orders?*", async (r) => {
      await new Promise((res) => setTimeout(res, 2000));
      await r.continue();
    });
    await page.goto("/dashboard/orders");
    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("[NET][S3] connection drop (aborted requests) → error state, no crash; network back → recovers", async ({ page }) => {
    let offline = true;
    await page.route("**/api/v1/dashboard", (r) => (offline ? r.abort("internetdisconnected") : r.continue()));
    await page.goto("/dashboard");
    await expect(page.getByRole("alert").filter({ hasText: "Tarmoq bilan aloqa yo'q" })).toBeVisible();
    offline = false;
    await page.getByRole("button", { name: "Qayta urinish" }).first().click();
    await expect(page.getByText("Kunlik tushum — 30 kun")).toBeVisible();
  });

  test("[NET][S3] submit fails with 500 → modal stays open with alert, form keeps input", async ({ page }) => {
    await page.route("**/api/v1/clients", (r) => (r.request().method() === "POST" ? r.fulfill({ status: 500, json: { error: "Server xatosi" } }) : r.continue()));
    await page.goto("/dashboard/clients");
    await page.getByRole("button", { name: "Mijoz qo'shish" }).click();
    const form = dialog(page);
    await form.getByLabel("Savdo nuqtasi nomi").fill("Uzilish testi");
    await form.getByLabel("Hudud").fill("Toshkent");
    await form.getByRole("button", { name: "Saqlash" }).click();
    await expect(form.getByRole("alert")).toContainText("Server xatosi");
    await expect(form.getByLabel("Savdo nuqtasi nomi")).toHaveValue("Uzilish testi");
  });

  test("[NET][S3] combobox search fails → inline error, no crash", async ({ page }) => {
    await page.route("**/api/v1/clients?*", (r) => r.fulfill({ status: 500, json: { error: "Server xatosi" } }));
    await page.goto("/dashboard/orders");
    await page.getByRole("button", { name: "Yangi buyurtma" }).click();
    await dialog(page).getByLabel("Mijoz (savdo nuqtasi)").fill("abc");
    await expect(page.getByRole("listbox")).toContainText("Server xatosi");
  });

  test("[NET][S2] rapid typing in list search sends one final request and resets to page 1", async ({ page }) => {
    await page.goto("/dashboard/products");
    await expect(page.getByRole("table")).toBeVisible();
    await page.getByRole("button", { name: "Keyingi sahifa" }).click();
    await expect(page.getByText(/^2 \/ \d+$/)).toBeVisible();
    const seen: string[] = [];
    page.on("request", (r) => r.url().includes("/api/v1/products?") && seen.push(new URL(r.url()).searchParams.get("q") ?? ""));
    await page.getByPlaceholder("Nomi yoki SKU…").pressSequentially("cola", { delay: 40 });
    await expect(page.getByText(/^1 \/ \d+$/)).toBeVisible();
    await expect.poll(() => seen.filter((q) => q.length > 0)).toEqual(["cola"]);
  });
});
