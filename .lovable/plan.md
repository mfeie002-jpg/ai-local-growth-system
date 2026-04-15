

# The Real Source of Truth — Cleaned, De-duplicated, Hierarchy-Resolved

## Your feedback in one line
You're right. The "consolidated" doc was a polite paste job. Three overlapping PDFs merged into one longer overlapping PDF. Time to actually resolve the conflicts and produce one clean document.

## What this plan does

Create **one definitive PDF** that follows your recommended hierarchy:

1. **Implementation Blueprint v2 = canonical base** (what to build, in what order)
2. **Strategic Blueprint guardrails merged in** (positioning, what NOT to overbuild, automation philosophy)
3. **Master Blueprint compressed to a 2-page executive memo** at the front

With your specific conflict resolutions applied:

| Conflict | Resolution |
|----------|-----------|
| Sync vs async | Async-ready from day one. Progress polling, not blocking UX. |
| One table vs layered | Extend `analysis_reports` NOW, add `scan_runs` in Phase 2 (not "someday") |
| Homepage vs Scan LP | Homepage = brand/authority. Scan LP = dedicated ad funnel. Two separate things. |
| BuiltWith in MVP? | No. Nice enrichment, not MVP-critical. Phase 2. |
| Commercial claims | Internal hypotheses only. No unverified stats in external-facing content. |

## Document structure (single PDF, ~20 pages)

```text
PAGE 1-2    Executive Memo (compressed Master Blueprint)
            - What we're building, why, unit economics, offer ladder
            - Clearly labeled as "hypotheses until proven"

PAGE 3-4    Current-State Audit
            - What's built (60%), what's broken, what's dangerous
            - Fake testimonials, hallucinated scanner, SPA-SEO problem

PAGE 5      Strategic Guardrails (from Strategic Blueprint)
            - Stack stays: Edge Functions + Firecrawl + Lovable AI
            - No n8n/Dify/Next.js/Agentforce
            - Sell outcomes not tools
            - Swiss market automation philosophy

PAGE 6-7    4-Layer Scanner Architecture
            - Evidence → Normalize → Score → Interpret
            - Data flow with timings
            - Async-ready from day one (resolved conflict A)

PAGE 8-9    Data Sources (3-Tier)
            - Tier 1: PageSpeed, Observatory (MVP)
            - Tier 2: Firecrawl scrape/map/search (MVP)
            - Tier 3: BuiltWith, DataForSEO, OAuth (Phase 2+)

PAGE 10     Normalization Layer
            - 25+ signals with types, sources, confidence levels

PAGE 11-12  Scoring Engine
            - 5 categories, weights, rules, thresholds
            - Red/Yellow/Green buckets
            - Deterministic TypeScript, not AI

PAGE 13     AI Interpretation Layer
            - What goes in, structured output schema
            - What AI is NOT allowed to do
            - Hallucination reduction (temp 0.3, validation, evidence-back-ref)

PAGE 14     Commercial Offer Ladder
            - Free → CHF 290 Deep Scan → CHF 1,990 Sprint → CHF 3,900/mo Growth
            - Anti-Knebel guarantee
            - Revenue projections labeled as hypotheses

PAGE 15     Database Schema
            - analysis_reports: extend now (raw_evidence, normalized_signals, etc.)
            - scan_runs: add Phase 2 (resolved conflict B, with firm timeline)

PAGE 16     Edge Function Architecture
            - business-scanner (NEW, async-ready)
            - get-analysis-report (KEEP)
            - submit-lead (KEEP)
            - Failure handling, graceful degradation

PAGE 17     Frontend File-by-File
            - Keep/Modify/Split/Replace/Deprecate for each file
            - New files: ScanPage, ScanProgressPage, report components

PAGE 18     User Flow
            - Ad → Scan LP (NOT homepage) → Form → Progress → Report → Upsell
            - Homepage stays separate as brand/authority (resolved conflict C)

PAGE 19     Risks & Red Flags (top 10, deduplicated)

PAGE 20     Build Order & 30/60/90 Plan
            - Exact sequence: Firecrawl link → business-scanner → DB migration → frontend → cleanup
```

## What gets CUT from the previous "Source of Truth"

- All duplicate explanations of the same architecture across docs
- The ChatGPT review section (useful context but not operational — move to appendix or drop)
- Portfolio archetype section (keep as 1 table, not a full page)
- Automation recommendation framework (keep as decision tree table, not full section)
- Admin workflow (compress to half page)
- Duplicate risk tables
- Any wording suggesting "AI does everything"
- Revenue projections presented as facts (relabel as hypotheses)

## What gets ADDED that wasn't in the merge

- Your conflict resolutions as explicit "DECISION" callout boxes
- A "What This Document Is NOT" disclaimer on page 1
- Firm Phase 2 timeline for `scan_runs` table (not "someday")
- Async-ready architecture notes on the scanner flow

## Technical approach

- Python + reportlab, same dark premium styling
- Output: `/mnt/documents/itsfeierabend-definitive-source-of-truth.pdf`
- QA all pages visually

