## Status: Nearly Complete — Verification & Gap-Closing Plan

All three prompts have already been implemented in prior turns. This plan verifies each requirement is actually in place, closes any residual gaps, and produces a final "definition of done" report.

### What's already built (from prior turns)

**Prompt 1 — Vertical slice:**
- `/audit` + `/en/audit` routes, form with URL/name/email/language/consent + optional marketing consent
- `audit_requests` + `audit_events` tables with RLS
- Edge functions: `create-audit`, `fetch-site-signals`, `compute-score`, `generate-report`, `send-report-email`, `get-audit-report-v0`
- 25 deterministic signals across 5 categories, score v0.1
- Private `/audit/r/:token` route with score, categories, evidence, top actions, CTA
- Tracking events; loading/timeout/failure/partial states

**Prompt 2 — Semrush enrichment:**
- Server-side gateway calls, 30-day cache (`semrush_domain_cache`), daily fresh limit (`semrush_daily_usage`)
- Opaque error mapping; graceful degradation with `search_visibility` marked `unavailable`
- 9/9 tests passing in `semrush.test.ts`

**Prompt 3 — Hardening:**
- Turnstile integrated (both keys now set: site key in `.env`, secret key in vault)
- 30-day per-domain dedupe, 5/day per-IP, 200/day global limits
- SSRF protection via `resolvePublicIps`, IP literal/private range/localhost rejection
- `audit_events` logging for `bot_check_failed`, `ssrf_blocked`, `rate_limited`
- GitHub CI (`.github/workflows/ci.yml`), Playwright E2E (`tests/e2e/audit-flow.spec.ts`)
- Lovable badge removed, sitemap/robots/hreflang/canonical done
- `docs/RELEASE_CHECKLIST.md` produced

### Plan for this turn — final verification pass

1. **Re-verify Turnstile is actually enforced** now that both keys are set (previously fail-open). Read `create-audit/index.ts` and `Turnstile.tsx` to confirm the token is required client-side and validated server-side, and that fail-open is no longer active.
2. **Run RLS verification query** on `audit_requests`, `audit_events`, `semrush_domain_cache`, `semrush_daily_usage`, `rate_limits` — confirm anon has no read access to PII, service_role has full access, no policy gaps.
3. **Run Supabase linter** to catch any new warnings introduced across the recent migrations.
4. **Run the Deno test suite** (`semrush.test.ts` + any audit tests) to confirm green.
5. **Trigger a fresh SEO scan** and update any findings still marked failing.
6. **Manually spot-check** `docs/RELEASE_CHECKLIST.md` for the new Turnstile keys and rate-limit values, patch if stale.
7. **Produce a final go/no-go report** listing: what's live, what's tested, what environment variables are set, and any remaining low-risk gaps.

### Branch note

The `prototype/audit-v0` branch cannot be created from here — Lovable manages git. Will remind you to create it via the Git panel if you want to isolate this slice from `main`.

### Deliverable

A single verification report at the end of the turn: ✅/❌ per requirement across all 3 prompts, with any last small fixes applied in the same pass.
