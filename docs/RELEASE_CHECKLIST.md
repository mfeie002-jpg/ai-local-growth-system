# Free Audit — Public Beta Release Checklist

## Environment variables (all runtime secrets)

| Name | Where | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Edge Functions | Cloud project URL (auto) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Server writes to `audit_requests` / `audit_events` |
| `SUPABASE_ANON_KEY` | Edge Functions | Public reads via RLS-safe helpers |
| `LOVABLE_API_KEY` | Edge Functions | Semrush gateway auth |
| `SEMRUSH_API_KEY` | Edge Functions | Semrush connection key (managed by connector) |
| `TURNSTILE_SECRET_KEY` | Edge Functions | Cloudflare Turnstile server-side verify. **Required for beta** — when unset, bot check fails open. |
| `VITE_TURNSTILE_SITE_KEY` | Vite build (`.env`) | Public site key rendered in the audit form widget |
| `AUDIT_LIMIT_PER_IP_DAILY` | Edge Functions (optional) | Default `5` fresh audits per IP per 24h |
| `AUDIT_LIMIT_GLOBAL_DAILY` | Edge Functions (optional) | Default `200` fresh audits site-wide per 24h |
| `AUDIT_DOMAIN_COOLDOWN_DAYS` | Edge Functions (optional) | Default `30` days between fresh audits per normalised domain |
| `SEMRUSH_DAILY_FRESH_LIMIT` | Edge Functions (optional) | Daily budget for fresh Semrush lookups |

## Rate limits (defaults)

- **Per IP:** 5 audits / 24h (`AUDIT_LIMIT_PER_IP_DAILY`)
- **Global:** 200 audits / 24h (`AUDIT_LIMIT_GLOBAL_DAILY`)
- **Per domain:** 1 fresh audit / 30 days (`AUDIT_DOMAIN_COOLDOWN_DAYS`) — subsequent
  submissions for the same normalised domain reuse the existing report token.
- Enforcement lives in `supabase/functions/_shared/audit-limits.ts` and is backed by
  the `rate_limits` and `audit_requests` tables.

## Fallback behaviour

| Failure | Behaviour |
| --- | --- |
| Turnstile secret missing | Bot check is skipped (fail-open) and logged with `reason=not_configured`. Set the secret before public launch. |
| Bot check fails | Return HTTP 400, log `audit_events.bot_check_failed`, no DB insert. |
| Malformed / private / IP-literal / non-http URL | Return HTTP 400, log `audit_events.url_rejected`, no DB insert. |
| Per-IP / global limit exceeded | Return HTTP 429, log `audit_events.rate_limited`. |
| Domain within 30-day cooldown | Return HTTP 200 with the existing token so the user still gets a report. Logged as `audit_events.domain_throttled`. |
| SSRF-blocked (private IP, DNS loop, redirect loop) | `fetch-site-signals` returns `{ ctx: null, error, partial: true }`; scoring proceeds with `partial` status. |
| Semrush timeout / quota exceeded / auth error | Enrichment marked `unavailable`; audit still completes with deterministic score. |
| Report generation crash | Row stays in `failed`; user is shown a retry-able state on the report page. |

## Manual test cases (pre-launch smoke)

1. Submit a valid URL → get a private report link → open it in a fresh
   browser → confirm score renders and no PII leaks in URL.
2. Submit `http://localhost/`, `http://127.0.0.1/`, `ftp://foo.com/`, and a
   naked IP `http://1.2.3.4/` → each is rejected with a clear message; a
   row exists in `audit_events` with `event_type='url_rejected'`.
3. Submit the same domain twice in a minute → second call returns the same
   token (`reused: true`) and a `domain_throttled` audit event.
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
10. Admin/private pages (`/admin/*`, `/analyse/*`) return `<meta name="robots" content="noindex">`.
11. CI (`.github/workflows/ci.yml`) passes install, lint, deno tests,
    production build, and the Playwright audit-flow smoke test.
12. Published site does **not** show the "Edit with Lovable" badge.

## Launch order

1. Configure `TURNSTILE_SECRET_KEY` (Edge Function secret) and
   `VITE_TURNSTILE_SITE_KEY` (build env).
2. Publish the app.
3. Run the manual test cases against the production URL.
4. Enable analytics dashboards / alerting on `audit_events.rate_limited` and
   `audit_events.bot_check_failed`.
