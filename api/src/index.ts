import cookieParser from "cookie-parser";
import express from "express";
import { handleLogin, handleLogout, handleMe } from "./auth.js";
import { crudRouter } from "./routes/crud.js";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/auth/login", handleLogin);
app.post("/api/auth/logout", handleLogout);
app.get("/api/auth/me", handleMe);

app.use("/api/execs", crudRouter("execs"));
app.use("/api/events", crudRouter("events"));
app.use("/api/dsc", crudRouter("dsc_cards"));
app.use("/api/food", crudRouter("food_items"));

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`brockcsc-api listening on :${port}`);
});
