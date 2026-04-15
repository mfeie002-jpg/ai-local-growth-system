

# Sprint 0: Scanner Foundation — Architecture, Schema, Routes, Gating

## Current State (confirmed)
- Firecrawl connector exists (`std_01kcxx4b02exxr3sxbc3ww7vn7`) but is **not linked**
- `generate-analysis-report` is 582 lines of pure AI hallucination — asks LLM to invent all scores, issues, and revenue numbers
- `AnalysisRequestForm.tsx` calls `generate-analysis-report` **synchronously** — user waits while LLM generates fake data
- `analysis_reports` table has no columns for real evidence, signals, or scoring details
- No progress/polling infrastructure exists

## What Sprint 0 delivers
The **foundation layer** so that Sprints 1-5 can build on solid ground. No scanner logic yet — just the skeleton.

---

### Step 0: Link Firecrawl Connector
Use `standard_connectors--connect` to link Firecrawl to the project. This makes `FIRECRAWL_API_KEY` available in edge functions. **Blocker for everything else.**

### Step 1: Database Migration
Extend `analysis_reports` with new columns:

| Column | Type | Purpose |
|--------|------|---------|
| `raw_evidence` | jsonb | PageSpeed/Observatory/Firecrawl raw responses |
| `normalized_signals` | jsonb | 25+ typed signals with confidence levels |
| `scoring_details` | jsonb | Per-pillar scores + weights + breakdown |
| `ai_interpretation` | jsonb | LLM narrative, top fixes, recommendations |
| `scan_duration_ms` | integer | How long the scan took |
| `scan_version` | text | Scanner version string (e.g. "1.0.0") |
| `data_sources_used` | text[] | Which sources completed successfully |
| `scan_status` | text | queued/collecting/normalizing/scoring/interpreting/complete/partial/failed |
| `language` | text | de/en — for locale-aware AI interpretation |
| `checks_passed` | integer | X of Y checks completed |
| `checks_total` | integer | Total checks attempted |

All columns nullable with sensible defaults so existing reports keep working.

### Step 2: New Routes
Add to `App.tsx`:

```
/analyse/progress/:token    → ScanProgressPage (NEW)
/scan                       → ScanPage (NEW, future Sprint 4)
/en/analysis/progress/:token → ScanProgressPage
/en/scan                    → ScanPage
```

Create placeholder pages (`ScanProgressPage.tsx`, `ScanPage.tsx`) that render a "Coming Soon" state.

### Step 3: Edge Function Stubs
Create two new edge functions as **stubs** (proper logic comes in Sprint 1-2):

**`business-scanner/index.ts`** — The orchestrator stub:
- Accepts `{ websiteUrl, leadId, language }` 
- Validates input with Zod
- Creates an `analysis_reports` row with `scan_status: 'queued'`
- Returns `{ success: true, token }` immediately (async pattern)
- Does NOT do any actual scanning yet

**`scan-status/index.ts`** — The polling endpoint:
- Accepts `{ token }` 
- Reads `scan_status`, `checks_passed`, `checks_total` from `analysis_reports`
- Returns current status for frontend polling

### Step 4: Rewire Form to Async
Modify `AnalysisRequestForm.tsx`:
- Replace `generate-analysis-report` call with `business-scanner`
- On success: `navigate('/analyse/progress/${token}')` instead of waiting
- Remove the synchronous `isGenerating` spinner block

### Step 5: ScanProgressPage MVP
Build `ScanProgressPage.tsx`:
- Polls `scan-status` every 3 seconds
- Shows animated progress steps (Collecting → Normalizing → Scoring → Interpreting)
- When `scan_status === 'complete'`: auto-redirect to `/analyse/:token`
- When `scan_status === 'failed'`: show error + "We'll email your results" fallback
- Bilingual (DE/EN)

### Step 6: Update config.toml
Add function config for new edge functions:
```toml
[functions.business-scanner]
verify_jwt = false

[functions.scan-status]
verify_jwt = false
```

### Step 7: Save Memory
Update `mem://strategy/source-of-truth-v1.2` to mark Sprint 0 as complete and record decisions made.

---

## What this does NOT do (deferred to Sprint 1+)
- No actual PageSpeed/Observatory/Firecrawl calls
- No signal normalization logic
- No scoring engine
- No AI interpretation
- No report page rebuild
- No fake proof removal (Sprint 4)

## Estimated scope
6 files created, 3 files modified, 1 DB migration, 1 connector link. Clean, testable foundation.

