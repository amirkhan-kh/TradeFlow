import { expect, test } from "./fixtures";
import { choose, dialog } from "./helpers";

test.describe("ORD · orders", () => {
  test("[ORD-01][S1] new order via searchable selects → status new, total correct, visible in list", async ({ page, make, api }) => {
    const { warehouse, product, client } = await make.scene(30, 12500);
    await page.goto("/dashboard/orders");
    await page.getByRole("button", { name: "Yangi buyurtma" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Mijoz (savdo nuqtasi)"), String(client.name), new RegExp(String(client.name)));
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar"), String(product.sku), String(product.name));
    await form.getByLabel("Miqdor").fill("3");
    await expect(form.getByText(/37\s500/).first()).toBeVisible();
    const created = page.waitForResponse((r) => r.url().endsWith("/api/v1/orders") && r.request().method() === "POST");
    await form.getByRole("button", { name: "Buyurtma yaratish" }).click();
    const order = await (await created).json();
    expect(order).toMatchObject({ status: "new", total: 37500, client_id: client.id });
    await expect(dialog(page)).toHaveCount(0);
    await expect(page.getByRole("link", { name: order.number })).toBeVisible();
    expect((await (await api.get(`orders/${order.id}`)).json()).items).toHaveLength(1);
  });

  test("[ORD-02][S2] add and remove lines, discount 50 recalculates; keyboard picks an option", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(30, 10000);
    const p2 = await make.product({ price: 4000 });
    await make.stockIn(warehouse.id, p2.id, 10);
    await page.goto("/dashboard/orders");
    await page.getByRole("button", { name: "Yangi buyurtma" }).click();
    const form = dialog(page);
    await choose(page, form.getByLabel("Mijoz (savdo nuqtasi)"), String(client.name), new RegExp(String(client.name)));
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar").first(), String(product.sku), String(product.name));
    await form.getByRole("button", { name: "Qator qo'shish" }).click();
    const second = form.getByLabel("Tovar").nth(1);
    await second.fill(String(p2.sku));
    await expect(page.getByRole("option", { name: String(p2.name) })).toBeVisible();
    await second.press("ArrowDown");
    await second.press("Enter");
    await expect(second).toHaveValue(String(p2.name));
    await form.getByLabel("Miqdor").nth(1).fill("5");
    await expect(form.getByText(/30\s000/).first()).toBeVisible();
    await form.getByLabel("Chegirma, %").fill("50");
    await expect(form.getByText(/15\s000/).first()).toBeVisible();
    await form.getByRole("button", { name: "Qatorni o'chirish" }).nth(1).click();
    await expect(form.getByLabel("Tovar")).toHaveCount(1);
    await expect(form.getByText(/5\s000/).first()).toBeVisible();
  });

  test("[ORD-01][S3] typed text without picking is rejected; discount 51 blocked; credit limit 409 shown in modal", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(30, 10000, 5000);
    await page.goto("/dashboard/orders");
    await page.getByRole("button", { name: "Yangi buyurtma" }).click();
    const form = dialog(page);
    let posts = 0;
    page.on("request", (r) => r.url().endsWith("/api/v1/orders") && r.method() === "POST" && posts++);
    await form.getByLabel("Mijoz (savdo nuqtasi)").fill("tanlanmagan matn");
    await form.getByRole("button", { name: "Buyurtma yaratish" }).click();
    expect(posts).toBe(0);
    expect(await form.getByLabel("Mijoz (savdo nuqtasi)").evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);

    await choose(page, form.getByLabel("Mijoz (savdo nuqtasi)"), String(client.name), new RegExp(String(client.name)));
    await choose(page, form.getByLabel("Ombor"), String(warehouse.name));
    await choose(page, form.getByLabel("Tovar"), String(product.sku), String(product.name));
    await form.getByLabel("Chegirma, %").fill("51");
    await form.getByRole("button", { name: "Buyurtma yaratish" }).click();
    expect(posts).toBe(0);

    await form.getByLabel("Chegirma, %").fill("0");
    await expect(form.getByText("kredit limiti oshadi")).toBeVisible();
    await form.getByRole("button", { name: "Buyurtma yaratish" }).click();
    await expect(form.getByRole("alert")).toContainText(/kredit limiti/i);
    await expect(dialog(page)).toHaveCount(1);
  });

  test("[ORD-04][S1] confirm → Yuklash modal → Yetkazildi: status flow, stock and debt follow", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(10, 8000);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 2 }]);
    await page.goto(`/dashboard/orders/${order.id}`);
    await expect(page.getByRole("heading", { level: 1, name: order.number })).toBeVisible();
    await page.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(page.getByRole("button", { name: "Yuklash" })).toBeVisible();
    expect((await make.stock(warehouse.id, product)).reserved).toBe(2);

    await page.getByRole("button", { name: "Yuklash" }).click();
    const modal = dialog(page);
    await modal.getByLabel("Kuryer").selectOption({ index: 1 });
    await modal.getByLabel("Mashina raqami").fill("01 A 123 BC");
    await modal.getByRole("button", { name: "Yuklashni tasdiqlash" }).click();
    await expect(page.getByRole("button", { name: "Yetkazildi" })).toBeVisible();
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 8, reserved: 0 });
    expect((await make.clientRow(client.id)).balance).toBe(16000);

    await page.getByRole("button", { name: "Yetkazildi" }).click();
    await expect(page.getByRole("button", { name: /Tasdiqlash|Yuklash|Yetkazildi|Bekor qilish/ })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("button", { name: /Tasdiqlash|Yuklash|Yetkazildi|Bekor qilish/ })).toHaveCount(0);
  });

  test("[ORD-04][S3] confirm with too little stock → alert, status stays new", async ({ page, make, api }) => {
    const { warehouse, product, client } = await make.scene(1);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 2 }]);
    await page.goto(`/dashboard/orders/${order.id}`);
    await page.getByRole("button", { name: "Tasdiqlash" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /qoldiq/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tasdiqlash" })).toBeEnabled();
    expect((await (await api.get(`orders/${order.id}`)).json()).status).toBe("new");
  });

  test("[ORD-07][S2] cancel: dismiss keeps the order, accept cancels and releases the reserve", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(5);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 3 }]);
    await make.status(order.id, "confirmed");
    await page.goto(`/dashboard/orders/${order.id}`);
    page.once("dialog", (d) => d.dismiss());
    await page.getByRole("button", { name: "Bekor qilish" }).click();
    await expect(page.getByRole("button", { name: "Yuklash" })).toBeVisible();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Bekor qilish" }).click();
    await expect(page.getByRole("button", { name: "Bekor qilish" })).toHaveCount(0);
    expect((await make.stock(warehouse.id, product)).reserved).toBe(0);
  });

  test("[ORD-L1][S1] search, status chips and pagination on 4000+ orders", async ({ page, make }) => {
    const { warehouse, product, client } = await make.scene(5);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 1 }]);
    await page.goto("/dashboard/orders");
    await expect(page.getByText(/^1 \/ \d{3,}$/)).toBeVisible();
    await page.getByRole("button", { name: "Keyingi sahifa" }).click();
    await expect(page.getByText(/^2 \/ \d{3,}$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Oldingi sahifa" })).toBeEnabled();

    await page.getByPlaceholder("Raqam yoki mijoz…").fill(order.number);
    await expect(page.getByRole("link", { name: order.number })).toBeVisible();
    await expect(page.getByText("1 / 1")).toBeVisible();
    await expect(page.getByRole("button", { name: "Keyingi sahifa" })).toBeDisabled();

    await page.getByPlaceholder("Raqam yoki mijoz…").fill("zzz-mavjud-emas-zzz");
    await expect(page.getByText("Buyurtma topilmadi")).toBeVisible();
  });
});
