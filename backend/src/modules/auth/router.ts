import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { COOKIE, requireAuth, signToken } from "../../core/auth.js";
import { config } from "../../core/config.js";
import { HttpError, parse } from "../../core/http.js";
import * as users from "../users/repository.js";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = parse(loginSchema, req.body);
  const user = await users.findByUsername(username);
  if (!user || !user.active || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, "Login yoki parol noto'g'ri");
  }
  const token = signToken({ id: user.id, username: user.username, role: user.role });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.cookieSecure,
    maxAge: 7 * 24 * 3600 * 1000,
    path: "/",
  });
  res.json({ user: users.toPublic(user) });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE, { path: "/" });
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await users.findById(req.user!.id);
  if (!user) throw new HttpError(401, "Foydalanuvchi topilmadi");
  res.json({ user: users.toPublic(user) });
});
