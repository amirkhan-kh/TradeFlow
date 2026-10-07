import { pool, type Db } from "../../core/db.js";
import type { Role } from "../../core/auth.js";

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  role: Role;
  phone: string | null;
  region: string | null;
  monthly_plan: number;
  active: boolean;
  created_at: string;
}

export const toPublic = ({ password_hash: _, ...u }: UserRow) => u;

export async function findByUsername(username: string) {
  const { rows } = await pool.query<UserRow>("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0];
}

export async function findById(id: number) {
  const { rows } = await pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

export async function list(role?: string) {
  const { rows } = await pool.query<UserRow>(
    `SELECT * FROM users WHERE ($1::text IS NULL OR role = $1) ORDER BY full_name`,
    [role ?? null],
  );
  return rows.map(toPublic);
}

export async function insert(
  db: Db,
  u: { username: string; password_hash: string; full_name: string; role: Role; phone?: string; region?: string; monthly_plan?: number },
) {
  const { rows } = await db.query<UserRow>(
    `INSERT INTO users (username, password_hash, full_name, role, phone, region, monthly_plan)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [u.username, u.password_hash, u.full_name, u.role, u.phone ?? null, u.region ?? null, u.monthly_plan ?? 0],
  );
  return rows[0];
}
