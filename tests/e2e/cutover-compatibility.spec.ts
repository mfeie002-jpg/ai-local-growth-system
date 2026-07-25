import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const config = readFileSync("supabase/config.toml", "utf8");
const checklist = readFileSync("docs/RELEASE_CHECKLIST.md", "utf8");
const submitLead = readFileSync(
  "supabase/functions/submit-lead/index.ts",
  "utf8",
);
const businessScanner = readFileSync(
  "supabase/functions/business-scanner/index.ts",
  "utf8",
);
const cutoverClaimMigration = readFileSync(
  "supabase/migrations/20260725070000_legacy_scanner_cutover_claim.sql",
  "utf8",
);

function functionConfig(name: string): string {
  const match = config.match(
    new RegExp(
      `\\[functions\\.${name}\\]([\\s\\S]*?)(?=\\n\\[functions\\.|$)`,
    ),
  );
  expect(match, `missing config for ${name}`).not.toBeNull();
  return match?.[1] ?? "";
}

test("cutover keeps legacy scanner gateway-compatible and documents hardening", () => {
  for (
    const functionName of [
      "business-scanner",
      "scan-status",
      "get-analysis-report",
    ]
  ) {
    expect(functionConfig(functionName)).toContain("verify_jwt = false");
  }

  expect(checklist).toContain("LEGACY_PUBLIC_SCANNER_ENABLED=true");
  expect(checklist).toContain(
    "20260725070000_legacy_scanner_cutover_claim.sql",
  );
  expect(checklist).toContain("change `verify_jwt` back to `true`");
  expect(checklist).toContain("anonymous request returns HTTP 401");
  expect(businessScanner).toContain("claim_legacy_analysis_scan");
  expect(businessScanner).toContain("LEGACY_SCAN_PER_IP_MAX = 1");
  expect(businessScanner).toContain("LEGACY_SCAN_GLOBAL_MAX = 10");
  expect(cutoverClaimMigration).toContain(
    "pg_advisory_xact_lock",
  );
  expect(cutoverClaimMigration).toContain(
    "CREATE OR REPLACE FUNCTION public.claim_legacy_analysis_scan",
  );
  expect(cutoverClaimMigration).toContain(
    "INSERT INTO public.analysis_reports",
  );
  expect(cutoverClaimMigration).toContain(
    "REVOKE ALL ON FUNCTION public.claim_legacy_analysis_scan",
  );
});

test("only the legacy submit contract can receive the scanner lead id", () => {
  expect(submitLead).toContain(
    "leadSuccessPayload(leadInput.contract, insertedLead.id)",
  );
  expect(submitLead).not.toContain(
    "return json({ success: true, lead_id: insertedLead.id })",
  );
});
