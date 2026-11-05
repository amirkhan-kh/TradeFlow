import { expect, test } from "./fixtures";
import { hydrated } from "./helpers";

type Lang = "uz" | "uz-Cyrl" | "ru" | "en" | "ky";

/** What the shell must show per language: <html lang>, sidebar "Orders" link, overview heading, one KPI label. */
const SHELL: Record<Lang, { html: string; orders: string; heading: string; kpi: string }> = {
  uz: { html: "uz-Latn-UZ", orders: "Buyurtmalar", heading: "Dashboard", kpi: "Oylik tushum" },
  "uz-Cyrl": { html: "uz-Cyrl-UZ", orders: "Буюртмалар", heading: "Дашборд", kpi: "Ойлик тушум" },
  ru: { html: "ru-RU", orders: "Заказы", heading: "Дашборд", kpi: "Выручка за месяц" },
  en: { html: "en-US", orders: "Orders", heading: "Dashboard", kpi: "Monthly revenue" },
  ky: { html: "ky-KG", orders: "Буйрутмалар", heading: "Дашборд", kpi: "Айлык киреше" },
};

/** Uzbek UI words that must not stay on screen once another language is chosen. */
const UZ_LEAKS = ["Buyurtmalar", "Mijozlar", "Oylik tushum", "Debitorlik", "Barchasi", "Chiqish", "so'm"];

const setLang = (lang: string) => ({ name: "tf_lang", value: lang, domain: "localhost", path: "/" });

test.describe("I18N · dashboard shell", () => {
  test("[I18N-01][S1] switching to Russian translates shell, overview and status badges, and persists", async ({ page }) => {
    await page.goto("/dashboard");
    await hydrated(page, "select");
    await page.getByLabel("Til").selectOption("ru");

    await expect(page.getByRole("heading", { level: 1, name: "Дашборд" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru-RU");
    await expect(page.getByRole("link", { name: "Заказы" })).toBeVisible();
    await expect(page.getByText("Выручка за месяц")).toBeVisible();
    expect((await page.context().cookies()).find((c) => c.name === "tf_lang")?.value).toBe("ru");

    await page.getByRole("link", { name: "Заказы" }).click();
    await expect(page).toHaveURL(/\/dashboard\/orders$/);
    await expect(page.getByLabel("Язык")).toHaveValue("ru");
  });

  test("[I18N-01][S2] every language renders the shell and overview without Uzbek leftovers", async ({ page }) => {
    for (const [lang, want] of Object.entries(SHELL) as [Lang, (typeof SHELL)[Lang]][]) {
      await page.context().addCookies([setLang(lang)]);
      await page.goto("/dashboard");
      await expect(page.getByRole("heading", { level: 1, name: want.heading })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", want.html);
      await expect(page.getByRole("navigation", { name: "CRM" }).getByRole("link", { name: want.orders })).toBeVisible();
      await expect(page.getByText(want.kpi, { exact: true })).toBeVisible();
      if (lang === "uz") continue;
      const chrome = (await page.locator("aside").innerText()) + (await page.locator("header").innerText()) + (await page.locator("main .grid").first().innerText());
      for (const word of UZ_LEAKS) expect(chrome, `${lang}: "${word}" not translated`).not.toContain(word);
    }
  });

  test.describe(() => {
    test.use({ extraHTTPHeaders: {} });

    test("[I18N-01][S3] unknown language cookie falls back to Russian", async ({ page }) => {
      await page.context().addCookies([setLang("de")]);
      await page.goto("/dashboard");
      await expect(page.getByRole("heading", { level: 1, name: "Дашборд" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Заказы" })).toBeVisible();
      await expect(page.getByLabel("Язык")).toHaveValue("ru");
    });
  });
});

test.describe("I18N · login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("[I18N-02][S1] login page in English signs in to an English dashboard", async ({ page }) => {
    await page.goto("/login");
    await hydrated(page, "select");
    await page.getByLabel("Til").selectOption("en");
    await expect(page.getByRole("heading", { level: 1, name: "Welcome to TradeFlow" })).toBeVisible();
    await hydrated(page);
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password", { exact: true }).fill("admin123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
  });

  test("[I18N-02][S2] Uzbek Cyrillic login page keeps the brand in Latin", async ({ page }) => {
    await page.context().addCookies([setLang("uz-Cyrl")]);
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "TradeFlow'га хуш келибсиз" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Тизимга кириш" })).toBeVisible();
  });

  test("[I18N-02][S3] wrong password error comes back in the chosen language", async ({ page }) => {
    await page.context().addCookies([setLang("ru")]);
    await page.goto("/login");
    await hydrated(page);
    await page.getByLabel("Логин").fill("admin");
    await page.getByLabel("Пароль", { exact: true }).fill("notogri-parol");
    await page.getByRole("button", { name: "Вход в систему" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText("Неверный логин или пароль");
  });
});

test.describe("I18N · API messages", () => {
  const cases: [Lang, string][] = [
    ["uz", "Avtorizatsiya talab qilinadi"],
    ["uz-Cyrl", "Авторизация талаб қилинади"],
    ["ru", "Требуется авторизация"],
    ["en", "Authorization required"],
    ["ky", "Авторизация талап кылынат"],
  ];

  test("[I18N-03][S1] API errors follow the tf_lang cookie", async ({ apiAs }) => {
    const anon = await apiAs(null);
    for (const [lang, text] of cases) {
      const res = await anon.get("dashboard", { headers: { cookie: `tf_lang=${lang}` } });
      expect(res.status()).toBe(401);
      expect((await res.json()).error, lang).toBe(text);
    }
  });

  test("[I18N-03][S2] Accept-Language works for API clients without the cookie; templated messages keep their values", async ({ apiAs }) => {
    const anon = await apiAs(null, {});
    const res = await anon.get("dashboard", { headers: { "accept-language": "en-GB,en;q=0.9" } });
    expect((await res.json()).error).toBe("Authorization required");

    const admin = await apiAs("admin");
    const client = (await (await admin.get("clients?limit=1")).json()).items[0];
    const warehouse = (await (await admin.get("warehouses?limit=1")).json()).items[0];
    const order = await admin.post("orders", {
      headers: { "x-lang": "en" },
      data: { client_id: client.id, warehouse_id: warehouse.id, items: [{ product_id: 99999999, quantity: 1 }] },
    });
    expect(order.status()).toBe(422);
    expect((await order.json()).error).toBe("Product #99999999 not found or inactive");
  });

  test("[I18N-03][S3] unknown language falls back to Russian", async ({ apiAs }) => {
    const anon = await apiAs(null, {});
    const res = await anon.get("dashboard", { headers: { cookie: "tf_lang=de", "accept-language": "de-DE" } });
    expect((await res.json()).error).toBe("Требуется авторизация");
  });
});

/** Public site per language: URL, <html lang>, og:locale, start of the h1 and <title>, header "Features" link. */
const SITE_PAGES: Record<Lang, { path: string; html: string; og: string; h1: string; title: string; features: string }> = {
  ru: { path: "/", html: "ru-RU", og: "ru_RU", h1: "Управляйте крупной торговлей", title: "TradeFlow — система управления", features: "Возможности" },
  uz: { path: "/uz", html: "uz-Latn-UZ", og: "uz_UZ", h1: "Yirik savdo va omborxona", title: "TradeFlow — savdo, ombor", features: "Imkoniyatlar" },
  "uz-Cyrl": { path: "/uz-cyrl", html: "uz-Cyrl-UZ", og: "uz_UZ", h1: "Йирик савдо ва омборхона", title: "TradeFlow — савдо, омбор", features: "Имкониятлар" },
  en: { path: "/en", html: "en-US", og: "en_US", h1: "Run large-scale trade", title: "TradeFlow — sales, warehouse", features: "Features" },
  ky: { path: "/ky", html: "ky-KG", og: "ky_KG", h1: "Ири соода жана кампа", title: "TradeFlow — соода, кампа", features: "Мүмкүнчүлүктөр" },
};

const langCookie = async (page: import("@playwright/test").Page) => (await page.context().cookies()).find((c) => c.name === "tf_lang")?.value;
const bodyFont = (page: import("@playwright/test").Page) => page.evaluate(() => getComputedStyle(document.body).fontFamily);

test.describe("I18N · public site", () => {
  test.use({ storageState: { cookies: [], origins: [] }, extraHTTPHeaders: {} });

  test("[I18N-04][S1] every language has its own URL with translated copy and meta: html lang, title, og:locale, canonical, hreflang", async ({ page }) => {
    for (const [lang, want] of Object.entries(SITE_PAGES)) {
      await page.context().clearCookies();
      await page.goto(want.path);
      await expect(page.locator("html"), lang).toHaveAttribute("lang", want.html);
      expect(await page.title(), lang).toContain(want.title);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", want.og);
      expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).pathname, lang).toBe(want.path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(want.h1);
      await expect(page.locator("header nav").first().getByRole("link", { name: want.features })).toBeVisible();
      expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).pathname, lang).toBe(want.path);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
      expect(new URL((await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute("href"))!).pathname).toBe("/");
    }
  });

  test("[I18N-04][S2] picking a language opens its URL, / remembers it, /login follows it, footer switches back", async ({ page }) => {
    await page.goto("/");
    await hydrated(page, "header select");
    await page.getByRole("combobox", { name: "Язык" }).selectOption("en");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Run large-scale trade");
    expect(await langCookie(page)).toBe("en");

    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "Welcome to TradeFlow" })).toBeVisible();

    await page.goto("/en");
    await page.getByRole("contentinfo").getByRole("link", { name: "Русский" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru-RU");
    expect(new URL(page.url()).pathname).toBe("/");
    expect(await langCookie(page)).toBe("ru");
  });

  test("[I18N-04][S2] @mobile language picker sits in the mobile menu", async ({ page }) => {
    await page.goto("/en");
    await hydrated(page, "header button[aria-expanded]");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("combobox", { name: "Language" }).selectOption("ky");
    await expect(page).toHaveURL(/\/ky$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ky-KG");
  });

  test("[I18N-04][S3] /ru folds into /, unknown language URL is 404, Cyrillic pages use Manrope, sitemap lists every language", async ({ page, request }) => {
    await page.goto("/ru");
    expect(new URL(page.url()).pathname).toBe("/");
    expect((await page.goto("/de"))!.status()).toBe(404);

    await page.goto("/ky");
    expect(await bodyFont(page)).toContain("Manrope");
    await page.goto("/en");
    expect(await bodyFont(page)).toContain("Plus Jakarta Sans");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/uz", "/uz-cyrl", "/en", "/ky"]) expect(sitemap).toContain(`${path}</loc>`);
    expect(sitemap).toContain('hreflang="uz-Cyrl"');
  });
});
