/**
 * Sanitize a backend Set-Cookie header so the browser will accept it
 * on the frontend domain.
 *
 * - Strips `Domain=...` (so the cookie scopes to the current page origin)
 * - Overrides `Path=/` (backend may set a narrow path like /api/v1/auth)
 * - Strips `Secure` in development (localhost is plain HTTP)
 */
export function sanitizeCookie(raw: string): string {
  const isProduction = process.env.NODE_ENV === "production";

  const parts = raw
    .split(";")
    .map((p) => p.trim())
    .filter((part) => {
      const key = part.toLowerCase();
      if (key.startsWith("domain=")) return false;
      if (key.startsWith("path=")) return false;
      if (!isProduction && key === "secure") return false;
      return true;
    });

  parts.push("Path=/");

  return parts.join("; ");
}
