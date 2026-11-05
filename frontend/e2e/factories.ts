import { expect, type APIRequestContext, type APIResponse } from "@playwright/test";

export interface Row {
  id: number;
  [key: string]: unknown;
}

/** Creates isolated test data through the public API; every name carries the test's unique id. */
export class Factory {
  private n = 0;
  constructor(
    readonly api: APIRequestContext,
    readonly uid: string,
  ) {}

  /** Unique token for one entity inside the test. */
  tag(prefix = "") {
    return `${prefix}${this.uid}${++this.n}`;
  }

  async json<T = Row>(res: APIResponse, status = [200, 201]): Promise<T> {
    expect(status, `${res.url()} → ${res.status()} ${await res.text()}`).toContain(res.status());
    return res.status() === 204 ? (undefined as T) : res.json();
  }

  warehouse(data: Partial<{ code: string; name: string; city: string; capacity: number }> = {}) {
    const t = this.tag();
    return this.api.post("warehouses", { data: { code: `E${t}`.slice(0, 20), name: `E2E ombor ${t}`, city: "Toshkent", capacity: 100, ...data } }).then((r) => this.json(r));
  }

  product(data: Partial<{ sku: string; name: string; price: number; min_stock: number; active: boolean; category: string }> = {}) {
    const t = this.tag();
    return this.api
      .post("products", { data: { sku: `E2E-${t}`.slice(0, 40), name: `E2E tovar ${t}`, category: "E2E sinov", unit: "dona", price: 10000, cost: 7000, min_stock: 0, ...data } })
      .then((r) => this.json(r));
  }

  client(data: Partial<{ name: string; credit_limit: number; region: string; phone: string }> = {}) {
    const t = this.tag();
    return this.api.post("clients", { data: { name: `E2E mijoz ${t}`, region: "Toshkent", segment: "B", credit_limit: 0, ...data } }).then((r) => this.json(r));
  }

  stockIn(warehouse_id: number, product_id: number, quantity: number) {
    return this.api.post("stock/movements", { data: { type: "in", warehouse_id, product_id, quantity } }).then((r) => this.json(r));
  }

  order(client_id: number, warehouse_id: number, items: { product_id: number; quantity: number }[], discount_pct = 0) {
    return this.api.post("orders", { data: { client_id, warehouse_id, items, discount_pct } }).then((r) => this.json<Row & { number: string; total: number; status: string }>(r));
  }

  status(orderId: number, status: string, extra: Record<string, unknown> = {}) {
    return this.api.post(`orders/${orderId}/status`, { data: { status, ...extra } });
  }

  /** Free/total stock of one product in one warehouse. */
  async stock(warehouse_id: number, product: { id: number; sku?: unknown }) {
    const body = await this.json<{ items: { product_id: number; quantity: number; reserved: number; available: number }[] }>(
      await this.api.get(`stock?warehouse_id=${warehouse_id}&q=${encodeURIComponent(String(product.sku))}&limit=50`),
    );
    return body.items.find((i) => i.product_id === product.id) ?? { quantity: 0, reserved: 0, available: 0 };
  }

  async clientRow(id: number) {
    return this.json<Row & { balance: number; credit_limit: number }>(await this.api.get(`clients/${id}`));
  }

  /** Warehouse + product with `qty` in stock + client: the common start of order tests. */
  async scene(qty = 50, price = 10000, credit_limit = 0) {
    const [warehouse, product, client] = await Promise.all([this.warehouse(), this.product({ price }), this.client({ credit_limit })]);
    if (qty > 0) await this.stockIn(warehouse.id, product.id, qty);
    return { warehouse, product, client };
  }

  user(role: string, password = "Sinov-Parol-2026!", extra: Record<string, unknown> = {}) {
    const t = this.tag("e2e.");
    return this.api
      .post("users", { data: { username: t, password, full_name: `E2E Xodim ${t}`, role, ...extra } })
      .then((r) => this.json<Row & { username: string; full_name: string }>(r))
      .then((u) => ({ ...u, password }));
  }
}
