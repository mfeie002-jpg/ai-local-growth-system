# itsFeierabend.ch — Full-Stack Master Implementation Plan

> **Canonical Reference:** Source of Truth v1.2 (`public/docs/itsfeierabend-definitive-source-of-truth-v1.2.pdf`)
> **Architecture:** 4-Layer Pipeline (Evidence → Normalize → Score → Interpret)
> **Stack:** React 18 / Vite / Tailwind / Lovable Cloud (Supabase) / Edge Functions

---

## Phase 1: Real Scanner MVP (Day 1–30)

### Step 0 — Link Firecrawl Connector ⚡ BLOCKER
- [ ] Link Firecrawl connector (`std_01kcxx4b02exxr3sxbc3ww7vn7`) to project via `standard_connectors--connect`
- [ ] Verify `FIRECRAWL_API_KEY` is available in edge function environment
- **Why first:** Every subsequent step depends on real website data

### Step 1 — Database Migration
- [ ] Extend `analysis_reports` table with new JSONB columns:
  - `raw_evidence` (JSONB) — raw API responses from PageSpeed, Observatory, Firecrawl
  - `normalized_signals` (JSONB) — 25+ typed signals with confidence levels
  - `scoring_details` (JSONB) — per-category scores and weights
  - `ai_interpretation` (JSONB) — structured AI narrative output
  - `scan_duration_ms` (integer) — total scan time
  - `scan_version` (text, default `'1.0'`) — scanner version for reproducibility
  - `data_sources_used` (text[]) — which sources returned data
  - `scan_status` (text, default `'pending'`) — pending/scanning/completed/partial/failed
  - `language` (text, default `'de'`) — scan language for AI interpretation
  - `checks_passed` (integer, default 0) — for partial scan confidence
  - `checks_total` (integer, default 0) — total checks attempted
- [ ] Add RLS policy: service_role can insert/update (edge functions use service role)

### Step 2 — Build `business-scanner` Edge Function 🧠 MVP CORE
The orchestrator that replaces the hallucinating `generate-analysis-report`.

#### Layer 1: Evidence Collection
```
Input: { websiteUrl, leadId, language }
```
- [ ] **PageSpeed Insights** — `fetch()` to Google API (no key needed for basic)
  - Mobile + Desktop scores, LCP, CLS, TBT, FCP, SI
  - Retry on 429 with exponential backoff (max 3)
- [ ] **Mozilla HTTP Observatory** — `fetch()` to Observatory API v2
  - Security grade, HTTPS status, header analysis
- [ ] **Firecrawl Scrape** — via `FIRECRAWL_API_KEY`
  - formats: `['markdown', 'links']`, `onlyMainContent: true`
  - Extract: H1-H6 structure, CTAs, Impressum, contact info, meta tags
- [ ] **Firecrawl Map** — all URLs, page count, sitemap presence
- [ ] **Firecrawl Search** — `"{business_name}" reviews` + `"{domain}" Google Business`
  - Review signals, GBP presence, social profiles
- [ ] Each source wrapped in individual try/catch
- [ ] Store all raw responses in `raw_evidence` JSONB
- [ ] Track `data_sources_used[]` for transparency

#### Layer 2: Signal Normalization (TypeScript)
- [ ] Transform raw evidence into 25+ typed signals:
  - `mobile_performance_score` (int, observed)
  - `desktop_performance_score` (int, observed)
  - `lcp_ms` (int, observed)
  - `cls_score` (float, observed)
  - `tbt_ms` (int, observed)
  - `security_grade` (string, observed)
  - `has_https` (boolean, observed)
  - `has_clear_primary_cta` (boolean, inferred)
  - `has_phone_cta` (boolean, inferred)
  - `has_contact_form` (boolean, inferred)
  - `has_impressum` (boolean, inferred)
  - `page_count` (int, observed)
  - `has_sitemap` (boolean, observed)
  - `google_business_found` (boolean, inferred)
  - `review_count_estimate` (int, estimated)
  - `instagram_found` (boolean, estimated)
  - `facebook_found` (boolean, estimated)
  - `analytics_detected` (boolean, inferred)
  - `schema_markup_detected` (boolean, inferred)
  - `has_h1` (boolean, observed)
  - `meta_description_present` (boolean, observed)
  - `mobile_friendly` (boolean, inferred)
  - `content_security_policy` (boolean, observed)
  - `hsts_enabled` (boolean, observed)
- [ ] Each signal has: `value`, `type`, `source`, `confidence` (observed/inferred/estimated)
- [ ] Store in `normalized_signals` JSONB

#### Layer 3: Deterministic Scoring Engine (TypeScript)
- [ ] Calculate 5 category scores (0-100 each):
  - **Visibility (25%):** sitemap, GBP, meta tags, page structure, H1
  - **Trust (20%):** HTTPS, Impressum, reviews, security grade
  - **Conversion (25%):** CTA presence, mobile performance, contact form, phone
  - **Technical Health (15%):** PageSpeed scores, CLS, analytics, schema markup
  - **Automation Readiness (15%):** existing tools, routing capability, 24/7 potential
- [ ] `overall_score = V*0.25 + T*0.20 + C*0.25 + TH*0.15 + AR*0.15`
- [ ] Partial results: only weight available categories, add confidence hint
- [ ] Bucket assignment: `critical` (0-30), `warning` (31-60), `good` (61-80), `excellent` (81-100)
- [ ] Count issues by severity: critical_issues, warning_issues, info_issues
- [ ] Store in `scoring_details` JSONB
- [ ] **AI NEVER touches scores** — purely deterministic

#### Layer 4: AI Interpretation (Lovable AI Gateway)
- [ ] Use `google/gemini-2.5-flash` via Lovable AI Gateway (no API key needed)
- [ ] Temperature: 0.3 (strict)
- [ ] Input: scores + normalized signals + raw evidence excerpts
- [ ] Language-aware prompt template (DE or EN based on `language` field)
- [ ] Structured output (Zod-validated):
  ```typescript
  {
    executive_summary: string,        // 2-3 sentences
    top_3_opportunities: Array<{
      category: string,
      title: string,
      description: string,
      impact: 'high' | 'medium' | 'low',
      evidence: string                // cite the actual signal
    }>,
    top_fixes: Array<{
      title: string,
      effort: 'quick_win' | 'medium' | 'project',
      impact: 'high' | 'medium' | 'low',
      description: string
    }>,
    recommendation: 'diy' | 'deep_scan' | 'done_for_you',
    automation_tier: 'none' | 'light' | 'medium' | 'high',
    confidence_note: string           // "Based on X of Y checks"
  }
  ```
- [ ] Post-processing validation: verify all cited data exists in signals
- [ ] On AI failure: retry with backoff (max 2), then partial report without AI section
- [ ] Store in `ai_interpretation` JSONB

#### Orchestration Flow
```
receive request → validate input → set scan_status='scanning'
  → collect evidence (parallel where possible)
  → normalize signals
  → calculate scores
  → generate AI interpretation
  → update report with scan_status='completed'
  → return { success, token }
```
- [ ] Total target: 10-25 seconds for public scan
- [ ] On partial failure: set scan_status='partial', include what succeeded
- [ ] On total failure: set scan_status='failed', log error

### Step 3 — Build `scan-status` Edge Function
- [ ] Input: `{ token }` (report token)
- [ ] Returns: `{ status, progress_percent, current_step, checks_passed, checks_total, estimated_remaining_seconds }`
- [ ] Steps: `evidence_collection` → `normalization` → `scoring` → `ai_interpretation` → `complete`
- [ ] Reads from `analysis_reports.scan_status` + partial fields
- [ ] No JWT required (public access by token)

### Step 4 — Build `ScanProgressPage.tsx`
- [ ] Route: `/analyse/progress/:token` (DE) + `/en/analysis/progress/:token` (EN)
- [ ] Poll `scan-status` every 2 seconds
- [ ] Visual progress steps:
  1. 🔍 Collecting evidence...
  2. 📊 Analyzing signals...
  3. 🧮 Calculating scores...
  4. 🤖 Generating insights...
  5. ✅ Complete!
- [ ] Auto-redirect to `/analyse/:token` on completion
- [ ] Email fallback message if >60 seconds: "We'll email your results"
- [ ] Bilingual content (DE/EN)
- [ ] Dark theme, consistent with brand aesthetic

### Step 5 — Rewire `AnalysisRequestForm.tsx`
- [ ] Remove synchronous `generate-analysis-report` call
- [ ] New flow: submit lead → call `business-scanner` → redirect to progress page
- [ ] Add optional fields: `phone`, `industry` (dropdown)
- [ ] Add `language` to scanner payload from `useLanguage()` context
- [ ] Keep existing validation, consent, UTM tracking
- [ ] No more browser blocking — user immediately sees progress

### Step 6 — Remove Fake Social Proof
- [ ] Remove or hide fake testimonials: TechCorp, DataVision, SwissFinance, MediCare Plus
- [ ] Either replace with real portfolio projects (from whitelisted case studies) or hide section via `siteConfig.trustBrandsEnabled` flag
- [ ] Remove unverified claims: "200+ AI Integrations", "3x ROI"
- [ ] Audit all pages for invented metrics

### Step 7 — Rebuild Report Page
- [ ] Split `AnalysisReportPage.tsx` (1053 lines) into components:
  - `ReportHeader.tsx` — site name, overall score, scan date, confidence note
  - `ScoreBreakdown.tsx` — 5 category scores with radar/bar chart
  - `TopOpportunities.tsx` — AI-generated top 3 gaps with evidence
  - `TopFixes.tsx` — prioritized fixes by impact/effort
  - `EvidencePanel.tsx` — raw data sources, what was checked
  - `ReportCTA.tsx` — DIY / Deep Scan / Done-for-you paths
- [ ] Extract types to `src/types/analysis.ts`
- [ ] Extract data fetching to `src/hooks/useAnalysisReport.ts`
- [ ] Extract PDF logic to `src/lib/report-pdf.ts`
- [ ] Show confidence labels: "verifiziert" / "abgeleitet" / "geschätzt"
- [ ] Show data source coverage: "4 von 5 Check-Gruppen erfolgreich"

---

## Phase 2: Ad-Ready Funnel (Day 31–60)

### Scan Landing Page
- [ ] Create `ScanPage.tsx` — dedicated ad landing page
- [ ] Single conversion goal: enter URL → get scan
- [ ] No navigation distractions, minimal copy
- [ ] Route: `/gratis-scan` (DE) + `/en/free-scan` (EN)
- [ ] Optimized for Google Ads / Meta Ads traffic

### Homepage Sharpening
- [ ] Keep homepage as brand/authority page
- [ ] Scanner-aware messaging but NOT a landing page
- [ ] Clear path to scan from homepage, but not the primary goal
- [ ] Portfolio section with real case studies

### Content Cleanup
- [ ] Replace all placeholder content with real copy
- [ ] Real portfolio cases from whitelisted companies
- [ ] Remove "Edit with Lovable" badge for production
- [ ] Pre-rendering solution for SEO (react-snap or similar)

### Database: `scan_runs` Table (Phase 2 commitment)
- [ ] Create `scan_runs` table for async job tracking, retries, rescan history
- [ ] Fields: `id`, `report_id`, `status`, `started_at`, `completed_at`, `error`, `retry_count`, `trigger` (manual/auto/rescan)
- [ ] Required for: async processing, rescan button, scan history per domain

### Admin Dashboard Enhancements
- [ ] Scan metrics per day/week/month
- [ ] Average score and confidence distribution
- [ ] Data source success rates and credit/quota warnings
- [ ] Raw evidence, normalized signals, scoring breakdown in report detail view
- [ ] Rescan button per report
- [ ] Notes field for follow-up / package decisions

---

## Phase 3: Revenue Stream (Day 61–90)

### Deep Scan (CHF 290)
- [ ] Payment integration (Stripe or Paddle)
- [ ] Tier 2 data sources: Search Console, GA4, Google Ads
- [ ] Extended report with competitive insights
- [ ] Offer ladder: Free → CHF 290 Deep Scan → CHF 1,990 Sprint → CHF 3,900/mo Growth

### Follow-up Automation
- [ ] Automated follow-up emails (Resend connector)
- [ ] Report delivery email with CTA
- [ ] Review workflow for scanned businesses

### Voice Decision Gate
- [ ] Decide: Retell OR ElevenLabs (not both)
- [ ] Implement chosen voice stack for callback feature
- [ ] Only if scan volume justifies investment

### Scale Readiness
- [ ] Domain caching strategy (avoid re-scanning same domain within X hours)
- [ ] Job queueing if scan volume exceeds real-time capacity
- [ ] Credit/quota monitoring dashboard
- [ ] Target: 100+ scans with stable performance

---

## Technical Constraints & Governance

### Data Sources (MVP)
| Source | Method | Rate Limit | Cost |
|--------|--------|-----------|------|
| PageSpeed Insights | Direct fetch | 25k/day (free) | Free |
| Mozilla Observatory | Direct fetch | Generous | Free |
| Firecrawl Scrape | Connector API | Per plan | ~$0.01/scrape |
| Firecrawl Map | Connector API | Per plan | ~$0.01/map |
| Firecrawl Search | Connector API | Per plan | ~$0.01/search |
| Lovable AI (Gemini Flash) | Gateway | Usage-based | ~$0.01-0.05/call |
| **Total per scan** | | | **~CHF 0.05-0.20** |

### Security & Privacy
- No PII from scrapes persisted unless needed for report
- ip_hash for rate limiting only, not tracking
- Privacy policy update needed for scraping/caching disclosure
- nDSG compliant: Swiss data protection law

### What We Do NOT Build
- ❌ n8n / Dify / Flowise
- ❌ Next.js rebuild
- ❌ Salesforce / Agentforce
- ❌ Chatbot on report
- ❌ BuiltWith (Phase 2)
- ❌ Multiple voice stacks in parallel

---

## File Structure (New/Modified)

```
src/
├── types/
│   └── analysis.ts                    # NEW — Report types, signal types, score types
├── hooks/
│   └── useAnalysisReport.ts           # NEW — Data fetching + state for report page
├── lib/
│   └── report-pdf.ts                  # NEW — PDF generation logic extracted
├── pages/
│   ├── ScanPage.tsx                   # NEW — Ad landing page (Phase 2)
│   ├── ScanProgressPage.tsx           # NEW — Polling progress page
│   └── AnalysisReportPage.tsx         # REFACTOR — orchestrator only
├── components/
│   ├── forms/
│   │   └── AnalysisRequestForm.tsx    # MODIFY — async flow
│   ├── report/
│   │   ├── ReportHeader.tsx           # NEW — score + site info
│   │   ├── ScoreBreakdown.tsx         # NEW — 5 category visualization
│   │   ├── TopOpportunities.tsx       # NEW — AI top 3 gaps
│   │   ├── TopFixes.tsx               # NEW — prioritized fixes
│   │   ├── EvidencePanel.tsx          # NEW — data sources used
│   │   └── ReportCTA.tsx              # NEW — next step CTAs
│   └── SocialProofSection.tsx         # REPLACE CONTENT
supabase/
├── functions/
│   ├── business-scanner/index.ts      # NEW — 4-layer orchestrator
│   ├── scan-status/index.ts           # NEW — progress polling
│   └── generate-analysis-report/      # DEPRECATE (keep as fallback temporarily)
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] 10 real websites scanned with real data (no hallucination)
- [ ] All scores are deterministic and reproducible
- [ ] Progress page shows real-time scan status
- [ ] Report shows evidence sources and confidence levels
- [ ] No fake testimonials or unverified claims visible
- [ ] Bilingual (DE/EN) throughout scanner flow

### Phase 2 Complete When:
- [ ] Scan LP converts from ads
- [ ] scan_runs table operational
- [ ] Admin can rescan and see evidence details
- [ ] Real portfolio cases on homepage

### Phase 3 Complete When:
- [ ] Deep Scan purchasable
- [ ] 100+ scans processed stably
- [ ] Follow-up emails automated
- [ ] Voice stack decision made and implemented (if justified)
