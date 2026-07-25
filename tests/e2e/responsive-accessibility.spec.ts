import { test, expect, type Page } from "@playwright/test";
import {
  RESPONSIVE_ROUTES,
  VIEWPORTS,
  assertAccessibilityBaseline,
  assertNoHorizontalOverflow,
  captureRuntimeErrors,
  installEssentialConsent,
  waitForHydratedPage,
} from "./site-contract";

async function advanceAuditToContactStep(page: Page, english: boolean): Promise<void> {
  await page.getByLabel(english ? "Website URL *" : "Website-URL *").fill("example.com");
  await page.getByLabel(english ? "Company name *" : "Firmenname *").fill("Example AG");
  await page.getByRole("button", { name: english ? "Continue" : "Weiter" }).click();
  await assertNoHorizontalOverflow(page);

  await page.getByLabel(english ? "Industry *" : "Branche *").fill("Beratung");
  await page.getByLabel(english ? "Region / market *" : "Region / Markt *").fill("Zürich");
  await page.getByLabel(
    english ? "Primary business goal *" : "Wichtigstes Geschäftsziel *",
  ).selectOption("qualified_leads");
  await page.getByLabel(
    english ? "Primary lead source *" : "Wichtigste Lead-Quelle *",
  ).selectOption("organic");
  await page.getByRole("button", { name: english ? "Continue" : "Weiter" }).click();

  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    english
      ? "Where should the private report link go?"
      : "Wohin darf der private Report-Link?",
  );
  await assertNoHorizontalOverflow(page);
}

test.describe("responsive and accessibility matrix", () => {
  for (const viewport of VIEWPORTS) {
    for (const path of RESPONSIVE_ROUTES) {
      test(`${path} at ${viewport.name}px has no overflow or runtime errors`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const runtimeErrors = captureRuntimeErrors(page);
        await installEssentialConsent(page);

        const response = await page.goto(path, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBeLessThan(400);
        await waitForHydratedPage(page);
        await assertNoHorizontalOverflow(page);

        if (path === "/audit" || path === "/en/audit") {
          await advanceAuditToContactStep(page, path.startsWith("/en/"));
        }

        if ((path === "/" || path === "/en") && viewport.width < 1024) {
          const menu = page.getByRole("button", { name: "Open menu" });
          await expect(menu).toBeVisible();
          await menu.click();
          await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
          await expect(page.locator("header nav").last()).toBeVisible();
          await assertNoHorizontalOverflow(page);
          await page.getByRole("button", { name: "Close menu" }).click();
        }

        await assertAccessibilityBaseline(page);
        expect(runtimeErrors).toEqual([]);
      });
    }
  }
});

test("language switch preserves the canonical SEO route pair", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await installEssentialConsent(page);

  await page.goto("/seo-analyse", { waitUntil: "domcontentloaded" });
  await waitForHydratedPage(page);
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/seo-analysis$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("SEO analysis");

  await page.getByRole("button", { name: "Deutsch" }).click();
  await expect(page).toHaveURL(/\/seo-analyse$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de-CH");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("SEO-Analyse");
});
