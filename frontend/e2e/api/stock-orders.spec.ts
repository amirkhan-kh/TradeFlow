import { expect, test } from "../fixtures";

test.describe("API · stock and orders invariants", () => {
  test("[API-STK][S1] kirim: quantity +N and `in` movement", async ({ api, make }) => {
    const { warehouse, product } = await make.scene(0);
    await make.stockIn(warehouse.id, product.id, 25);
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 25, reserved: 0 });
    const moves = await make.json<{ items: { type: string; quantity: number; product_id: number }[] }>(await api.get(`stock/movements?warehouse_id=${warehouse.id}&limit=10`));
    expect(moves.items.find((m) => m.product_id === product.id)).toMatchObject({ type: "in", quantity: 25 });
  });

  test("[API-STK][S2] idempotency key: retried move is applied once; chiqim of everything → 0", async ({ api, make }) => {
    const { warehouse, product } = await make.scene(0);
    const body = { type: "in", warehouse_id: warehouse.id, product_id: product.id, quantity: 7, idempotency_key: make.tag("idem-") };
    await Promise.all([api.post("stock/movements", { data: body }), api.post("stock/movements", { data: body })]);
    await api.post("stock/movements", { data: body });
    expect((await make.stock(warehouse.id, product)).quantity).toBe(7);
    const out = await api.post("stock/movements", { data: { type: "out", warehouse_id: warehouse.id, product_id: product.id, quantity: 7 } });
    expect(out.status()).toBe(201);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(0);
  });

  test("[API-STK][S3] stock never negative: chiqim > free → 409; same-warehouse transfer → 422; qty 0 → 422", async ({ api, make }) => {
    const { warehouse, product } = await make.scene(5);
    const out = await api.post("stock/movements", { data: { type: "out", warehouse_id: warehouse.id, product_id: product.id, quantity: 6 } });
    expect(out.status()).toBe(409);
    const same = await api.post("stock/movements", { data: { type: "transfer", warehouse_id: warehouse.id, to_warehouse_id: warehouse.id, product_id: product.id, quantity: 1 } });
    expect(same.status()).toBe(422);
    const zero = await api.post("stock/movements", { data: { type: "in", warehouse_id: warehouse.id, product_id: product.id, quantity: 0 } });
    expect(zero.status()).toBe(422);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(5);
  });

  test("[API-STK][S1] transfer: A −N, B +N", async ({ api, make }) => {
    const { warehouse: a, product } = await make.scene(10);
    const b = await make.warehouse();
    const res = await api.post("stock/movements", { data: { type: "transfer", warehouse_id: a.id, to_warehouse_id: b.id, product_id: product.id, quantity: 4 } });
    expect(res.status()).toBe(201);
    expect((await make.stock(a.id, product)).quantity).toBe(6);
    expect((await make.stock(b.id, product)).quantity).toBe(4);
  });

  test("[API-ORD][S1] full lifecycle: reserve → ship consumes stock, debt grows, delivery created → delivered", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(20, 15000);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 4 }], 10);
    expect(order).toMatchObject({ status: "new", total: 54000 });

    expect((await make.status(order.id, "confirmed")).status()).toBe(200);
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 20, reserved: 4 });

    const courier = (await make.json<{ items: { id: number }[] }>(await api.get("users?role=courier"))).items[0];
    expect((await make.status(order.id, "shipped", { courier_id: courier.id, vehicle: "01 A 777 AA" })).status()).toBe(200);
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 16, reserved: 0 });
    expect((await make.clientRow(client.id)).balance).toBe(54000);

    const deliveries = await make.json<{ items: { order_id: number; status: string; courier_id: number }[] }>(await api.get(`deliveries?q=${order.number}`));
    expect(deliveries.items[0]).toMatchObject({ order_id: order.id, status: "pending", courier_id: courier.id });

    expect((await make.status(order.id, "delivered")).status()).toBe(200);
    const done = await make.json<{ status: string; delivery_status: string }>(await api.get(`orders/${order.id}`));
    expect(done).toMatchObject({ status: "delivered", delivery_status: "delivered" });
  });

  test("[API-ORD][S2] cancel from confirmed releases the reserve; same product twice sums up", async ({ make }) => {
    const { warehouse, product, client } = await make.scene(10);
    const order = await make.order(client.id, warehouse.id, [
      { product_id: product.id, quantity: 3 },
      { product_id: product.id, quantity: 2 },
    ]);
    expect(order.total).toBe(50000);
    await make.status(order.id, "confirmed");
    expect((await make.stock(warehouse.id, product)).reserved).toBe(5);
    expect((await make.status(order.id, "cancelled")).status()).toBe(200);
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 10, reserved: 0 });
  });

  test("[API-ORD][S3] state machine: illegal transitions → 409, nothing changes", async ({ make }) => {
    const { warehouse, product, client } = await make.scene(10);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 1 }]);
    expect((await make.status(order.id, "shipped")).status()).toBe(409);
    expect((await make.status(order.id, "delivered")).status()).toBe(409);
    await make.status(order.id, "cancelled");
    expect((await make.status(order.id, "confirmed")).status()).toBe(409);
    expect(await make.stock(warehouse.id, product)).toMatchObject({ quantity: 10, reserved: 0 });
    expect((await make.status(999999999, "confirmed")).status()).toBe(404);
  });

  test("[API-ORD][S3] confirm without enough stock → 409, status stays new", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(3);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 4 }]);
    const res = await make.status(order.id, "confirmed");
    expect(res.status()).toBe(409);
    expect((await (await api.get(`orders/${order.id}`)).json()).status).toBe("new");
    expect((await make.stock(warehouse.id, product)).reserved).toBe(0);
  });

  test("[API-ORD][S3] race: two parallel confirms competing for the same stock → exactly one wins", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(5);
    const [a, b] = await Promise.all([
      make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 4 }]),
      make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 4 }]),
    ]);
    const codes = (await Promise.all([make.status(a.id, "confirmed"), make.status(b.id, "confirmed")])).map((r) => r.status()).sort();
    expect(codes).toEqual([200, 409]);
    const s = await make.stock(warehouse.id, product);
    expect(s.reserved).toBe(4);
    expect(s.reserved).toBeLessThanOrEqual(s.quantity);
    const statuses = await Promise.all([a, b].map(async (o) => (await (await api.get(`orders/${o.id}`)).json()).status));
    expect(statuses.sort()).toEqual(["confirmed", "new"]);
  });

  test("[API-ORD][S3] credit limit: balance + total == limit allowed, over limit → 409", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(50, 10000, 30000);
    const exact = await api.post("orders", { data: { client_id: client.id, warehouse_id: warehouse.id, items: [{ product_id: product.id, quantity: 3 }] } });
    expect(exact.status()).toBe(201);
    const order = await exact.json();
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    expect((await make.clientRow(client.id)).balance).toBe(30000);
    const over = await api.post("orders", { data: { client_id: client.id, warehouse_id: warehouse.id, items: [{ product_id: product.id, quantity: 1 }] } });
    expect(over.status()).toBe(409);
    expect((await over.json()).error).toMatch(/kredit limiti/i);
  });

  test("[API-ORD][S3] validation: discount 51, no items, qty 0, unknown product → 4xx", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(5);
    const base = { client_id: client.id, warehouse_id: warehouse.id };
    expect((await api.post("orders", { data: { ...base, discount_pct: 51, items: [{ product_id: product.id, quantity: 1 }] } })).status()).toBe(422);
    expect((await api.post("orders", { data: { ...base, items: [] } })).status()).toBe(422);
    expect((await api.post("orders", { data: { ...base, items: [{ product_id: product.id, quantity: 0 }] } })).status()).toBe(422);
    const unknown = await api.post("orders", { data: { ...base, items: [{ product_id: 999999999, quantity: 1 }] } });
    expect([404, 409, 422]).toContain(unknown.status());
  });
});
