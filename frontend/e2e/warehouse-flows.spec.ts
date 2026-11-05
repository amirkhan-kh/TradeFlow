import { expect, test } from "./fixtures";
import { choose, dialog } from "./helpers";

test.describe("STK · stock movements", () => {
  test("[STK-01][S1] Kirim through the modal: quantity grows, movement listed", async ({ page, make }) => {
    const { warehouse, product } = await make.scene(0);
    await page.goto("/dashboard/stock");
    await page.getByRole("button", { name: "Kirim" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar"), String(product.sku), new RegExp(String(product.sku)));
    await form.getByLabel("Miqdor").fill("12");
    await form.getByLabel("Izoh").fill("Nakladnoy №7, O'g'il");
    await form.getByRole("button", { name: "Tasdiqlash" }).dblclick();
    await expect(dialog(page)).toHaveCount(0);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(12);
  });

  test("[STK-02][S3] Chiqim more than available → alert in modal, quantity unchanged", async ({ page, make }) => {
    const { warehouse, product } = await make.scene(3);
    await page.goto("/dashboard/stock");
    await page.getByRole("button", { name: "Chiqim" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar"), String(product.sku), new RegExp(String(product.sku)));
    await form.getByLabel("Miqdor").fill("4");
    await form.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(form.getByRole("alert")).toContainText(/qoldiq/i);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(3);
  });

  test("[STK-03][S3] Ko'chirish to the same warehouse → 422 message", async ({ page, make }) => {
    const { warehouse, product } = await make.scene(3);
    await page.goto("/dashboard/stock");
    await page.getByRole("button", { name: "Ko'chirish" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Qaysi ombordan"), String(warehouse.name));
    await choose(page, form.getByLabel("Qaysi omborga"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar"), String(product.sku), new RegExp(String(product.sku)));
    await form.getByLabel("Miqdor").fill("1");
    await form.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(form.getByRole("alert")).toContainText(/boshqa omborni tanlang/i);
  });

  test("[STK-04][S2] warehouse filter: an empty warehouse shows the empty state", async ({ page, make }) => {
    const empty = await make.warehouse();
    await page.goto("/dashboard/stock");
    await choose(page, page.getByRole("combobox", { name: "Ombor" }), String(empty.name));
    await expect(page.getByText("Qoldiq topilmadi")).toBeVisible();
  });

  test("[STK-04][S1] deep link ?warehouse_id= preselects the filter and lists only that warehouse", async ({ page, make }) => {
    const { warehouse, product } = await make.scene(4);
    await page.goto(`/dashboard/stock?warehouse_id=${warehouse.id}`);
    await expect(page.getByRole("combobox", { name: "Ombor" })).toHaveValue(String(warehouse.name));
    await expect(page.getByRole("row", { name: new RegExp(String(product.sku)) })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(2);
  });
});

test.describe("CLI / FIN · clients and payments", () => {
  test("[CLI-01][S1] create client with apostrophe name; detail page shows it", async ({ page, make }) => {
    const name = `Do'kon O'g'il ${make.tag()}`;
    await page.goto("/dashboard/clients");
    await page.getByRole("button", { name: "Mijoz qo'shish" }).click();
    const form = dialog(page);
    await form.getByLabel("Savdo nuqtasi nomi").fill(name);
    await form.getByLabel("Hudud").fill("Farg'ona");
    await form.getByLabel("Telefon").fill("+998 90 111 22 33");
    await form.getByLabel("Kredit limiti, so'm").fill("0");
    await form.getByRole("button", { name: "Saqlash" }).click();
    await expect(dialog(page)).toHaveCount(0);
    await page.getByPlaceholder("Nomi, telefon, hudud…").fill(name);
    await page.getByRole("link", { name }).click();
    await expect(page).toHaveURL(/\/dashboard\/clients\/\d+$/);
    await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
  });

  test("[CLI-01][S3] required name empty → no request; negative limit blocked", async ({ page }) => {
    await page.goto("/dashboard/clients");
    await page.getByRole("button", { name: "Mijoz qo'shish" }).click();
    const form = dialog(page);
    let posts = 0;
    page.on("request", (r) => r.url().endsWith("/api/v1/clients") && r.method() === "POST" && posts++);
    await form.getByRole("button", { name: "Saqlash" }).click();
    await form.getByLabel("Savdo nuqtasi nomi").fill("Manfiy limit");
    await form.getByLabel("Hudud").fill("Toshkent");
    await form.getByLabel("Kredit limiti, so'm").fill("-1");
    await form.getByRole("button", { name: "Saqlash" }).click();
    expect(posts).toBe(0);
  });

  test("[CLI-03][S1] pay from client detail lowers the balance; modal close makes no payment", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(5, 10000);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 3 }]);
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    await page.goto(`/dashboard/clients/${client.id}`);
    await page.getByRole("button", { name: "To'lov qabul qilish" }).click();
    await dialog(page).getByRole("button", { name: "Yopish" }).click();
    expect((await make.clientRow(client.id)).balance).toBe(30000);
    await page.getByRole("button", { name: "To'lov qabul qilish" }).click();
    await dialog(page).getByLabel("Summa, so'm").fill("30000");
    await dialog(page).getByRole("button", { name: "To'lovni qabul qilish" }).click();
    await expect(dialog(page)).toHaveCount(0);
    await expect.poll(async () => (await make.clientRow(client.id)).balance).toBe(0);
  });

  test("[FIN-01][S1] finance form: debtor search, card payment, double click → one payment", async ({ page, make, api }) => {
    const { warehouse, product, client } = await make.scene(5, 10000);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 2 }]);
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    await page.goto("/dashboard/finance");
    await page.getByRole("button", { name: "To'lov qabul qilish" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Mijoz"), String(client.name));
    await form.getByLabel("Summa, so'm").fill("5000");
    await form.getByLabel("To'lov turi").selectOption("card");
    await form.getByRole("button", { name: "To'lovni qabul qilish" }).dblclick();
    await expect(dialog(page)).toHaveCount(0);
    await expect.poll(async () => (await make.clientRow(client.id)).balance).toBe(15000);
    const list = await (await api.get(`payments?q=${encodeURIComponent(String(client.name))}`)).json();
    expect(list.total).toBe(1);
  });

  test("[FIN-01][S3] amount 0 blocked; manual form never offers Payme/Click", async ({ page }) => {
    await page.goto("/dashboard/finance");
    await page.getByRole("button", { name: "To'lov qabul qilish" }).click();
    const form = dialog(page);
    const options = await form.getByLabel("To'lov turi").locator("option").allTextContents();
    expect(options).toEqual(["Naqd", "Karta", "Bank o'tkazmasi"]);
    await form.getByLabel("Summa, so'm").fill("0");
    expect(await form.getByLabel("Summa, so'm").evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  });
});

test.describe("WH / PRD · catalog", () => {
  test("[WH-01][S1] create warehouse; duplicate code → 409 alert", async ({ page, make }) => {
    const code = `W${make.tag()}`.slice(0, 20);
    await page.goto("/dashboard/warehouses");
    for (const attempt of [1, 2]) {
      await page.getByRole("button", { name: "Ombor qo'shish" }).click();
      const form = dialog(page);
      await form.getByLabel("Kod").fill(code);
      await form.getByLabel("Nomi").fill(`Sinov ombori ${code}`);
      await form.getByLabel("Shahar").fill("Qo'qon");
      await form.getByLabel("Sig'im (dona)").fill("0");
      await form.getByRole("button", { name: "Saqlash" }).click();
      if (attempt === 1) await expect(dialog(page)).toHaveCount(0);
      else await expect(form.getByRole("alert")).toContainText("Bunday yozuv allaqachon mavjud");
    }
  });

  test("[PRD-01][S1] create product, search by SKU, edit price; inactive product hidden from order form", async ({ page, make, api }) => {
    const sku = `P-${make.tag()}`;
    await page.goto("/dashboard/products");
    await page.getByRole("button", { name: "Tovar qo'shish" }).click();
    const form = dialog(page);
    await form.getByLabel("Nomi").fill(`Sinov tovari ${sku}`);
    await form.getByLabel("SKU").fill(sku);
    await form.getByLabel("Kategoriya").fill("E2E sinov");
    await form.getByLabel("Sotuv narxi").fill("12345");
    await form.getByLabel("Og'irlik, kg").fill("0.125");
    await form.getByRole("button", { name: "Saqlash" }).click();
    await expect(dialog(page)).toHaveCount(0);

    await page.getByPlaceholder("Nomi yoki SKU…").fill(sku);
    await expect(page.getByText(`Sinov tovari ${sku}`)).toBeVisible();
    await page.getByRole("button", { name: "Tahrirlash" }).first().click();
    await dialog(page).getByLabel("Sotuv narxi").fill("15000");
    await dialog(page).getByRole("checkbox").uncheck();
    await dialog(page).getByRole("button", { name: "Saqlash" }).click();
    await expect(dialog(page)).toHaveCount(0);

    const p = (await (await api.get(`products?q=${sku}`)).json()).items[0];
    expect(p).toMatchObject({ price: 15000, active: false });
    const active = await (await api.get(`products?q=${sku}&active=true`)).json();
    expect(active.total).toBe(0);
  });
});

test.describe("AUD · audits", () => {
  test("[AUD-01..04][S1] start audit → fill expected → complete → approve (dialog) → approved", async ({ page, make }) => {
    const { warehouse } = await make.scene(6);
    await page.goto("/dashboard/audits");
    await page.getByRole("button", { name: "Audit boshlash" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await form.getByRole("button", { name: "Auditni boshlash" }).click();
    await expect(page).toHaveURL(/\/dashboard\/audits\/\d+$/);

    await page.getByRole("button", { name: "Bo'shlarni kutilgan bilan to'ldirish" }).click();
    await page.getByRole("button", { name: "Yakunlash" }).click();
    await expect(page.getByRole("button", { name: "Tasdiqlash" })).toBeVisible();
    page.once("dialog", (d) => d.dismiss());
    await page.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(page.getByRole("button", { name: "Tasdiqlash" })).toBeVisible();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(page.getByRole("button", { name: "Tasdiqlash" })).toHaveCount(0);
    await expect(page.getByText(/tasdiqlandi/i).first()).toBeVisible();
  });

  test("[AUD-03][S3] complete with uncounted items → alert", async ({ page, make, api }) => {
    const { warehouse } = await make.scene(6);
    const audit = await (await api.post("audits", { data: { warehouse_id: warehouse.id } })).json();
    await page.goto(`/dashboard/audits/${audit.id}`);
    await page.getByRole("button", { name: "Yakunlash" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /sanalmagan/ })).toBeVisible();
  });
});
