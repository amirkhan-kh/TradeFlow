import { Router } from "express";
import { run } from "./service.js";

export const insightsRouter = Router();

insightsRouter.get("/", async (_req, res) => {
  res.json(await run());
});
