import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const redirects = readFileSync("public/_redirects", "utf8");
const headers = readFileSync("public/_headers", "utf8");

test("hosting rules canonicalize the host, retire legacy routes and return real 404s", async ({
  request,
}) => {
  const activeRules = redirects
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  expect(activeRules[0]).toBe(
    "https://www.itsfeierabend.ch/* https://itsfeierabend.ch/:splat 301!",
  );
  expect(activeRules).toContain("/gratis-audit /audit 301");
  expect(activeRules).toContain("/en/free-audit /en/audit 301");
  expect(activeRules).toContain("/en/investors /en 301");
  expect(activeRules.at(-1)).toBe("/* /404.html 404");

  const notFound = await request.get("/404.html");
  expect(notFound.status()).toBe(200);
  const html = await notFound.text();
  expect(html).toContain("<h1>Seite nicht gefunden</h1>");
  expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/i);
});

test("hosting rules declare the launch security baseline", () => {
  expect(headers).toContain("X-Content-Type-Options: nosniff");
  expect(headers).toContain("X-Frame-Options: DENY");
  expect(headers).toContain("Referrer-Policy: strict-origin-when-cross-origin");
  expect(headers).toContain("Permissions-Policy:");
  expect(headers).toContain("Content-Security-Policy:");
  expect(headers).toContain("frame-src https://challenges.cloudflare.com");
  expect(headers).toContain("connect-src 'self' https://*.supabase.co");
});
