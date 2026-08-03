import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import type { CrudUseCases } from "../application/crud-use-cases.js";
import { toWireRecord } from "./to-wire-record.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const createCrudRouter = <T extends { id: string }>(
  useCases: CrudUseCases<T>,
  requireAdmin: Middleware,
) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    const entities = await useCases.list.execute();
    res.json(entities.map(toWireRecord));
  });

  router.get<{ id: string }>("/:id", async (req, res) => {
    const entity = await useCases.get.execute(req.params.id);
    if (!entity) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(toWireRecord(entity));
  });

  router.post("/", requireAdmin, async (req, res) => {
    const entity = await useCases.create.execute(req.body);
    res.status(201).json(toWireRecord(entity));
  });

  router.patch<{ id: string }>("/:id", requireAdmin, async (req, res) => {
    const entity = await useCases.update.execute(req.params.id, req.body);
    if (!entity) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(toWireRecord(entity));
  });

  router.delete<{ id: string }>("/:id", requireAdmin, async (req, res) => {
    const removed = await useCases.remove.execute(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  });

  return router;
};
