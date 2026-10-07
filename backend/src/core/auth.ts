import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { HttpError } from "./http.js";

export type Role = "admin" | "manager" | "agent" | "courier" | "auditor";
export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export const COOKIE = "tf_token";

export function signToken(user: AuthUser): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: "7d" });
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = req.cookies?.[COOKIE] ?? (header?.startsWith("Bearer ") ? header.slice(7) : undefined);
  if (!token) throw new HttpError(401, "Avtorizatsiya talab qilinadi");
  try {
    const { id, username, role } = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = { id, username, role };
  } catch {
    throw new HttpError(401, "Sessiya muddati tugagan");
  }
  next();
};

export const allow =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || (req.user.role !== "admin" && !roles.includes(req.user.role))) {
      throw new HttpError(403, "Ruxsat yo'q");
    }
    next();
  };
