import { Router } from "express";
import { z } from "zod";
import { allow } from "../../core/auth.js";
import { pool, tx } from "../../core/db.js";
import { notFound, pageOf, parse } from "../../core/http.js";
import { changeBalance } from "../clients/repository.js";

const schema = z.object({
  client_id: z.coerce.number().int().positive(),
  order_id: z.coerce.number().int().positive().nullish(),
  amount: z.coerce.number().positive(),
  method: z.enum(["cash", "card", "transfer"]),
  note: z.string().trim().max(500).optional(),
});

export const paymentsRouter = Router();

paymentsRouter.get("/", async (req, res) => {
  const { page, limit, q, status } = pageOf(req);
  const where = `WHERE ($1::text IS NULL OR c.name ILIKE '%' || $1 || '%') AND ($2::text IS NULL OR p.method = $2)`;
  const params = [q || null, status || null];
  const [items, count, summary] = await Promise.all([
    pool.query(
      `SELECT p.*, c.name AS client_name, o.number AS order_number, u.full_name AS user_name
       FROM payments p JOIN clients c ON c.id = p.client_id
       LEFT JOIN orders o ON o.id = p.order_id LEFT JOIN users u ON u.id = p.user_id
       ${where} ORDER BY p.created_at DESC LIMIT $3 OFFSET $4`,
      [...params, limit, (page - 1) * limit],
    ),
    pool.query(`SELECT COUNT(*) FROM payments p JOIN clients c ON c.id = p.client_id ${where}`, params),
    pool.query(`
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', now())), 0) AS month_total,
        COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('day', now())), 0) AS today_total,
        (SELECT COALESCE(SUM(balance),0) FROM clients WHERE balance > 0) AS receivables,
        (SELECT COUNT(*) FROM clients WHERE balance > credit_limit) AS overlimit
      FROM payments`),
  ]);
  res.json({ items: items.rows, total: count.rows[0].count, page, limit, summary: summary.rows[0] });
});

paymentsRouter.post("/", allow("manager", "agent", "courier"), async (req, res) => {
  const input = parse(schema, req.body);
  const payment = await tx(async (db) => {
    const { rowCount } = await db.query("SELECT 1 FROM clients WHERE id=$1 FOR UPDATE", [input.client_id]);
    if (!rowCount) throw notFound("Mijoz topilmadi");
    const { rows } = await db.query(
      `INSERT INTO payments (client_id, order_id, amount, method, note, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [input.client_id, input.order_id ?? null, input.amount, input.method, input.note ?? null, req.user!.id],
    );
    await changeBalance(db, input.client_id, -input.amount);
    return rows[0];
  });
  res.status(201).json(payment);
});
