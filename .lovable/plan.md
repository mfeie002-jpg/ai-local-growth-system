## Goal

A complete site-wide redesign that makes "AI" the visceral core of every page, simplifies the journey into the Free Audit, and gives the Ultimate Package its rightful spotlight. New aesthetic direction, restructured information architecture, no fabricated proof.

## Proposed direction: "Neural Editorial"

A break from the current Maximalist Push (aurora gradients + glass + heavy display type). The new direction:

- **Editorial spine** — large serif (Fraunces) display headlines paired with a precise mono accent (JetBrains Mono) for "machine voice" and a clean sans (Inter Tight) for body. Asymmetric 12-column grid, generous whitespace, numbered section markers (`01 / 06`).
- **Neural visual language** — every section anchored by one of three motifs: (a) a live-feeling **signal stream** (animated tokens flowing through a pipeline), (b) a **score card** (the same scoring component that powers real reports), or (c) an **AI annotation** (margin notes in mono type, like an AI commenting on the page). These replace stock imagery and decorative orbs.
- **Restrained palette** — bone-white canvas, deep ink foreground, one electric primary (kept), a single warm signal color for "AI annotations". Gradients reserved for the score visual only. Noise + aurora effects retired from chrome.
- **Motion with meaning** — text reveals on scroll feel like an AI typing/streaming. Hover states "decode" labels (e.g. mono scrambles into the word). One hero-level animation per page, not scattered micro-interactions.

The current Sora/Space Grotesk system and aurora utilities are removed from page chrome and kept only where genuinely useful (e.g. the report's score halo).

## Restructured information architecture

Public site collapses from a sprawling set of parallel pages into a **single funnel spine** with supporting reference pages.

```text
Spine (linear funnel)
  01  Home              → AI-first manifesto + funnel entry
  02  Free Audit        → 1-step form, opportunity framing
  03  Scan Progress     → live signal stream (already exists)
  04  Analysis Report   → score, top 3 opportunities, Ultimate CTA
  05  Ultimate Package  → the offer, in depth
  06  Free Call         → human handoff

Reference (linked from Home + Footer, not in main nav)
  Services hub  (1 page, 7 service cards expand inline — replaces 7 separate pages)
  Case studies  (real portfolio only, no fabricated metrics)
  Pricing       (kept, simplified)
  System        (how the engine works — moved into one collapsible explainer)
  Blog, FAQ, Demo, Investor, Imprint, Privacy
```

**Why:** today there are ~19 public pages competing for attention; the funnel is buried. Collapsing the 7 service pages into a single hub with expandable detail removes redundant chrome and shortens the path to the audit.

## Per-page changes

**01 Home** — full restructure into 6 sections with numbered markers:
1. Manifesto hero (editorial headline, single CTA → Free Audit, AI-annotation in margin)
2. The engine (4-layer pipeline visualised as a signal stream)
3. The Ultimate Package (promoted from mid-page to position 3, teaser + CTA → /ultimate-package)
4. Services as a single grid (replaces ServicesSection cards with editorial list)
5. Real portfolio (replaces SocialProofSection, real cases only)
6. Final CTA (audit + call)

Removed from Home: chatbot demo section, "Why choose us" card grid, pricing block, FAQ block. These move to dedicated pages or are dropped.

**02 Free Audit** — collapse the multi-step form back to one screen with progressive disclosure. New left column = editorial framing ("What you'll see in your report"), right column = form. AuditFormStepper deprecated per source-of-truth.

**03 Scan Progress** — visual upgrade only: replace generic spinner with the signal-stream motif so users see the AI "working".

**04 Analysis Report** — keep current scoring logic; restructure layout:
- Hero = score card with single sentence verdict
- Top 3 Opportunities elevated above category breakdown
- Ultimate Package CTA inline after opportunities (not at the bottom)

**05 Ultimate Package** — restructure long page into 4 acts: Problem framing → What's inside → Case examples → Offer/CTA. Apply Neural Editorial styling.

**06 Free Call** — strip to essentials: one column, editorial intro, calendar/form, transparency note about AI assist if voice is on.

**Services hub (NEW, replaces 7 service pages)** — `/services` and `/en/services`. One page, 7 cards, each expanding inline to show details. Existing service routes 301 to anchors on the hub for SEO continuity.

**Case studies, Pricing, System, FAQ, Blog, Demo, Investor, Imprint, Privacy, NotFound** — re-skinned to Neural Editorial; no structural changes beyond removing aurora/noise chrome and applying the new type system.

**Header** — slim down: logo, 4 nav items (Audit, Ultimate Package, Services, Pricing), language switch, single CTA. Drop mega-menu.

**Footer** — kept, restyled, same links.

## What is explicitly NOT changing

- Admin pages (internal, out of scope).
- Backend, edge functions, scoring engine, database schema, auth.
- Bilingual routing (DE default + `/en` paths).
- Real-data guardrails: no invented metrics, testimonials, logos, or "+X% leads" claims.
- Consent gating, voice-agent transparency rules, source-of-truth v1.2 architecture.
- Ultimate Package's "overwhelming effect" tactic — we're amplifying it, not softening.

## Technical details

- New design tokens in `src/index.css`: replace current `--gradient-aurora`, `.aurora-bg`, `.noise-overlay*`, `.glass-panel` with Neural Editorial tokens (`--ink`, `--bone`, `--signal`, `--annotation`, `--rule-weight`). Keep the `.dark` block.
- New fonts via Google Fonts: Fraunces (display), Inter Tight (body), JetBrains Mono (annotations). Sora and Space Grotesk imports removed.
- New shared components in `src/components/neural/`: `EditorialHero`, `SectionMarker` (numbered `01/06`), `SignalStream` (animated pipeline), `ScoreCard` (extracted from report), `AIAnnotation` (margin note), `RevealText` (typewriter-style scroll reveal).
- Refactor `Layout`, `Header`, `Footer`, `SectionContainer` to use new tokens; old utility classes removed in a single sweep.
- Routing: add `/services` + `/en/services` to `App.tsx`, deprecate the 7 individual service routes by redirecting them to anchors on the hub.
- `tailwind.config.ts` updated for new font families and any new color tokens.
- Performance: keep the `content-visibility: auto` optimisations from the previous round; signal-stream animations use CSS transforms + `will-change: transform` only, no JS-driven RAF loops.
- A11y: ensure new mono "decode" hover states have a `prefers-reduced-motion` fallback; all editorial text passes WCAG AA on bone background.

## Build order

1. Tokens + fonts + base typography (`index.css`, `tailwind.config.ts`).
2. Shared neural components (`src/components/neural/*`).
3. Layout, Header, Footer.
4. HomePage restructure.
5. Services hub + route consolidation.
6. Audit, Scan Progress, Analysis Report, Ultimate Package, Call.
7. Reference pages (Pricing, Case Studies, System, FAQ, Blog, Demo, Investor, Imprint, Privacy, NotFound).
8. Cleanup: remove unused assets, old utility classes, retired components.
9. QA sweep: build, type-check, click every route in DE + EN, verify console clean.

## Risks / call-outs

- This is a large change (~30 files touched, ~6 new components, several routes consolidated). Expect 2–3 implementation rounds.
- Removing aurora/glass utilities will visually break any page not yet migrated until the sweep is complete; we'll do it in one branch, page by page, finishing with the cleanup pass.
- Service route consolidation may affect SEO; redirects + anchor links preserve existing URLs.
- If you want a different aesthetic direction than "Neural Editorial" (e.g. more playful, more brutalist, more glassy/Apple-like), say so before approval and I'll respin direction-only — IA and build order stay.
