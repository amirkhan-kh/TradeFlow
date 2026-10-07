import { Router } from "express";
import { z } from "zod";
import { allow } from "../../core/auth.js";
import { idParam, notFound, pageOf, parse } from "../../core/http.js";
import * as repo from "./repository.js";

const schema = z.object({
  name: z.string().trim().min(2),
  owner_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  region: z.string().trim().min(2),
  address: z.string().trim().optional(),
  segment: z.enum(["A", "B", "C"]).default("B"),
  agent_id: z.coerce.number().int().positive().nullish(),
  credit_limit: z.coerce.number().min(0).default(0),
});

export const clientsRouter = Router();

clientsRouter.get("/", async (req, res) => {
  res.json(await repo.list(pageOf(req)));
});

clientsRouter.get("/:id", async (req, res) => {
  const id = idParam(req);
  const client = await repo.get(id);
  if (!client) throw notFound("Mijoz topilmadi");
  res.json({ ...client, ledger: await repo.ledger(id) });
});

clientsRouter.post("/", allow("manager", "agent"), async (req, res) => {
  res.status(201).json(await repo.insert(parse(schema, req.body)));
});

clientsRouter.put("/:id", allow("manager"), async (req, res) => {
  const item = await repo.update(idParam(req), parse(schema, req.body));
  if (!item) throw notFound("Mijoz topilmadi");
  res.json(item);
});
