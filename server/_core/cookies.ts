import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(_req: Request): CookieOptions {
  // Preview is public HTTPS in a cross-site frame even when the upstream request is HTTP.
  // Plain-HTTP local development must opt in explicitly; never infer it from NODE_ENV or req.secure.
  const secure = process.env.MADEPRIMER_COOKIE_SECURE !== "false";
  return { httpOnly: true, path: "/", sameSite: secure ? "none" : "lax", secure };
}
