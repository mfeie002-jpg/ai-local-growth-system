# Baseline Audit — itsfeierabend.ch

**Erfasst:** Sprint 1 · Live-Site + Repo · Desktop 1440, Mobile 390
**Quelle:** Playwright-Sweep (`/tmp/browser/baseline/results.json`) + Semrush (`ch` database)

## Zusammenfassung

Die Site läuft, HTTPS ok, SEO-Basics stehen. Kritisch für den Launch: (a) DE-Sprach-Hydration lädt sichtbar erst nach ~1-2s (initiales HTML rendert EN — Crawler-Risiko), (b) Home DE hat horizontal overflow auf Mobile, (c) Paketnamen sind live inkonsistent zum Plan ("Leader" statt "Scale Retainer"), (d) das Brand hat noch keinen organischen Traffic — SEO-Effort muss auf realistisch validierten Keywords aufbauen.

## Live-Baseline (kritisch)

| Bereich | Aktueller Zustand | Problem | Auswirkung | Sprint |
|---|---|---|---|---|
| Home DE Mobile 390 | `overflow_x = true` | Element bricht Viewport | Horizontales Scrollen, schlechte CWV/UX | 2 |
| /pakete DE Title (initial) | "Packages & Pricing" | i18n-Client-Hydration setzt Title erst nach Mount | Google/AI-Crawler sieht EN — falsches Signal für DE-URL | 4 |
| Paketnamen live | "Launch · Growth · Leader" | Plan/Memory verlangt "Launch Sprint · Growth Retainer · Scale Retainer" | Widerspruch Header/Home/Pakete/Footer | 2 |
| /audit Networkidle | Timeout > 30s | Turnstile/Analytics hält Verbindungen offen | Playwright/Lighthouse Timeouts, evtl. LCP-Risiko | 3 |
| /pakete DE Title (final) | "Pakete & Pricing" | Hybrid DE/EN | Wirkt unprofessionell | 2 |
| Semrush organic | 0 Keywords, 0 Traffic | Brand neu, kein Index-Footprint | SEO-Strategie muss von Null aufbauen | 4 |

## Live-Baseline (ok / neutral)

| Bereich | Zustand |
|---|---|
| HTTPS, SSL | ✅ gültig |
| `html lang` | ✅ korrekt (`de` / `en`) nach Hydration |
| Canonicals | ✅ gesetzt und selbstreferenzierend |
| Meta Description | ✅ vorhanden alle geprüften Seiten |
| Einzige H1 | ✅ h1_count = 1 auf allen geprüften Seiten |
| Console Errors | ✅ keine auf Home/Pakete/FAQ/Legal |
| Failed Requests | ✅ keine |
| Impressum/Datenschutz | ✅ vorhanden, nDSG-referenziert |
| Fallstudien | ✅ Route existiert, echte Beispiele aufgelistet |
| Ultimate Package Route | ✅ eigenständige Landing existiert |

## Repo-Baseline

| Bereich | Zustand |
|---|---|
| Framework | React 18 + Vite 5 + TS 5 + Tailwind |
| Routing | React Router mit DE/EN pairs (via `routePairs.ts`) |
| Backend | Supabase / Lovable Cloud — `leads`, `audit_requests`, `audit_events`, `calls`, `callback_requests`, `analysis_reports` |
| Auth | AuthContext + RLS (`has_role`) |
| Edge Functions | 21 aktive (`create-audit`, `compute-score`, `generate-report`, `send-report-email`, `submit-lead`, `retell-webhook`, MCP, etc.) |
| Secrets | Turnstile, Semrush (Connector), Google PageSpeed, Lovable AI, Firecrawl (Connector) |
| Design-System | "Obsidian Instrument" — dark, Space Grotesk / Inter / JetBrains Mono |
| Analytics | `useUTMTracking` + Consent-Mode v2 · Events noch nicht vollständig instrumentiert |
| Sitemap | 53 Routen, hreflang-alternates via `routePairs.ts` |
| Robots.txt | Admin/Reports/Preview-Tokens korrekt disallowed |
| CI | GitHub Actions (Playwright E2E) |

## Semrush — Marktrealität CH (Deutsch)

| Cluster | Bestes valides Keyword | Volumen | KD | Verwendbar für |
|---|---|---|---|---|
| Website-Diagnose | website analyse | 720/mo | 32 | `/website-audit` Landing |
| SEO-Audit | seo audit | 390/mo | 35 | `/seo-analyse` Landing |
| SEO-Tools | seo checker · seo check | je 1'300/mo | ~35 | Support-Cluster für /seo-analyse |
| Google-Sichtbarkeit | google ranking verbessern | **8'100/mo** | ~35 | starkes Ziel für /seo-analyse Hub |
| Suchmaschinen | suchmaschinenoptimierung | 880/mo | — | Support |
| Speed / PageSpeed | pagespeed · website speed test | 1'300 · 720 | low | Support |
| KI-Sichtbarkeit | keine validen Volumen (ai visibility / ai seo / chatgpt seo = —) | 0 | — | Early-Mover-Content, aber ohne Traffic-Erwartung 2026 |
| Business Audit CH | business audit schweiz | — | — | Nicht-suchbar — Positionierungswert, kein SEO-Wert |
| KMU-Themen | marketing automation kmu / lead generierung kmu | 0 | — | zu spitz für Organic |

**Ableitung:** SEO-Landings priorisieren, wo Volumen validiert ist. AI-Visibility bleibt Positionierung/Content, aber kein Ranking-Ziel für Q1.

## Nächste Schritte (in Sprint 2 einfliessend)

1. Paketnamen live vereinheitlichen: **Launch Sprint · Growth Retainer · Scale Retainer** (nach Freigabe).
2. Overflow-Ursache Home DE mobile isolieren (Header/Neural-Backdrop/Signal-Feed).
3. `/pakete` DE-Titel korrigieren, Client-Title-Flash reduzieren (initial Title in `index.html` ist EN — statischer Fallback ist EN, aber Route ist DE).
4. Neue SEO-Landings (`/website-audit`, `/seo-analyse`, `/ai-visibility`) mit realistischen H1 an validierten Keywords ausrichten.
5. Positioning-Umstellung (Agency → AI Business Audit Plattform) — wartet auf Vorentscheidung 2.
