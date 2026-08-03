import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const {
  KEYCLOAK_ISSUER,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  SESSION_JWT_SECRET,
  PUBLIC_URL,
  ADMIN_ROLE = "brockcsc-admin",
} = process.env;

for (const [name, value] of Object.entries({
  KEYCLOAK_ISSUER,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  SESSION_JWT_SECRET,
  PUBLIC_URL,
})) {
  if (!value) throw new Error(`${name} env var is not set.`);
}

const redirectUri = `${PUBLIC_URL}/api/auth/callback`;

export type SessionUser = {
  sub: string;
  email: string;
  name: string;
};

const STATE_COOKIE = "brockcsc_oauth_state";
const SESSION_COOKIE = "brockcsc_session";
const cookieBase = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export const buildAuthorizeUrl = (state: string) => {
  const url = new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/auth`);
  url.searchParams.set("client_id", KEYCLOAK_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  return url.toString();
};

export const handleLogin = (_req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie(STATE_COOKIE, state, { ...cookieBase, maxAge: 5 * 60 * 1000 });
  res.redirect(buildAuthorizeUrl(state));
};

export const handleCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const expectedState = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, cookieBase);

  if (!code || !state || state !== expectedState) {
    res.redirect("/?login_error=state_mismatch");
    return;
  }

  const tokenResponse = await fetch(
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KEYCLOAK_CLIENT_ID!,
        client_secret: KEYCLOAK_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        code: String(code),
      }),
    },
  );

  if (!tokenResponse.ok) {
    res.redirect("/?login_error=token_exchange_failed");
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
    res.redirect("/?login_error=not_authorized");
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
  res.redirect("/admin");
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
