import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { allow } from "../../core/auth.js";
import { pool } from "../../core/db.js";
import { parse } from "../../core/http.js";
import * as repo from "./repository.js";

const createSchema = z.object({
  username: z.string().trim().min(3).max(40),
  password: z.string().min(6),
  full_name: z.string().trim().min(2),
  role: z.enum(["admin", "manager", "agent", "courier", "auditor"]),
  phone: z.string().trim().optional(),
  region: z.string().trim().optional(),
  monthly_plan: z.coerce.number().min(0).optional(),
});

export const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  res.json({ items: await repo.list(role) });
});

usersRouter.post("/", allow("admin"), async (req, res) => {
  const { password, ...data } = parse(createSchema, req.body);
  const user = await repo.insert(pool, { ...data, password_hash: await bcrypt.hash(password, 10) });
  res.status(201).json(repo.toPublic(user));
});
