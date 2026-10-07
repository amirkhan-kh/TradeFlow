import bcrypt from "bcryptjs";
import type { PoolClient } from "pg";
import { config } from "./config.js";
import { pool, tx } from "./db.js";
import { HttpError } from "./http.js";
import * as users from "../modules/users/repository.js";
import * as stock from "../modules/stock/repository.js";
import * as orders from "../modules/orders/repository.js";
import { applyStatus } from "../modules/orders/service.js";
import * as audits from "../modules/audits/repository.js";
import { approveIn } from "../modules/audits/service.js";
import { changeBalance } from "../modules/clients/repository.js";

let state = 20261007;
const rand = () => ((state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

const WAREHOUSES = [
  ["TSH-01", "Toshkent Markaziy", "Toshkent", "Yunusobod t., Amir Temur ko'chasi 108", 12000, "Jasur Karimov"],
  ["TSH-02", "Sergeli Logistika Hub", "Toshkent", "Sergeli t., Yangi Sergeli 4", 8000, "Dilshod Rahimov"],
  ["SMQ-01", "Samarqand Ombori", "Samarqand", "Registon ko'chasi 21", 6000, "Bekzod Aliyev"],
  ["FRG-01", "Farg'ona vodiysi", "Farg'ona", "Al-Farg'oniy ko'chasi 5", 5000, "Shoxrux Tursunov"],
  ["BXR-01", "Buxoro Ombori", "Buxoro", "Navoiy shoh ko'chasi 12", 4000, "Akmal Sobirov"],
] as const;

const PRODUCTS: [string, string, string, number, number, number][] = [
  // name, category, unit, weight kg, price, min stock
  ["Coca-Cola 1.5L", "Ichimliklar", "dona", 1.6, 12000, 120],
  ["Fanta 1L", "Ichimliklar", "dona", 1.1, 9500, 100],
  ["Hydrolife suv 1.5L", "Ichimliklar", "dona", 1.55, 4000, 200],
  ["Nestea limon 0.5L", "Ichimliklar", "dona", 0.55, 7000, 80],
  ["Lipton qora choy 100 paket", "Choy va qahva", "quti", 0.25, 28000, 40],
  ["Nescafe Gold 190g", "Choy va qahva", "dona", 0.4, 98000, 25],
  ["Musaffo sut 3.2% 1L", "Sut mahsulotlari", "dona", 1.05, 13000, 150],
  ["Nestle qatiq 450g", "Sut mahsulotlari", "dona", 0.47, 9000, 90],
  ["Lactel pishloq 200g", "Sut mahsulotlari", "dona", 0.21, 32000, 30],
  ["Makfa makaron 400g", "Oziq-ovqat", "dona", 0.41, 11000, 120],
  ["Guruch Lazer 1kg", "Oziq-ovqat", "dona", 1, 26000, 100],
  ["Oltin don un 10kg", "Oziq-ovqat", "qop", 10, 85000, 40],
  ["Kungaboqar yog'i 1L", "Oziq-ovqat", "dona", 0.95, 24000, 120],
  ["Shakar 1kg", "Oziq-ovqat", "dona", 1, 14000, 150],
  ["Snickers 50g", "Shirinliklar", "dona", 0.05, 8000, 200],
  ["Alpen Gold shokolad 85g", "Shirinliklar", "dona", 0.09, 13000, 120],
  ["Crafers vafli 300g", "Shirinliklar", "dona", 0.3, 17000, 60],
  ["Yupqa lavash 10 dona", "Non mahsulotlari", "paket", 0.5, 12000, 80],
  ["Ariel kir yuvish 3kg", "Maishiy kimyo", "dona", 3, 89000, 30],
  ["Fairy 500ml", "Maishiy kimyo", "dona", 0.55, 19000, 60],
  ["Domestos 1L", "Maishiy kimyo", "dona", 1.1, 27000, 40],
  ["Pomidor pastasi 380g", "Konserva", "dona", 0.42, 15000, 80],
  ["Tuna konserva 185g", "Konserva", "dona", 0.2, 22000, 50],
  ["Gigiyenik salfetka 100", "Gigiyena", "paket", 0.3, 16000, 60],
];

const REGIONS: Record<string, { warehouses: string[]; names: string[] }> = {
  Toshkent: {
    warehouses: ["TSH-01", "TSH-02"],
    names: ["Korzinka Yunusobod", "Makro Chilonzor", "Baraka Market", "Havas Sergeli", "Oila Supermarket", "Mega Planet do'kon", "Yangi Hayot minimarket", "Chorsu Savdo", "Olmazor Market", "Bodomzor do'kon", "Uchtepa Savdo", "Family Market", "Next Mart", "Asaka Market"],
  },
  Samarqand: {
    warehouses: ["SMQ-01"],
    names: ["Registon Market", "Siyob Savdo", "Samarqand Darvoza", "Bulung'ur do'kon", "Urgut Market", "Kattaqo'rg'on Savdo", "Afrosiyob Mart"],
  },
  "Farg'ona": {
    warehouses: ["FRG-01"],
    names: ["Marg'ilon Bozor", "Qo'qon Savdo", "Farg'ona City Mart", "Andijon Market", "Namangan Plaza", "Rishton do'kon", "Quva Savdo"],
  },
  Buxoro: {
    warehouses: ["BXR-01"],
    names: ["Labi Hovuz Market", "Kogon Savdo", "Navoiy Mart", "G'ijduvon do'kon", "Buxoro Darvoza", "Vobkent Market"],
  },
};

const AGENTS = [
  ["agent1", "Sardor Yusupov", "Toshkent", 80_000_000],
  ["agent2", "Madina Qodirova", "Toshkent", 75_000_000],
  ["agent3", "Otabek Ergashev", "Samarqand", 85_000_000],
  ["agent4", "Nodira Xolmatova", "Farg'ona", 90_000_000],
  ["agent5", "Javohir Nematov", "Buxoro", 75_000_000],
] as const;

const day = (offset: number, hour = int(8, 18)) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, int(0, 59), 0, 0);
  return d;
};

async function seedDemo(db: PoolClient, adminId: number) {
  const demoHash = await bcrypt.hash("demo123", 10);
  await users.insert(db, { username: "manager", password_hash: demoHash, full_name: "Aziza Usmonova", role: "manager", phone: "+998 90 100 20 30" });
  const agentIds: Record<string, number[]> = {};
  for (const [username, full_name, region, plan] of AGENTS) {
    const u = await users.insert(db, { username, password_hash: demoHash, full_name, role: "agent", region, monthly_plan: plan, phone: `+998 9${int(0, 9)} ${int(100, 999)} ${int(10, 99)} ${int(10, 99)}` });
    (agentIds[region] ??= []).push(u.id);
  }
  const couriers: number[] = [];
  for (const [username, full_name] of [["courier1", "Ulug'bek Hamidov"], ["courier2", "Rustam Soliyev"], ["courier3", "Farrux Qosimov"]]) {
    couriers.push((await users.insert(db, { username, password_hash: demoHash, full_name, role: "courier", phone: `+998 93 ${int(100, 999)} ${int(10, 99)} ${int(10, 99)}` })).id);
  }
  const auditors: number[] = [];
  for (const [username, full_name] of [["auditor1", "Gulnora Saidova"], ["auditor2", "Bobur Mirzayev"]]) {
    auditors.push((await users.insert(db, { username, password_hash: demoHash, full_name, role: "auditor" })).id);
  }

  const wh: Record<string, number> = {};
  for (const [code, name, city, address, capacity, manager] of WAREHOUSES) {
    const { rows } = await db.query(
      `INSERT INTO warehouses (code, name, city, address, capacity, manager_name) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [code, name, city, address, capacity, manager],
    );
    wh[code] = rows[0].id;
  }

  const products: { id: number; price: number; popularity: number }[] = [];
  for (const [i, [name, category, unit, weight, price, min]] of PRODUCTS.entries()) {
    const expires = i === 7 || i === 17 ? day(int(10, 30)).toISOString().slice(0, 10) : null;
    const { rows } = await db.query(
      `INSERT INTO products (sku, name, category, unit, weight_kg, price, cost, min_stock, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [`TF-${String(1001 + i)}`, name, category, unit, weight, price, Math.round(price * 0.78), Math.round(min / 5), expires],
    );
    products.push({ id: rows[0].id, price, popularity: 0.4 + rand() * 1.2 });
  }

  const clients: { id: number; region: string; agent: number; warehouses: number[] }[] = [];
  for (const [region, { warehouses, names }] of Object.entries(REGIONS)) {
    for (const name of names) {
      const agent = pick(agentIds[region]);
      const segment = pick(["A", "A", "B", "B", "B", "C"]);
      const limit = segment === "A" ? 60_000_000 : segment === "B" ? 30_000_000 : 12_000_000;
      const { rows } = await db.query(
        `INSERT INTO clients (name, owner_name, phone, region, address, segment, agent_id, credit_limit, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now() - interval '200 days') RETURNING id`,
        [name, pick(["Alisher", "Kamola", "Rustam", "Dilnoza", "Sherzod", "Malika", "Anvar"]) + " " + pick(["Karimov", "Tosheva", "Nazarov", "Ismoilova", "Rasulov"]), `+998 9${int(0, 9)} ${int(100, 999)} ${int(10, 99)} ${int(10, 99)}`, region, `${region}, ${int(1, 99)}-uy`, segment, agent, limit],
      );
      clients.push({ id: rows[0].id, region, agent, warehouses: warehouses.map((c) => wh[c]) });
    }
  }

  const START = -185;
  const restock = async (offset: number, skip: Set<number>) => {
    for (const w of Object.values(wh)) {
      for (const p of products) {
        if (skip.has(p.id)) continue;
        const { rows } = await db.query(`SELECT quantity FROM stock WHERE warehouse_id=$1 AND product_id=$2`, [w, p.id]);
        const target = Math.round(140 * p.popularity * (w === wh["TSH-01"] ? 1.6 : 1));
        const qty = target - (rows[0]?.quantity ?? 0);
        if (qty <= target * 0.35) continue;
        await stock.add(db, w, p.id, qty);
        await stock.recordMovement(db, { type: "in", warehouse_id: w, product_id: p.id, quantity: qty, reference: `KIR-${offset + 1000}`, note: "Yetkazib beruvchidan kirim", user_id: adminId, created_at: day(offset, 7) });
      }
    }
  };

  const scarce = new Set(products.slice(0, 3).map((p) => p.id).concat(products[14].id));
  const auditPlan = new Map<number, [string, number, boolean]>([
    [-150, ["TSH-01", 0, true]],
    [-120, ["SMQ-01", 1, true]],
    [-90, ["FRG-01", 0, true]],
    [-60, ["TSH-02", 1, true]],
    [-25, ["TSH-01", 0, true]],
    [-12, ["SMQ-01", 1, true]],
  ]);

  for (let offset = START; offset <= 0; offset++) {
    if ((offset - START) % 6 === 0) await restock(offset, offset > -18 ? scarce : new Set());

    const growth = 0.55 + 0.45 * ((offset - START) / -START);
    const weekend = day(offset).getDay() === 0;
    const count = weekend ? int(0, 2) : Math.round(int(5, 9) * growth);

    for (let k = 0; k < count; k++) {
      const client = pick(clients);
      const created = day(offset);
      const lines = new Map<number, number>();
      for (let n = int(2, 5); n > 0; n--) {
        const p = pick(products);
        lines.set(p.id, (lines.get(p.id) ?? 0) + Math.max(1, Math.round(int(6, 40) * p.popularity)));
      }
      const items = [...lines].map(([product_id, quantity]) => ({ product_id, quantity, price: products.find((p) => p.id === product_id)!.price }));
      const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
      const discount = pick([0, 0, 0, 2, 3, 5]);
      const order = await orders.insert(
        db,
        { client_id: client.id, agent_id: client.agent, warehouse_id: pick(client.warehouses), subtotal, discount_pct: discount, total: Math.round(subtotal * (1 - discount / 100)), created_at: created },
        items,
      );

      const age = -offset;
      const step = (h: number) => new Date(created.getTime() + h * 3600_000);
      try {
        await db.query("SAVEPOINT o");
        if (rand() < 0.04 && age > 1) {
          await applyStatus(db, order.id, { status: "cancelled" }, adminId, step(2));
        } else {
          if (age === 0 && rand() < 0.5) {
            await db.query("RELEASE SAVEPOINT o");
            continue;
          }
          await applyStatus(db, order.id, { status: "confirmed" }, adminId, step(1));
          if (age === 0 && rand() < 0.5) {
            await db.query("RELEASE SAVEPOINT o");
            continue;
          }
          await applyStatus(db, order.id, { status: "shipped", courier_id: pick(couriers), vehicle: pick(["01 A 123 BC", "01 B 777 AA", "30 C 456 DA"]) }, adminId, step(18));
          if (age <= 1 && rand() < 0.6) {
            if (rand() < 0.5) await db.query(`UPDATE deliveries SET status='on_route' WHERE order_id=$1`, [order.id]);
            await db.query("RELEASE SAVEPOINT o");
            continue;
          }
          if (rand() < 0.02) {
            await db.query(`UPDATE deliveries SET status='failed', note='Mijoz manzilda topilmadi' WHERE order_id=$1`, [order.id]);
          } else {
            await applyStatus(db, order.id, { status: "delivered" }, adminId, step(int(20, 40)));
          }
          if (rand() < 0.88 && age > 2) {
            const share = rand() < 0.75 ? 1 : 0.5;
            const amount = Math.round(order.total * share);
            const paidAt = step(24 * int(1, Math.min(age, 14)));
            if (paidAt < new Date()) {
              await db.query(
                `INSERT INTO payments (client_id, order_id, amount, method, user_id, created_at) VALUES ($1,$2,$3,$4,$5,$6)`,
                [client.id, order.id, amount, pick(["cash", "cash", "transfer", "card"]), adminId, paidAt],
              );
              await changeBalance(db, client.id, -amount);
            }
          }
        }
        await db.query("RELEASE SAVEPOINT o");
      } catch (err) {
        if (!(err instanceof HttpError)) throw err;
        await db.query("ROLLBACK TO SAVEPOINT o");
        await db.query(`UPDATE orders SET status='cancelled', note='Qoldiq yetarli emas' WHERE id=$1`, [order.id]);
      }
    }

    const plan = auditPlan.get(offset);
    if (plan) {
      const [code, auditorIdx, approve] = plan;
      const at = day(offset, 9);
      const audit = await audits.insert(db, { warehouse_id: wh[code], auditor_id: auditors[auditorIdx], note: "Rejali inventarizatsiya", created_at: at });
      await db.query(
        `UPDATE audit_items SET counted = GREATEST(0, expected + CASE WHEN random() < 0.12 THEN floor(random() * 9)::int - 6 ELSE 0 END) WHERE audit_id=$1`,
        [audit.id],
      );
      await audits.setStatus(db, audit.id, "completed", new Date(at.getTime() + 6 * 3600_000));
      if (approve && offset < -15) await approveIn(db, audit.id, adminId, new Date(at.getTime() + 26 * 3600_000));
    }
  }

  const live = await audits.insert(db, { warehouse_id: wh["FRG-01"], auditor_id: auditors[0], note: "Choraklik inventarizatsiya" });
  await db.query(
    `UPDATE audit_items SET counted = expected - CASE WHEN random() < 0.2 THEN 2 ELSE 0 END
     WHERE audit_id=$1 AND id IN (SELECT id FROM audit_items WHERE audit_id=$1 ORDER BY id LIMIT 10)`,
    [live.id],
  );

  for (const [name, phone, company, message, status] of [
    ["Azamat Karimov", "+998 90 123 45 67", "Fresh Distribution", "50 ta agent uchun demo kerak", "new"],
    ["Lola Rasulova", "+998 91 555 22 11", "Sweet Line MChJ", "Ombor auditi moduli qiziqtiradi", "contacted"],
    ["Timur Abdullayev", "+998 93 777 88 99", "AquaPro", "Telegram bot integratsiyasi", "new"],
    ["Nigora Yo'ldosheva", "+998 94 321 00 12", "Mega Foods", "", "won"],
  ]) {
    await db.query(`INSERT INTO leads (name, phone, company, message, status) VALUES ($1,$2,$3,$4,$5)`, [name, phone, company, message, status]);
  }
}

export async function seed() {
  const { rows } = await pool.query("SELECT COUNT(*) FROM users");
  if (rows[0].count > 0) return;
  console.log("seeding…");
  await tx(async (db) => {
    const admin = await users.insert(db, {
      username: config.adminUsername,
      password_hash: await bcrypt.hash(config.adminPassword, 10),
      full_name: "Administrator",
      role: "admin",
    });
    if (config.seedDemo) await seedDemo(db, admin.id);
  });
  console.log("seed done");
}
