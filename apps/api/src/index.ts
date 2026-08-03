import cookieParser from "cookie-parser";
import express from "express";
import { createAuthRouter } from "./auth/http/auth.router.js";
import { bootstrapDatabase, db } from "./db.js";
import { createDscCardRouter } from "./dsc-cards/http/dsc-card.router.js";
import { createEventRouter } from "./events/http/event.router.js";
import { createExecRouter } from "./execs/http/exec.router.js";
import { createFoodItemRouter } from "./food-items/http/food-item.router.js";

const main = async () => {
  await bootstrapDatabase();

  const app = express();
  app.set("trust proxy", true);
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", createAuthRouter());
  app.use("/api/execs", createExecRouter(db));
  app.use("/api/events", createEventRouter(db));
  app.use("/api/dsc", createDscCardRouter(db));
  app.use("/api/food", createFoodItemRouter(db));

  const port = Number(process.env.PORT ?? 3001);
  app.listen(port, () => {
    console.log(`brockcsc-api listening on :${port}`);
  });
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
