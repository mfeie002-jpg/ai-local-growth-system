---
name: sprint-2-seo-landings
description: Five new SEO landings shipped in Sprint 2 (Nov 2025), route pairs, shared component, hybrid pricing decision.
type: feature
---

Sprint 2 delivered 5 new SEO landings under `src/pages/landings/`, all using the shared `SEOLanding` component in `src/components/SEOLanding.tsx`. Copy lives inline in each page file (not in `translations.ts`) to keep the i18n file lean.

Routes (paired via `src/lib/routePairs.ts`, wired in `src/App.tsx`, listed in `public/sitemap.xml`):
- `/website-audit` ↔ `/en/website-audit` — primary SEO target ("website analyse" 720/mo, KD 32)
- `/seo-analyse` ↔ `/en/seo-analysis` — strongest ranking hook ("google ranking verbessern" 8'100/mo)
- `/ai-visibility` ↔ `/en/ai-visibility` — thought-leadership / entity signals (no keyword volume)
- `/fuer-kmu` ↔ `/en/for-smb` — positioning landing, no SEO ambition
- `/partner` ↔ `/en/partner` — partner/referral funnel

Every landing includes:
- `SEOHead` (title/description/canonical/hreflang)
- Optional `ServiceSchema` JSON-LD
- `FAQSchema` synced 1:1 with visible `<details>` FAQ blocks (never invented)
- Primary CTA → `/audit` (DE) or `/en/audit` (EN)

## Hybrid pricing decision (user-approved Sprint 2)
- Launch Sprint: full price shown (`CHF 1'990` / `CHF 1,990`) — entry commitment
- Growth Retainer: `ab CHF 3'900` / `from CHF 3,900` — indicative
- Scale Retainer: `ab CHF 6'900` / `from CHF 6,900` + `+ Bonus` note

PricingCard CTA now links to `/audit` (was `/gratis-audit` legacy).

## Bugfixes shipped in same sprint
- `src/components/Layout.tsx`: added `overflow-x-clip` on shell + main to stop aurora blobs forcing horizontal scroll on mobile
- `src/pages/PricingPage.tsx`: annotation "Launch · Growth · Leader" → "Launch Sprint · Growth Retainer · Scale Retainer"
