# Baseline Audit — itsfeierabend.ch

**Observed:** 2026-07-25

**Scope:** public live site before launch-branch deployment, repository inspection and dated market evidence

**Project isolation:** itsfeierabend.ch only; no Feierabend Services or Umzugscheck campaigns, leads or performance data

**Evidence limits:** the connected cloud browser had a fixed CSS viewport of 1363 × 936. Exact 320/375/390/430/768/1024/1440 rendering remains a preview-QA task.

## Executive baseline

The live site is reachable and already has a distinct dark interface, an audit entry point and DE/EN content. It is not launch-ready as the requested business-diagnostic platform.

The main verified blockers are:

1. the production audit emitted a Cloudflare Turnstile configuration error;
2. route-specific SEO metadata depended on client-side JavaScript in the sampled live deployment;
3. unknown paths returned HTTP 200 and only became a 404 after JavaScript;
4. the `www` host did not redirect to the preferred non-`www` host;
5. language state persisted independently of the URL and all sampled English pages retained `html lang="de"`;
6. GA4/GTM and the requested event layer were not visible in the fresh live browser session;
7. the legal entity, postal address, responsible person and complete production processor inventory are unverified;
8. numeric Semrush metrics are unavailable, not zero, because report discovery was blocked by insufficient API units.

## Live HTTP and domain evidence

| Check | Verified observation | Impact | Required action |
|---|---|---|---|
| `https://itsfeierabend.ch/` | HTTP 200, no redirect | Preferred host works | Keep as canonical production host |
| `https://www.itsfeierabend.ch/` | HTTP 200, no redirect | Duplicate host remains publicly addressable | Add a safe permanent redirect to non-`www` after approval |
| HTTP scheme | Each host redirected once from HTTP to its own HTTPS equivalent | HTTPS enforcement works | Preserve when fixing the host redirect |
| TLS/HSTS | Curl certificate verification succeeded; HSTS advertised for one year including subdomains | Sound baseline | Reverify after domain/deployment changes |
| Unknown path | HTTP 200; client later rendered a `noindex,nofollow` 404 | Soft-404 and crawler ambiguity | Return a real 404 response at the hosting layer |
| Security headers | HSTS, `nosniff` and strict-origin referrer policy present | Partial hardening only | Evaluate CSP, frame protection and permissions policy |
| DNS detail | Both hosts resolved through the test environment and served Cloudflare responses | Direct authoritative DNS records were not exposed through the proxy | Verify records in the connected domain provider before launch; do not change without approval |

## SEO and rendering baseline

Raw HTML sampled from `/`, `/audit`, `/services/seo`, one blog article and an unknown path contained the same:

- generic title;
- generic meta description;
- canonical URL pointing to the homepage.

The browser showed route-specific titles, descriptions, canonicals and 404 directives only after JavaScript ran. This is direct evidence from the sampled deployment, not a claim about the launch branch after its new static-entrypoint build step.

| Area | Verified live observation | Required action |
|---|---|---|
| Homepage rendered metadata | Route-specific title/description/canonical appeared after JavaScript | Verify generated route entry points on the final preview without JavaScript |
| Homepage structured data | `ProfessionalService`, `WebSite` and visible-FAQ schema present | Revalidate against final positioning and visible content |
| Sitemap | HTTP 200; 55 URLs at observation time | Regenerate from the final canonical route set |
| Robots | HTTP 200; admin, API and private report paths blocked | Recheck against final report and preview routes |
| Legal URLs | Included in sitemap while rendered `noindex` | Remove non-indexable URLs from the sitemap |
| Alias audit URLs | `/gratis-audit` and `/en/free-audit` navigated to canonical audit routes | Sitemap should list only the canonical destinations |
| Heading baseline | Homepage and 20 linked routes each rendered a primary heading | Recheck all new routes after content implementation |

The production build now includes `scripts/generate-static-entrypoints.mjs`; the final QA must inspect the built HTML for every canonical route and 404 file instead of assuming this script fixes hosting behaviour.

## Language baseline

The live browser initially rendered German. After visiting an English route:

- direct navigation back to `/` still rendered English;
- direct navigation to German legal/blog paths could retain English state;
- English routes retained `<html lang="de">`;
- selecting the visible German control restored German content.

German blog articles worked when the global state was German. The defect is therefore URL/state determinism, not proof that the German articles are absent.

**Acceptance requirement:** every direct URL must select its own language without relying on previous browser state, and built HTML must contain the matching language metadata.

## Audit and lead-flow baseline

| Area | Verified live observation | Risk | Required action |
|---|---|---|---|
| Audit form | URL, first name, last name, email and consent shown in one screen | High initial friction; not progressive disclosure | Use the planned multi-step flow and show value before full qualification |
| HTML fallback | Form defaulted to GET `/audit`; core inputs lacked `name` attributes | JavaScript-only submission path | Verify server-side processing, names and accessible error states |
| Anti-abuse | Turnstile appeared during one load | Anti-abuse exists in concept | Keep only after configuration is verified |
| Console | `TurnstileError: Invalid or missing type for parameter "sitekey", expected "string", got "object"` | Audit submission may fail or anti-abuse may disappear | Fix and verify site/secret key pairing in preview and production |
| Submission evidence | No lead was submitted during the read-only baseline | Storage, notifications and deduplication remain unverified | Run synthetic E2E after backend access and test-data rules are confirmed |
| Other forms | Call, package, blog and investor pages contained forms | Several relied on JavaScript/default GET behaviour; newsletter consent/label quality needed review | Consolidate on the typed server-side lead flow and distinct lead types |

## Tracking and consent baseline

The fresh browser session exposed the application bundle and Lovable’s `~flock.js`. It did not expose:

- a `dataLayer`;
- a `gtag` function;
- a visible GA4/GTM script;
- a cookie/consent interface;
- document cookies.

This is an observation from one fresh public session, not proof that no analytics configuration exists elsewhere.

The final preview must verify the requested events, consent gating, UTM persistence, absence of PII and protection against conversions fired by directly loading a result page.

## Performance baseline

| Asset | Observed size |
|---|---:|
| Main JavaScript | 1,689,293 bytes uncompressed; 479,781 bytes downloaded with gzip |
| Main CSS | 114,757 bytes uncompressed; 18,835 bytes downloaded with gzip |

Hashed assets advertised immutable one-year caching. The HTML advertised no-cache. Test-environment request timing traversed a proxy and is not suitable as Swiss Core Web Vitals evidence.

No LCP, CLS or INP values are published in this baseline because they were not measured reliably. Run Lighthouse and browser performance tests on the final preview.

## Desktop, mobile and accessibility

- Twenty linked main routes were checked at the fixed 1363 × 936 viewport.
- No horizontal document overflow was observed at that viewport.
- Several interactive targets measured below the requested 44–48 px minimum, including language controls, header/footer links and checkboxes.
- Exact mobile/tablet/1440 results remain unverified.
- The English `lang` defect is an accessibility and SEO blocker.

Do not mark mobile, keyboard, screen-reader, reduced-motion or Core Web Vitals acceptance as passed until the final automated and manual matrix is complete.

## Repository baseline

| Area | Current repository evidence |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 5, React Router, Tailwind/shadcn |
| Backend | Supabase client, migrations and Edge Functions |
| Build | Vite production build followed by route-specific static entrypoint generation |
| Tests | `typecheck`, ESLint and Playwright E2E scripts are defined |
| Branch | `feat/itsfeierabend-final-launch` |
| Analytics | Optional GA4 code path and consent state exist; production activation remains to be verified |
| Audit enrichment | Optional Semrush and other data-provider integration points exist; active production tools remain to be verified |
| Legal facts | Firm name/legal form, UID, address and responsible person are missing |
| Prices | No fixed figure is approved by the supplied project brief; publish only scope-based enquiry CTAs until approved |

## Market-evidence correction

The earlier baseline contained search volumes, Keyword Difficulty and organic-domain totals that are not supported by the current evidence.

The authoritative dated files state:

- the Semrush connection was active;
- report discovery stopped on insufficient API units;
- no report schema or report execution occurred;
- search volume, KD, CPC, intent labels, organic totals, rankings, backlinks and Authority Score were unavailable;
- public SERP sampling was completed but is not numeric demand or rank-tracking evidence.

See:

- `docs/MARKET_KEYWORD_SERP_EVIDENCE_2026-07-25.md`
- `docs/MARKET_KEYWORD_SERP_EVIDENCE_2026-07-25.json`

## Launch gate

Do not call the project launch-ready until:

- Turnstile and the complete audit-to-database-to-notification flow pass with a synthetic lead;
- final built HTML is route- and language-specific without client execution;
- host redirects and real 404 responses are verified;
- exact requested viewports pass overflow, navigation and form QA;
- tracking and consent are verified in DebugView without PII or duplicate conversions;
- the legal entity/address and production processor/retention inventory are supplied and reviewed;
- no unapproved prices, unverifiable metrics, logos, testimonials or performance claims remain.
