import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { SessionUser } from "@/lib/api/types";
import type { KeycloakIdentity } from "./keycloak";

const { SESSION_JWT_SECRET, ADMIN_ROLE = "brockcsc-admin" } = process.env;
if (!SESSION_JWT_SECRET) {
  throw new Error("SESSION_JWT_SECRET env var is not set.");
}

export const SESSION_COOKIE = "brockcsc_session";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60,
};

export const signSession = (identity: KeycloakIdentity): string => {
  const session: SessionUser = {
    sub: identity.sub,
    email: identity.email,
    name: identity.name,
    roles: identity.roles,
  };
  return jwt.sign(session, SESSION_JWT_SECRET!, { expiresIn: "1d" });
};

export const getSessionUser = (req: NextRequest): SessionUser | null => {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SESSION_JWT_SECRET!) as SessionUser;
  } catch {
    return null;
  }
};

export const requireAdmin = (req: NextRequest): SessionUser | null => {
  const user = getSessionUser(req);
  if (!user || !user.roles.includes(ADMIN_ROLE)) return null;
  return user;
};
