import { Router } from "express";
import {
  handleLogin,
  handleLogout,
  handleMe,
} from "../application/auth.service.js";

export const createAuthRouter = () => {
  const router = Router();
  router.post("/login", handleLogin);
  router.post("/logout", handleLogout);
  router.get("/me", handleMe);
  return router;
};
