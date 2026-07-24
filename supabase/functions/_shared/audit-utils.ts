export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function normalizeDomain(input: string): { url: string; domain: string } | null {
  if (!input || typeof input !== "string") return null;
  let raw = input.trim().toLowerCase();
  if (!raw) return null;
  if (!/^https?:\/\//.test(raw)) raw = "https://" + raw;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    // Basic host validation: at least one dot, valid chars
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null;
    // Reject localhost/private
    if (host === "localhost" || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host)) return null;
    // Reject IP addresses
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return null;
    return { url: `https://${host}${u.pathname === "/" ? "" : u.pathname}`, domain: host };
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim()) && email.length < 255;
}

export async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const data = new TextEncoder().encode(ip + "|itsfeierabend-audit-v0");
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    null
  );
}
