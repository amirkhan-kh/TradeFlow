import { expect, test } from "../fixtures";

/** Every screen's main request stays fast on the full demo dataset (500+ products, 4000+ orders). */
const ENDPOINTS = [
  "dashboard",
  "insights",
  "agents",
  "orders?limit=15",
  "orders?limit=15&status=delivered&q=Market",
  "orders?page=200&limit=15",
  "products?limit=15&q=cola",
  "clients?limit=15&status=debt",
  "stock?limit=15&low=true",
  "stock/movements?limit=15",
  "payments?limit=15",
  "deliveries?limit=15",
  "audits?limit=15",
  "leads?limit=15",
  "users",
  "activity?limit=15",
];

test.describe("API · performance budget", () => {
  for (const path of ENDPOINTS) {
    test(`[API-PERF][S2] ${path} median < 400 ms`, async ({ api }) => {
      const times: number[] = [];
      for (let i = 0; i < 3; i++) {
        const t = performance.now();
        const res = await api.get(path);
        times.push(performance.now() - t);
        expect(res.status()).toBe(200);
      }
      times.sort((a, b) => a - b);
      expect(times[1]).toBeLessThan(400);
    });
  }
});
