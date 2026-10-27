import { ENV } from "./_core/env";

export function normalizeEmail(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function getAdminAllowlist(): ReadonlySet<string> {
  return new Set(
    ENV.adminEmails
      .split(/[\n,;]+/)
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length > 0 && getAdminAllowlist().has(normalized);
}

export function hasAdminAccess(user: { email: string | null; role: string } | null | undefined): boolean {
  return Boolean(user && user.role === "admin" && isAllowedAdminEmail(user.email));
}
