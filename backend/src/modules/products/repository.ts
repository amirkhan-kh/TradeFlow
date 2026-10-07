import { pool } from "../../core/db.js";
import type { PageQuery } from "../../core/http.js";

export interface ProductInput {
  sku: string;
  name: string;
  category: string;
  unit: string;
  weight_kg: number;
  price: number;
  cost: number;
  min_stock: number;
  expires_at?: string | null;
  active: boolean;
}

const COLS = ["sku", "name", "category", "unit", "weight_kg", "price", "cost", "min_stock", "expires_at", "active"] as const;
const values = (p: ProductInput) => COLS.map((c) => p[c] ?? null);

export async function list({ page, limit, q, status }: PageQuery) {
  const where = `WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR p.sku ILIKE '%' || $1 || '%')
    AND ($2::text IS NULL OR p.category = $2)`;
  const params = [q || null, status || null];
  const [items, count] = await Promise.all([
    pool.query(
      `SELECT p.*, COALESCE(SUM(s.quantity),0)::int AS stock, COALESCE(SUM(s.reserved),0)::int AS reserved
       FROM products p LEFT JOIN stock s ON s.product_id = p.id
       ${where} GROUP BY p.id ORDER BY p.name LIMIT $3 OFFSET $4`,
      [...params, limit, (page - 1) * limit],
    ),
    pool.query(`SELECT COUNT(*) FROM products p ${where}`, params),
  ]);
  return { items: items.rows, total: count.rows[0].count, page, limit };
}

export async function categories() {
  const { rows } = await pool.query<{ category: string }>("SELECT DISTINCT category FROM products ORDER BY 1");
  return rows.map((r) => r.category);
}

export async function insert(p: ProductInput) {
  const { rows } = await pool.query(
    `INSERT INTO products (${COLS.join(",")}) VALUES (${COLS.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`,
    values(p),
  );
  return rows[0];
}

export async function update(id: number, p: ProductInput) {
  const { rows } = await pool.query(
    `UPDATE products SET ${COLS.map((c, i) => `${c}=$${i + 2}`).join(",")} WHERE id=$1 RETURNING *`,
    [id, ...values(p)],
  );
  return rows[0];
}
