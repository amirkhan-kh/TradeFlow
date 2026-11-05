import { expect, test } from "../fixtures";

test.describe("API · auth, roles, validation", () => {
  test("[API-AUTH][S1] login sets httpOnly cookie, /auth/me works, logout ends the session", async ({ playwright, baseURL, make }) => {
    const u = await make.user("manager");
    const ctx = await playwright.request.newContext({ baseURL: `${baseURL}/api/v1/` });
    const login = await ctx.post("auth/login", { data: { username: u.username, password: u.password } });
    expect(login.status()).toBe(200);
    expect(login.headers()["set-cookie"]).toMatch(/tf_token=.*HttpOnly/i);
    expect((await (await ctx.get("auth/me")).json()).user.username).toBe(u.username);
    expect((await ctx.post("auth/logout")).status()).toBe(204);
    expect((await ctx.get("auth/me")).status()).toBe(401);
    await ctx.dispose();
  });

  test("[API-AUTH][S3] wrong password 401; 6th attempt locked 429 even with the right password", async ({ playwright, baseURL, make }) => {
    const u = await make.user("courier");
    const ctx = await playwright.request.newContext({ baseURL: `${baseURL}/api/v1/` });
    for (let i = 0; i < 5; i++) expect((await ctx.post("auth/login", { data: { username: u.username, password: "xato-parol-123" } })).status()).toBe(401);
    expect((await ctx.post("auth/login", { data: { username: u.username, password: u.password } })).status()).toBe(429);
    await ctx.dispose();
  });

  test("[API-AUTH][S3] no cookie → 401 on every secured module", async ({ apiAs }) => {
    const anon = await apiAs(null);
    for (const path of ["dashboard", "orders", "products", "clients", "stock", "payments", "audits", "deliveries", "users", "leads", "agents", "insights", "integrations", "activity", "warehouses"]) {
      expect((await anon.get(path)).status(), path).toBe(401);
    }
    expect((await anon.post("orders", { data: {} })).status()).toBe(401);
  });

  test("[API-ROLE][S3] wrong role → 403 and nothing is written", async ({ apiAs, api, make }) => {
    const { warehouse, product, client } = await make.scene(10);
    const courier = await apiAs("courier1");
    const agent = await apiAs("agent1");
    const auditor = await apiAs("auditor1");
    const manager = await apiAs("manager");

    expect((await courier.post("products", { data: { sku: make.tag("X"), name: "X tovar", category: "E2E", price: 1 } })).status()).toBe(403);
    expect((await agent.post("stock/movements", { data: { type: "in", warehouse_id: warehouse.id, product_id: product.id, quantity: 5 } })).status()).toBe(403);
    expect((await auditor.post("orders", { data: { client_id: client.id, warehouse_id: warehouse.id, items: [{ product_id: product.id, quantity: 1 }] } })).status()).toBe(403);
    expect((await agent.post(`audits`, { data: { warehouse_id: warehouse.id } })).status()).toBe(403);
    expect((await manager.post("users", { data: { username: make.tag("x"), password: "Sinov-Parol-2026!", full_name: "X Y", role: "admin" } })).status()).toBe(403);
    expect((await manager.get("users/stats")).status()).toBe(403);
    expect((await manager.get("integrations")).status()).toBe(403);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(10);

    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 1 }]);
    expect((await agent.post(`orders/${order.id}/status`, { data: { status: "confirmed" } })).status()).toBe(403);
    expect((await (await api.get(`orders/${order.id}`)).json()).status).toBe("new");
  });

  test("[API-ROLE][S1] allowed roles: agent creates client and order, courier moves a delivery", async ({ apiAs, api, make }) => {
    const { warehouse, product } = await make.scene(10);
    const agent = await apiAs("agent1");
    const client = await make.json(await agent.post("clients", { data: { name: `Agent mijoz ${make.tag()}`, region: "Samarqand" } }));
    const order = await make.json(await agent.post("orders", { data: { client_id: client.id, warehouse_id: warehouse.id, items: [{ product_id: product.id, quantity: 2 }] } }));
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    const courier = await apiAs("courier1");
    const d = (await make.json<{ items: { id: number }[] }>(await api.get(`deliveries?q=${order.number}`))).items[0];
    expect((await courier.patch(`deliveries/${d.id}`, { data: { status: "on_route" } })).status()).toBe(200);
  });

  test("[API-VAL][S3] duplicates → 409, bad bodies → 422", async ({ api, make }) => {
    const w = await make.warehouse();
    expect((await api.post("warehouses", { data: { code: w.code, name: "Dublikat", city: "Toshkent" } })).status()).toBe(409);
    expect((await api.post("warehouses", { data: { code: make.tag("C"), name: "Manfiy", city: "Toshkent", capacity: -1 } })).status()).toBe(422);
    const p = await make.product();
    expect((await api.post("products", { data: { sku: p.sku, name: "Dublikat", category: "E2E", price: 1 } })).status()).toBe(409);
    expect((await api.post("products", { data: { sku: make.tag("N"), name: "Manfiy", category: "E2E", price: -1 } })).status()).toBe(422);
    expect((await api.post("products", { data: { sku: make.tag("I"), name: "IKPU", category: "E2E", price: 1, ikpu: "123" } })).status()).toBe(422);
    expect((await api.post("clients", { data: { name: "X", region: "Toshkent" } })).status()).toBe(422);
    expect((await api.post("clients", { data: { name: "INN xato", region: "Toshkent", inn: "12345" } })).status()).toBe(422);
    expect((await api.post("users", { data: { username: make.tag("weak"), password: "abcdefgh", full_name: "Zaif Parol", role: "courier" } })).status()).toBe(422);
  });

  test("[API-LIST][S2] pagination and search are safe with big data", async ({ api }) => {
    expect((await api.get("products?limit=201")).status()).toBe(422);
    expect((await api.get("orders?page=0")).status()).toBe(422);
    const far = await (await api.get("orders?page=100000&limit=15")).json();
    expect(far.items).toEqual([]);
    expect(far.total).toBeGreaterThan(1000);
    for (const q of ["Farg'ona", "'; DROP TABLE orders; --", "%_%", "Тошкент", "   "]) {
      const res = await api.get(`clients?q=${encodeURIComponent(q)}&limit=15`);
      expect(res.status(), q).toBe(200);
    }
    const fergana = await (await api.get(`clients?q=${encodeURIComponent("Farg'ona")}&limit=15`)).json();
    expect(fergana.total).toBeGreaterThan(0);
  });

  test("[API-PUB][S1] public demo form creates a lead; invalid body 422", async ({ apiAs, api, make }) => {
    const anon = await apiAs(null);
    const name = `O'g'iloy ${make.tag()}`;
    expect((await anon.post("public/leads", { data: { name, phone: "+998 90 123 45 67", company: "Sinov MChJ" } })).status()).toBe(201);
    expect((await anon.post("public/leads", { data: { name: "A", phone: "1" } })).status()).toBe(422);
    const leads = await (await api.get("leads?limit=50")).json();
    expect(leads.items.some((l: { name: string }) => l.name === name)).toBe(true);
  });

  test("[API-REF][S3] assignees must be active staff in the right role; closed warehouses take no orders or stock", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(10);
    const [courier, agent, gone] = await Promise.all([make.user("courier"), make.user("agent"), make.user("agent")]);
    expect((await api.post(`users/${gone.id}/status`, { data: { active: false } })).ok()).toBe(true);
    const unknown = 99_999_999;

    for (const agent_id of [courier.id, gone.id, unknown]) {
      expect((await api.post("clients", { data: { name: `Agentsiz ${make.tag()}`, region: "Toshkent", agent_id } })).status(), `client agent ${agent_id}`).toBe(422);
      expect((await api.post("orders", { data: { client_id: client.id, warehouse_id: warehouse.id, agent_id, items: [{ product_id: product.id, quantity: 1 }] } })).status()).toBe(422);
    }
    expect((await api.post("audits", { data: { warehouse_id: warehouse.id, auditor_id: courier.id } })).status()).toBe(422);
    const own = await make.json(await api.post("clients", { data: { name: `Agentli ${make.tag()}`, region: "Toshkent", agent_id: agent.id } }));
    expect(own.agent_id).toBe(agent.id);

    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 2 }]);
    expect((await make.status(order.id, "confirmed")).status()).toBe(200);
    expect((await make.status(order.id, "shipped", { courier_id: agent.id })).status()).toBe(422);
    expect((await make.status(order.id, "shipped", { courier_id: courier.id })).status()).toBe(200);
    const d = (await make.json<{ items: { id: number }[] }>(await api.get(`deliveries?q=${order.number}`))).items[0];
    expect((await api.patch(`deliveries/${d.id}`, { data: { courier_id: unknown } })).status()).toBe(422);

    const closed = await make.warehouse();
    expect((await api.put(`warehouses/${closed.id}`, { data: { code: closed.code, name: closed.name, city: "Toshkent", capacity: 100, active: false } })).ok()).toBe(true);
    expect((await api.post("orders", { data: { client_id: client.id, warehouse_id: closed.id, items: [{ product_id: product.id, quantity: 1 }] } })).status()).toBe(422);
    expect((await api.post("stock/movements", { data: { type: "in", warehouse_id: closed.id, product_id: product.id, quantity: 5 } })).status()).toBe(422);
    expect((await api.post("stock/movements", { data: { type: "transfer", warehouse_id: warehouse.id, to_warehouse_id: closed.id, product_id: product.id, quantity: 1 } })).status()).toBe(422);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(8);
    const picker = await make.json<{ items: { id: number }[] }>(await api.get(`warehouses?active=true&q=${encodeURIComponent(String(closed.code))}`));
    expect(picker.items).toEqual([]);
  });
});
