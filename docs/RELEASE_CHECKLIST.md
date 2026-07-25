# Free Audit — Public Beta Release Checklist

## Environment variables (all runtime secrets)

| Name | Where | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Edge Functions | Cloud project URL (auto) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Server writes to `audit_requests` / `audit_events` |
| `SUPABASE_ANON_KEY` | Edge Functions | Public reads via RLS-safe helpers |
| `LOVABLE_API_KEY` | Edge Functions | Semrush gateway auth |
| `SEMRUSH_API_KEY` | Edge Functions | Semrush connection key (managed by connector) |
| `TURNSTILE_SECRET_KEY` | Edge Functions | Cloudflare Turnstile server-side verify. **Required for beta** — when unset, submissions fail closed. |
| `VITE_TURNSTILE_SITE_KEY` | Vite build (`.env`) | Public site key rendered in the audit form widget |
| `VITE_GA4_MEASUREMENT_ID` | Vite build | GA4 measurement ID. When unset, analytics remains disabled. |
| `RESEND_API_KEY` | Edge Functions | Transactional audit-result email provider |
| `REPORT_EMAIL_FROM` | Edge Functions | Verified sender for audit-result email |
| `AUDIT_LIMIT_PER_IP_DAILY` | Edge Functions (optional) | Default `5` fresh audits per IP per 24h |
| `AUDIT_LIMIT_GLOBAL_DAILY` | Edge Functions (optional) | Default `200` fresh audits site-wide per 24h |
| `SEMRUSH_DAILY_FRESH_LIMIT` | Edge Functions (optional) | Daily budget for fresh Semrush lookups |

## Rate limits (defaults)

- **Per IP:** 5 audits / 24h (`AUDIT_LIMIT_PER_IP_DAILY`)
- **Global:** 200 audits / 24h (`AUDIT_LIMIT_GLOBAL_DAILY`)
- Every accepted request receives a fresh private report token. The CRM lead is
  de-duplicated by email + website within 30 days.
- Enforcement and lead/audit creation run atomically in
  `public.create_audit_with_lead`, backed by `rate_limits`, `leads`,
  `audit_requests` and `audit_events`.

## Fallback behaviour

| Failure | Behaviour |
| --- | --- |
| Turnstile secret missing | Return HTTP 400 with `bot_check_failed`; no lead or audit is stored. |
| Bot check fails | Return HTTP 400, log `audit_events.bot_check_failed`, no DB insert. |
| Malformed / private / IP-literal / non-http URL | Return HTTP 400, log `audit_events.url_rejected`, no DB insert. |
| Per-IP / global limit exceeded | Return HTTP 429, log `audit_events.rate_limited`. |
| Duplicate lead within 30 days | Reuse the canonical CRM lead, create a fresh audit and fresh private token. |
| SSRF-blocked (private IP, DNS loop, redirect loop) | Return a transparent preliminary result with unavailable evidence and no invented score. DNS-rebinding still requires a platform-level egress control before production. |
| Semrush timeout / quota exceeded / auth error | Enrichment marked `unavailable`; audit still completes with deterministic score. |
| Report generation crash | Row stays in `failed`; user is shown a retry-able state on the report page. |
| Email provider missing/fails | Record `email_skipped` or `email_failed`; the private web result remains available. A durable retry worker is still required before production. |

## Manual test cases (pre-launch smoke)

1. Submit a valid URL → get a private report link → open it in a fresh
   browser → confirm score renders and no PII leaks in URL.
2. Submit `http://localhost/`, `http://127.0.0.1/`, `ftp://foo.com/`, and a
   naked IP `http://1.2.3.4/` → each is rejected with a clear message; a
   row exists in `audit_events` with `event_type='url_rejected'`.
3. Submit the same email + domain twice in a minute → one canonical CRM lead
   exists, but both requests receive distinct private audit tokens.
4. From the same IP, submit 6 different domains within 24h → the 6th call
   returns HTTP 429 and a `rate_limited` audit event.
5. Submit without the Turnstile widget resolving → server returns
   `bot_check_failed`.
6. Report page: refresh while `status='pending'` → skeleton renders without
   layout shift; polls until `ready`.
7. Report page with `status='failed'` → shows retry state, no crash.
8. `/audit` and `/en/audit` both render, share the same submit endpoint,
   and redirect to the correct language route.
9. `robots.txt` disallows `/analyse/` and `/admin/`; `sitemap.xml` contains
   both DE and EN entries with `hreflang` alternates.
10. Admin/private pages (`/admin/*`, `/audit/r/*`) return `<meta name="robots" content="noindex">`; legacy `/analyse/*` paths redirect to `/audit`.
11. CI (`.github/workflows/ci.yml`) passes install, lint, deno tests,
    production build, and the Playwright audit-flow smoke test.
12. Published site does **not** show the "Edit with Lovable" badge.

## Launch order

1. Verify and approve the legal entity, postal address, responsible person,
   Swiss UID/register details, production processor inventory, transfer
   regions and retention schedule. Until then, imprint and privacy routes stay
   `noindex` and production launch is blocked.
2. Apply `20260725050000_final_launch_lead_security.sql` and then
   `20260725060000_atomic_audit_create.sql`.
3. Deploy Edge Functions only after both migrations succeed.
4. Configure Turnstile, Resend and the approved frontend GA4 ID.
5. Publish the app with a documented rollback version.
6. Run the manual test cases against the production URL.
7. Enable analytics dashboards / alerting on `audit_events.rate_limited` and
   `audit_events.bot_check_failed`.
