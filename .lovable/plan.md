# itsfeierabend.ch — Final Launch Plan

**Branch:** `feat/itsfeierabend-final-launch`

**Positioning:** Swiss platform for transparent digital business diagnostics

**Primary outcome:** qualified Swiss B2B leads through a useful Quick Audit and evidence-based follow-up

**Isolation:** separate from feierabendservices.ch and umzugscheck.ch

## Non-negotiable evidence rules

- Do not publish invented search volume, Keyword Difficulty, CPC, traffic, rankings, Authority Score or backlink figures.
- Current Semrush metrics are unavailable because report discovery stopped on insufficient API units. Use the dated market-evidence files.
- Do not publish fixed itsfeierabend prices until they are explicitly approved.
- Do not claim guaranteed Google, ChatGPT or AI-answer visibility.
- Do not publish fictional customers, logos, testimonials, certifications, partnerships or performance results.
- Keep measured signals, user inputs, estimates, external enrichment and expert review visibly separate.
- Treat connected businesses only as disclosed project context with verified claims and permission.

## Launch blockers known on 2026-07-25

| Blocker | Evidence | Exit condition |
|---|---|---|
| Legal provider facts incomplete | No approved legal entity, legal form, UID, postal address or responsible person in repository | Verified facts supplied and imprint reviewed |
| Privacy inventory incomplete | Active production processors, regions, transfers, agreements and retention schedule not verified end to end | Production data-flow register completed and policy reviewed |
| Audit anti-abuse error on live site | Turnstile console error for invalid/missing `sitekey` type | Preview and production synthetic submission pass |
| Live route metadata depended on JS | Raw sampled HTML shared homepage title/description/canonical | Built and deployed route HTML verified without JS |
| Soft-404 | Unknown live route returned HTTP 200 | Hosting returns real 404 with noindex page |
| Canonical host split | `www` and non-`www` both returned 200 | Approved permanent redirect to non-`www` |
| Language not URL-deterministic | English state persisted on German paths; `html lang` remained `de` on EN | Direct DE/EN URL matrix passes in fresh contexts |
| Exact mobile QA missing | Connected browser fixed at 1363 × 936 | 320/375/390/430/768/1024/1440 preview matrix passes |
| Tracking acceptance missing | Fresh live session showed no GA4/GTM data layer or consent UI | Event, consent, UTM and PII QA passes |
| Semrush numeric evidence unavailable | Dated evidence files record insufficient API units | Valid reports exported or all numeric cells remain unavailable |

## Product architecture

### Canonical conversion path

Traffic or outreach
→ intent-matched page
→ free Quick Audit
→ preliminary result with evidence labels
→ qualified lead
→ deeper audit or consultation
→ scoped implementation project
→ optional ongoing optimisation

### Page ownership

- `/` — positioning, method, fit and primary audit CTA
- `/ai-business-audit` — cross-functional lead magnet and audit explanation
- `/website-audit` — website, technical, mobile, trust and conversion diagnostic
- `/seo-analyse` — indexation, search intent, architecture, local visibility and content gaps
- `/ai-visibility` — entity clarity, semantics, source/citation readiness and technical accessibility
- `/automation` — lead capture, routing, CRM, follow-up, attribution and reporting
- `/leistungen` — offer ladder without unapproved prices
- `/fuer-kmu` — audience qualification
- `/partner` — partner enquiry without claiming an unapproved programme or commission
- `/fallstudien` — verified relationship and work only
- `/insights` — educational support content
- `/ueber-uns` — method, accountability and entity facts
- `/kontakt` — scoped analysis/contact enquiry
- `/audit` — private multi-step Quick Audit
- `/impressum`, `/datenschutz` — non-indexed legal information; currently blocked on missing facts

Do not add `/business-health-check` as a thin duplicate at launch.

## Workstream 1 — Positioning and content integrity

- Replace generic agency language with concrete digital-diagnostic language.
- Use Swiss B2B wording and one clear primary CTA.
- Remove unapproved prices and package-value claims.
- Label sample dashboards and scores as examples.
- Remove or qualify claims such as “live”, “deterministic”, “real-time” or fixed signal counts unless the production implementation proves them.
- Ensure case studies disclose the relationship and contain no unverifiable results.

## Workstream 2 — Audit product and lead flow

- Use progressive disclosure: website → business context → contact/consent.
- Show preliminary value before asking for excessive details.
- Validate URL, company context and contact data server-side.
- Store source, landing page, referrer, UTM values, audit type, region, business goal, consent, lead status and timestamps in the dedicated itsfeierabend data model.
- Keep reports private through server-validated identifiers.
- Distinguish automatic observations, self-reported facts, estimates and expert review.
- Return explicit partial/fallback states when a site or external provider cannot be measured.
- Verify database write, deduplication, notification and result delivery using synthetic test data.

## Workstream 3 — SEO and AI-search foundations

- Generate route-specific built HTML with the correct title, description, canonical, language and visible fallback content.
- Keep one intent owner per page according to `docs/keyword-map.md`.
- Regenerate sitemap and robots from canonical routes only.
- Return a real HTTP 404 for unknown paths.
- Use only accurate `Organization`, `WebSite`, `Service`, breadcrumb and visible-FAQ structured data.
- Publish clear entity, method and expert/accountability facts after they are verified.
- Explain AI visibility without guarantees.
- Re-run Semrush only when report units are available; preserve dated evidence.

## Workstream 4 — Tracking, consent and security

- Gate analytics and marketing code behind the correct consent state.
- Implement the approved audit, lead, consultation, partner, case-study, scroll and outbound events without PII.
- Persist UTM and source attribution once per session/lead without duplicate conversion events.
- Prevent direct result/thank-you URLs from generating conversions.
- Verify RLS, grants, rate limits, Turnstile, secret separation and error redaction.
- Keep service-role and provider secrets server-side.
- Complete the production processor, region, transfer and retention inventory before legal review.

## Workstream 5 — QA and release

Run and record:

```sh
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Preview acceptance:

- direct-load every canonical DE/EN URL in a fresh browser context;
- inspect built HTML without JavaScript;
- test 320, 375, 390, 430, 768, 1024 and 1440 px;
- detect horizontal overflow and targets below 44 px;
- test keyboard, labels, errors, focus and reduced motion;
- submit synthetic audit, contact and partner leads;
- verify database records, attribution, consent and notifications;
- inspect console and failed network requests;
- run Lighthouse/field-independent performance checks without inventing unavailable numbers;
- validate structured data, sitemap, robots, canonicals and 404 responses.

## Approval boundaries

Allowed within the launch branch:

- repository inspection and reversible code/content changes;
- tests, builds and preview deployment;
- synthetic test records under the agreed cleanup rules;
- pull-request preparation and evidence documentation.

Require explicit approval:

- DNS or domain changes;
- protected-branch merge;
- production deployment without a tested rollback;
- destructive production migrations;
- fixed price publication;
- paid subscriptions;
- advertising campaigns, budgets, bids or ads;
- email/newsletter/voice messages to real contacts;
- claims that legal copy is final legal advice.

## Completion definition

The site is launch-ready only when every blocker above has an evidence-backed exit, the production build and relevant E2E tests pass, the preview URL is documented, legal/provider facts are supplied, and no placeholder, fake claim, unapproved price or cross-project data remains.
