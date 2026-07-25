import { expect, test } from "@playwright/test";
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
    path: "/kontakt?utm_source=qa&utm_medium=e2e&utm_campaign=launch",
    type: "contact",
    submitLabel: "Anfrage senden",
    processingConsent: /Ich willige ein/,
    success: /Danke\. Ihre Anfrage wurde erfasst\./,
  },
  {
    path: "/en/partners?utm_source=qa&utm_medium=e2e&utm_campaign=launch",
    type: "partner",
    submitLabel: "Send partner enquiry",
    processingConsent: /I agree that my information/,
    success: /Thank you\. Your partner enquiry has been recorded\./,
  },
] as const;

for (const flow of flows) {
  test(`${flow.type} enquiry is stored once with attribution`, async ({ page }) => {
    let submitCount = 0;
    let submittedPayload: Record<string, unknown> | null = null;
    const runtimeErrors = captureRuntimeErrors(page);
    await installEssentialConsent(page);

    await page.route("**/functions/v1/submit-lead", async (route) => {
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
        body: JSON.stringify({ success: true, lead_id: "00000000-0000-4000-8000-000000000001" }),
      });
    });

    const response = await page.goto(flow.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);

    await page.getByLabel(/^Name/).fill("QA Runner");
    await page.getByLabel(/Firma|Company/).fill("Example AG");
    await page.getByLabel(/^E-Mail|^Email/).fill("qa@example.com");
    await page.getByLabel(/Website$/).fill("https://example.com");
    await page.getByLabel(/Ausgangslage und Frage|Starting point and question/).fill(
      "We need a verified digital growth diagnostic for our lead funnel.",
    );
    await page.getByRole("checkbox", { name: flow.processingConsent }).check();

    await assertNoHorizontalOverflow(page);
    await assertAccessibilityBaseline(page);
    await page.getByRole("button", { name: flow.submitLabel }).evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });

    await expect(page.getByRole("status")).toContainText(flow.success);
    expect(submitCount).toBe(1);
    expect(submittedPayload).toMatchObject({
      name: "QA Runner",
      company_name: "Example AG",
      email: "qa@example.com",
      website_url: "https://example.com",
      consent_processing: true,
      consent_marketing: false,
      lead_type: flow.type === "partner" ? "partner_application" : "contact",
      service_area: flow.type,
      utm_source: "qa",
      utm_medium: "e2e",
      utm_campaign: "launch",
    });
    expect(runtimeErrors).toEqual([]);
  });
}
