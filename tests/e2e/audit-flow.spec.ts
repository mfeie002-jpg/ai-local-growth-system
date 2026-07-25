import { test, expect } from "@playwright/test";
import {
  assertAccessibilityBaseline,
  assertNoHorizontalOverflow,
  captureRuntimeErrors,
  installEssentialConsent,
} from "./site-contract";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
};

const flows = [
  {
    language: "de",
    path: "/audit?type=business&utm_source=qa&utm_medium=e2e&utm_campaign=launch",
    resultPath: "/audit/r/",
    continueLabel: "Weiter",
    submitLabel: "Business Audit starten",
    businessHeading: "Welcher Geschäftskontext zählt?",
    contactHeading: "Wohin darf der private Report-Link?",
    processingConsent: /Ich willige ein/,
  },
  {
    language: "en",
    path: "/en/audit?type=business&utm_source=qa&utm_medium=e2e&utm_campaign=launch",
    resultPath: "/en/audit/r/",
    continueLabel: "Continue",
    submitLabel: "Start Business Audit",
    businessHeading: "Which business context matters?",
    contactHeading: "Where should the private report link go?",
    processingConsent: /I agree that my information/,
  },
] as const;

for (const [index, flow] of flows.entries()) {
  test(`${flow.language.toUpperCase()} audit: three steps → attributed submission → private report`, async ({
    page,
  }) => {
    const fakeToken = `00000000-0000-4000-8000-00000000000${index + 1}`;
    let submittedPayload: Record<string, unknown> | null = null;
    let submitCount = 0;
    const runtimeErrors = captureRuntimeErrors(page);
    await installEssentialConsent(page);

    await page.route("**/functions/v1/create-audit", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      submitCount += 1;
      submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          token: fakeToken,
          redirect_path: `${flow.resultPath}${fakeToken}`,
        }),
      });
    });

    await page.route("**/functions/v1/get-audit-report-v0**", async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify({
          token: fakeToken,
          status: "ready",
          overall_score: 72,
          category_scores: {
            technical: { score: 16, max: 20, percent: 80 },
            content: { score: 14, max: 20, percent: 70 },
            trust: { score: 13, max: 20, percent: 65 },
            conversion: { score: 12, max: 20, percent: 60 },
            automation: { score: 18, max: 20, percent: 90 },
          },
          top_actions: [
            {
              rank: 1,
              signal_id: "primary_cta",
              category: "conversion",
              title: "Primären CTA schärfen",
              recommendation: "Eine klare nächste Handlung verwenden.",
              impact: 5,
            },
          ],
          signals: [
            {
              id: "https",
              category: "technical",
              name: "HTTPS aktiv",
              value: true,
              evidence: "Final URL uses HTTPS",
              score: 5,
              max_score: 5,
              recommendation: "OK",
              passed: true,
              state: "measured",
              source: "http",
              confidence: "high",
            },
          ],
          website_url: "https://example.com/",
          normalized_domain: "example.com",
          language: flow.language,
          score_version: "v1.0",
          completed_at: "2026-07-25T10:00:00.000Z",
          created_at: "2026-07-25T09:59:00.000Z",
          fetch_meta: {},
          error: null,
        }),
      });
    });

    const response = await page.goto(flow.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);

    await expect(page.getByRole("heading", { level: 2 })).toContainText(
      flow.language === "de"
        ? "Welche Website soll geprüft werden?"
        : "Which website should be assessed?",
    );
    await page.getByLabel(/Website-URL|Website URL/i).fill("example.com");
    await page.getByLabel(/Firmenname|Company name/i).fill("Example AG");
    await page.getByRole("button", { name: flow.continueLabel }).click();

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(flow.businessHeading);
    await page.getByLabel(/Branche|Industry/i).fill("B2B Beratung");
    await page.getByLabel(/Region \/ Markt|Region \/ market/i).fill("Deutschschweiz");
    await page.getByLabel(/Wichtigstes Geschäftsziel|Primary business goal/i).selectOption(
      "qualified_leads",
    );
    await page.getByLabel(/Wichtigste Lead-Quelle|Primary lead source/i).selectOption("organic");
    await page.getByLabel(/Vorhandene Tools|Current tools/i).fill("GA4, HubSpot");
    await page.getByRole("button", { name: flow.continueLabel }).click();

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(flow.contactHeading);
    await page.getByLabel(/Vorname|First name/i).fill("Test");
    await page.getByLabel(/Nachname|Last name/i).fill("Runner");
    await page.getByLabel(/E-Mail-Adresse|Email address/i).fill("qa@example.com");
    await page.getByRole("checkbox", { name: flow.processingConsent }).check();

    await assertNoHorizontalOverflow(page);
    await assertAccessibilityBaseline(page);
    await page.getByRole("button", { name: flow.submitLabel }).evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });

    await page.waitForURL(new RegExp(`${flow.resultPath}${fakeToken}$`));
    expect(submitCount).toBe(1);
    await expect(page.locator("main header")).toContainText("72/100");
    await expect(page.getByText("80%", { exact: true })).toBeVisible();
    await expect(page.getByText(/Primären CTA schärfen/)).toBeVisible();

    expect(submittedPayload).toMatchObject({
      website_url: "https://example.com/",
      company_name: "Example AG",
      industry: "B2B Beratung",
      region: "Deutschschweiz",
      primary_goal: "qualified_leads",
      primary_lead_source: "organic",
      systems: "GA4, HubSpot",
      first_name: "Test",
      last_name: "Runner",
      email: "qa@example.com",
      consent_processing: true,
      consent_marketing: false,
      consent_version: "2026-07-25",
      audit_type: "business",
      language: flow.language,
      utm_source: "qa",
      utm_medium: "e2e",
      utm_campaign: "launch",
    });
    expect(runtimeErrors).toEqual([]);
  });
}
