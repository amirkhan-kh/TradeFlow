import { expect, type Locator, type Page } from "@playwright/test";

/** Server-side combobox (`SearchSelect`): type, wait for the option, pick it. */
export async function choose(page: Page, combobox: Locator, query: string, option: string | RegExp = query) {
  await combobox.click();
  await combobox.fill(query);
  const item = page.getByRole("option", { name: option }).first();
  await expect(item).toBeVisible();
  await item.click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
}

export const dialog = (page: Page) => page.locator("dialog[open]");

/** Resolves once React has hydrated the element, so clicks reach its handlers instead of the native form. */
export async function hydrated(page: Page, selector = "form") {
  await page.waitForFunction((s) => {
    const el = document.querySelector(s);
    return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  }, selector);
}

/** Fills the login form after hydration and submits it. */
export async function signIn(page: Page, username: string, password: string) {
  await hydrated(page);
  await page.getByLabel("Login").fill(username);
  await page.getByLabel("Parol", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Tizimga kirish" }).click();
}

/** Every screen reachable from the sidebar, with the heading it must show. */
export const SCREENS: [path: string, nav: string, heading: string][] = [
  ["/dashboard", "Dashboard", "Dashboard"],
  ["/dashboard/insights", "Aqlli agentlar", "Aqlli agentlar"],
  ["/dashboard/orders", "Buyurtmalar", "Buyurtmalar"],
  ["/dashboard/clients", "Mijozlar", "Mijozlar"],
  ["/dashboard/agents", "Savdo jamoasi", "Savdo jamoasi"],
  ["/dashboard/leads", "Lidlar", "Lidlar"],
  ["/dashboard/warehouses", "Omborlar", "Omborlar"],
  ["/dashboard/products", "Tovarlar", "Tovarlar"],
  ["/dashboard/stock", "Qoldiq va harakat", "Qoldiq va harakat"],
  ["/dashboard/audits", "Audit", "Audit"],
  ["/dashboard/deliveries", "Yetkazib berish", "Yetkazib berish"],
  ["/dashboard/finance", "Moliya", "Moliya"],
  ["/dashboard/staff", "Xodimlar va rollar", "Xodimlar va rollar"],
  ["/dashboard/activity", "Faoliyat jurnali", "Faoliyat jurnali"],
  ["/dashboard/integrations", "Integratsiyalar", "Integratsiyalar markazi"],
];
