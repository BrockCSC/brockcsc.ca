import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SessionUser } from "../domain/session-user.js";

const {
  KEYCLOAK_ISSUER,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  SESSION_JWT_SECRET,
  ADMIN_ROLE = "brockcsc-admin",
} = process.env;

for (const [name, value] of Object.entries({
  KEYCLOAK_ISSUER,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  SESSION_JWT_SECRET,
})) {
  if (!value) throw new Error(`${name} env var is not set.`);
}

const SESSION_COOKIE = "brockcsc_session";
const cookieBase = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const tokenResponse = await fetch(
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: KEYCLOAK_CLIENT_ID!,
        client_secret: KEYCLOAK_CLIENT_SECRET!,
        scope: "openid",
        username,
        password,
      }),
    },
  );

  if (!tokenResponse.ok) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const { access_token } = (await tokenResponse.json()) as {
    access_token: string;
  };

  // Token comes straight from Keycloak over TLS via a confidential client,
  // so we don't need to re-verify the signature here.
  const payload = jwt.decode(access_token) as {
    sub: string;
    email: string;
    name: string;
    realm_access?: { roles?: string[] };
  } | null;

  const roles = payload?.realm_access?.roles ?? [];
  if (!payload || !roles.includes(ADMIN_ROLE)) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const session: SessionUser = {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
  };
  const sessionToken = jwt.sign(session, SESSION_JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.cookie(SESSION_COOKIE, sessionToken, {
    ...cookieBase,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json(session);
};

export const handleLogout = (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, cookieBase);
  res.status(204).end();
};

const getSessionUser = (req: Request): SessionUser | null => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, SESSION_JWT_SECRET!) as SessionUser;
  } catch {
    return null;
  }
};

export const handleMe = (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(user);
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
};
