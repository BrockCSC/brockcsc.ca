import { Router } from "express";
import { pool, rowToRecord } from "../db.js";
import { requireAdmin } from "../auth.js";

const TABLES = new Set(["execs", "events", "dsc_cards", "food_items"]);

export const crudRouter = (table: string) => {
  if (!TABLES.has(table)) {
    throw new Error(`Unknown table: ${table}`);
  }

  const router = Router();

  router.get("/", async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT id, data FROM ${table} ORDER BY created_at ASC`
    );
    res.json(rows.map(rowToRecord));
  });

  router.get("/:id", async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, data FROM ${table} WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rowToRecord(rows[0]));
  });

  router.post("/", requireAdmin, async (req, res) => {
    const { rows } = await pool.query(
      `INSERT INTO ${table} (data) VALUES ($1) RETURNING id, data`,
      [req.body]
    );
    res.status(201).json(rowToRecord(rows[0]));
  });

  router.patch("/:id", requireAdmin, async (req, res) => {
    const { rows } = await pool.query(
      `UPDATE ${table} SET data = data || $1 WHERE id = $2 RETURNING id, data`,
      [req.body, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rowToRecord(rows[0]));
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [
      req.params.id,
    ]);
    if (rowCount === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  });

  return router;
};
