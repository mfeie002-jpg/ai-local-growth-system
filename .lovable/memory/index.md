# Project Memory

## Core
Dark "Obsidian Instrument" aesthetic: obsidian canvas, chrome hairlines, icy signal cyan. Space Grotesk (display) · Inter (body) · JetBrains Mono (machine voice).
Bilingual routing: DE-CH (default `/`) and EN (`/en`). All routes must have paired equivalents in `src/lib/routePairs.ts`.
Analytics/GA4 must only fire AFTER explicit consent (Consent Mode v2 default denied).
HARD CONSTRAINT: Never invent results, metrics, or logos. Unverified proof must be feature-flagged off.
Positioning (Sprint 2 hybrid): "AI Business Audit Plattform für Schweizer KMU" — Audit as core product, Retainer (Launch Sprint · Growth Retainer · Scale Retainer) as implementation arm.
Hybrid pricing live: Launch CHF 1'990 fixed, Growth "ab CHF 3'900/Mt", Scale "ab CHF 6'900/Mt".
Voice agents must include clear AI disclosure and separate recording consent.
Scanner architecture: Evidence → Normalize → Deterministic Score → AI Interpret (4-layer pipeline, Source of Truth v1.2).
All primary CTAs route to `/audit` (DE) or `/en/audit` (EN) — NOT to legacy `/gratis-audit`.

## Memories
- [Feature Flags](mem://tech/feature-flags-system) — site.ts config controls for risky features and proof elements
- [No Fake Proof](mem://constraints/no-fake-proof) — Strict rules against inventing testimonials or metrics
- [Bilingual Architecture](mem://architecture/bilingual-routing) — DE-CH and EN language persistence and routing rules
- [Consent Gating](mem://privacy/consent-gating-architecture) — Rules for analytics firing and cookie consent
- [Voice Transparency](mem://features/voice-agent-transparency) — Legal and consent requirements for voice agent
- [Core Conversion Flow](mem://funnel/core-conversion-flow) — 3-stage funnel and Anti-Knebel disclosure requirements
- [Brand Positioning](mem://brand/core-repositioning-ai-first) — AI-first digital marketing agency and messaging guidelines
- [Visual Aesthetic](mem://design/dark-agency-aesthetic-visual-system) — Dark theme, gradients, typography, and UI elements
- [Visual Strategy](mem://design/emotional-human-ai-connection) — Hero imagery and human-AI emotional connection
- [Service Offerings](mem://business/seven-service-offering-structure) — 7 core services with AI Implementation as primary
- [Conversion Strategy](mem://strategy/overwhelming-effect-conversion-tactic) — Psychological positioning for Ultimate Package results
- [Valid Case Studies](mem://brand/case-study-companies-featured) — Whitelisted companies allowed for use in case studies
- [Ultimate Package](mem://product/ultimate-package-core-differentiator) — Core USP: AI-powered automated website analysis system
- [Source of Truth v1.2](mem://strategy/source-of-truth-v1.2) — Canonical reference for scanner architecture, scoring, build order, guardrails
- [Sprint 2 SEO Landings](mem://features/sprint-2-seo-landings) — 5 new landings, shared SEOLanding component, hybrid pricing, overflow/naming bugfixes
