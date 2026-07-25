import { test, expect } from "@playwright/test";
import {
  PUBLIC_ROUTES,
  assertAccessibilityBaseline,
  assertMetadata,
  captureRuntimeErrors,
  installEssentialConsent,
  waitForHydratedPage,
} from "./site-contract";

test.describe("public route contract", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} renders with correct metadata, language and baseline accessibility`, async ({
      page,
    }) => {
      const runtimeErrors = captureRuntimeErrors(page);
      await installEssentialConsent(page);

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await waitForHydratedPage(page);

      await assertMetadata(page, route);
      await assertAccessibilityBaseline(page);

      if (route.path === "/audit" || route.path === "/en/audit") {
        await expect(page.getByRole("heading", { level: 1 })).toContainText(
          route.language === "en"
            ? "Start with the website"
            : "Zuerst die Website",
        );
      } else if (route.language === "en") {
        await expect(page.getByRole("link", { name: "Services", exact: true })).toBeVisible();
      } else {
        await expect(page.getByRole("link", { name: "Leistungen", exact: true })).toBeVisible();
      }

      expect(runtimeErrors).toEqual([]);
    });

    test(`${route.path} has a crawlable route-specific HTML entry point`, async ({ request }) => {
      // Vite preview serves generated directory entry points at the directory URL.
      // The document itself still declares the intentionally slashless canonical.
      const entryPointPath = route.path === "/" ? "/" : `${route.path}/`;
      const response = await request.get(entryPointPath);
      expect(response.status()).toBeLessThan(400);

      const html = await response.text();
      const escapedLanguage = route.language.replace("-", "\\-");
      const expectedCanonical = `https://itsfeierabend.ch${route.path === "/" ? "/" : route.path}`;

      expect(html).toMatch(new RegExp(`<html lang="${escapedLanguage}">`));
      expect(html).toMatch(/<title>[^<]+itsFeierabend\.ch<\/title>/);
      expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/);
      expect(html).toContain(`<link rel="canonical" href="${expectedCanonical}"`);
      expect(html).toMatch(/<div id="root"><main><h1>[^<]+<\/h1><p>[^<]+<\/p><\/main><\/div>/);
      expect(html).not.toContain("KI-gestützte Digital Marketing Agentur");

      if (route.indexable) {
        expect(html).not.toMatch(/<meta name="robots" content="noindex/i);
      } else {
        expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/i);
      }
    });
  }
});
