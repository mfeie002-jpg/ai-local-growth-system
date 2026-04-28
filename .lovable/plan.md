## Spoke → Hub Webhook Reporter

Add a new edge function `report-event` that signs events with HMAC-SHA256 and forwards them to the central Hub receiver. This project is the **itsfeierabend.ch** spoke, so `BRAND = "itsfeierabend"`.

### What gets created

**1. `supabase/functions/report-event/index.ts`** (new)
- Exact code from your spec, with `BRAND = "itsfeierabend"`
- Reads `HUB_WEBHOOK_SECRET` from env (already configured ✅)
- Posts signed payload to `https://vgitgdvxanodfgokokix.supabase.co/functions/v1/spoke-webhook-receiver`
- CORS handled, validates `event_type` against allowed list
- Fixed minor issue in spec: the `/* keep text */` comment in the JSON parse fallback (typo in source) → cleaned up

**2. `supabase/config.toml`** (edit)
- Add:
  ```toml
  [functions.report-event]
  verify_jwt = false
  ```
  So the spoke frontend can invoke it without auth (events fire for anonymous visitors too).

### Wire-up to existing flows

Add a fire-and-forget call to `report-event` in:

- **`src/hooks/useLeadSubmit.ts`** — after successful lead submission (covers both `free_audit` and `free_call` forms), emit `lead_submitted` with `{ lead_type, industry, language, lead_id }`.

This is the highest-value event. Other events (`form_started`, `page_view`, `error`, `build_completed`) can be added later — kept out of scope to stay minimal unless you want them now.

### Notes

- Hub anon key is embedded as in your spec (publishable, safe).
- `HUB_WEBHOOK_SECRET` already exists in this project's secrets — no add_secret needed.
- The reporter call is wrapped in try/catch so a hub outage never blocks lead submission.
- No DB changes, no new dependencies.

### Files touched

- `supabase/functions/report-event/index.ts` (new)
- `supabase/config.toml` (add function block)
- `src/hooks/useLeadSubmit.ts` (emit `lead_submitted` after success)