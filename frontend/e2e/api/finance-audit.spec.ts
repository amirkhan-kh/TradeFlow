import { expect, test } from "../fixtures";

test.describe("API · payments and audits", () => {
  test("[API-FIN][S1] payment lowers the debt in the same transaction", async ({ api, make }) => {
    const { warehouse, product, client } = await make.scene(10, 20000);
    const order = await make.order(client.id, warehouse.id, [{ product_id: product.id, quantity: 2 }]);
    await make.status(order.id, "confirmed");
    await make.status(order.id, "shipped");
    expect((await make.clientRow(client.id)).balance).toBe(40000);
    const pay = await api.post("payments", { data: { client_id: client.id, amount: 15000, method: "card", note: "O'g'il bola orqali" } });
    expect(pay.status()).toBe(201);
    expect((await make.clientRow(client.id)).balance).toBe(25000);
    const list = await make.json<{ items: { client_id: number; amount: number; method: string }[] }>(await api.get(`payments?q=${encodeURIComponent(String(client.name))}`));
    expect(list.items[0]).toMatchObject({ client_id: client.id, amount: 15000, method: "card" });
  });

  test("[API-FIN][S2] amount 1 accepted; prepayment keeps a credit (negative balance)", async ({ api, make }) => {
    const client = await make.client();
    expect((await api.post("payments", { data: { client_id: client.id, amount: 1, method: "cash" } })).status()).toBe(201);
    expect((await make.clientRow(client.id)).balance).toBe(-1);
  });

  test("[API-FIN][S3] amount 0 / negative, online method, unknown client → rejected, balance unchanged", async ({ api, make }) => {
    const client = await make.client();
    for (const data of [
      { client_id: client.id, amount: 0, method: "cash" },
      { client_id: client.id, amount: -5, method: "cash" },
      { client_id: client.id, amount: 100, method: "payme" },
    ]) {
      expect((await api.post("payments", { data })).status()).toBe(422);
    }
    expect([404, 409, 422]).toContain((await api.post("payments", { data: { client_id: 999999999, amount: 100, method: "cash" } })).status());
    expect((await make.clientRow(client.id)).balance).toBe(0);
  });

  test("[API-AUD][S1] audit: complete needs all counts, approve sets stock to counted with adjust movements", async ({ api, make }) => {
    const { warehouse, product } = await make.scene(10);
    const p2 = await make.product();
    await make.stockIn(warehouse.id, p2.id, 4);

    const audit = await make.json(await api.post("audits", { data: { warehouse_id: warehouse.id, note: "E2E" } }));
    const full = await make.json<{ status: string; items: { product_id: number; expected: number }[] }>(await api.get(`audits/${audit.id}`));
    expect(full.status).toBe("in_progress");
    expect(full.items.map((i) => [i.product_id, i.expected]).sort()).toEqual([[product.id, 10], [p2.id, 4]].sort());

    await make.json(await api.put(`audits/${audit.id}/items`, { data: { items: [{ product_id: product.id, counted: 8 }] } }), [204]);
    const early = await api.post(`audits/${audit.id}/complete`);
    expect(early.status()).toBe(422);
    expect((await early.json()).error).toMatch(/sanalmagan/);

    await make.json(await api.put(`audits/${audit.id}/items`, { data: { items: [{ product_id: p2.id, counted: 6 }] } }), [204]);
    expect((await api.post(`audits/${audit.id}/complete`)).status()).toBe(204);
    const locked = await api.put(`audits/${audit.id}/items`, { data: { items: [{ product_id: p2.id, counted: 1 }] } });
    expect(locked.status()).toBe(409);

    expect((await api.post(`audits/${audit.id}/approve`)).status()).toBe(204);
    expect((await make.stock(warehouse.id, product)).quantity).toBe(8);
    expect((await make.stock(warehouse.id, p2)).quantity).toBe(6);
    const moves = await make.json<{ items: { type: string; product_id: number }[] }>(await api.get(`stock/movements?warehouse_id=${warehouse.id}&status=adjust&limit=20`));
    expect(moves.items.filter((m) => m.type === "adjust").length).toBeGreaterThanOrEqual(2);
    expect((await api.post(`audits/${audit.id}/approve`)).status()).toBe(409);
  });

  test("[API-AUD][S3] approve in_progress → 409; negative count → 422; no warehouse → 422", async ({ api, make }) => {
    const { warehouse, product } = await make.scene(3);
    const audit = await make.json(await api.post("audits", { data: { warehouse_id: warehouse.id } }));
    expect((await api.post(`audits/${audit.id}/approve`)).status()).toBe(409);
    expect((await api.put(`audits/${audit.id}/items`, { data: { items: [{ product_id: product.id, counted: -1 }] } })).status()).toBe(422);
    expect((await api.post("audits", { data: {} })).status()).toBe(422);
  });
});
