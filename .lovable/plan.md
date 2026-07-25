## Ziel

itsfeierabend.ch vom aktuellen "Audit-first / Instrument Panel"-Stand zum launch-fähigen, verkaufsfähigen Lead-Gen-Produkt bringen — mit klarer Positionierung als AI Business Audit Plattform für Schweizer KMU, funktionierendem Funnel, sauberem Tracking, SEO/AI-Visibility-Basis und dokumentiertem QA-Bericht.

Der Umfang des Briefings (24 Phasen) übersteigt einen einzelnen Turn deutlich. Ich schlage eine **fünf-Sprint-Struktur** vor, in der jeder Sprint eigenständig abnehmbar ist. Freigabe erfolgt Sprint für Sprint — so behalten Sie Kontrolle, Rollback bleibt möglich, und wir vermeiden 8 Stunden blinde Massenänderung.

## Wichtige Vorentscheidungen (bitte beim Freigeben mitbeantworten)

1. **Preise**: Memory + aktuelle Site führen Launch Sprint CHF 1'990 / Growth CHF 3'900/Mt / Scale CHF 6'900/Mt. Briefing sagt „keine Preise erfinden". → **Weiter mit diesen freigegebenen Preisen (empfohlen)** oder **auf „Analyse anfragen"/„Offerte erhalten" umstellen**?
2. **Positionierungs-Shift**: Aktuell = „AI-first digital marketing agency". Briefing = „AI Business Audit Plattform / digitale Wachstumsberatung" (kein Agentur-Framing). → **Voll umstellen auf Audit-Plattform** oder **hybrid (Audit-Plattform-Voice, Retainer als Umsetzungsarm)**?
3. **Deployment**: Preview only, oder nach QA direkt Publish auf itsfeierabend.lovable.app / itsfeierabend.ch?
4. **DNS/Domain**: bleibt tabu ohne separate Freigabe — bestätigt?

---

## Sprint 1 — Baseline & Foundation (Discovery + Repositioning)

**Deliverables**
- Live-Audit `itsfeierabend.ch` (DE/EN, Desktop + Mobile 375/768/1440): Screenshots, Console/Network-Errors, LCP/CLS-Messung via Playwright.
- Repo-Audit: bestehende Routen, ungenutzte Komponenten, Bundle-Analyse, Supabase-Tabellen (`leads`, `audit_requests`, `audit_events`, `calls`), RLS-Prüfung.
- Semrush-Analyse: Cluster „website audit schweiz", „seo audit schweiz", „ai visibility", „business audit kmu", „ai seo schweiz" — Volume, KD, Intent, Top-SERP, Gaps → **finale Keyword-Map als Markdown** (`docs/keyword-map.md`).
- **Baseline-Tabelle** (`docs/baseline-audit.md`): Bereich · Zustand · Problem · Massnahme · Sprint.
- Positioning-Update in `src/i18n/translations.ts` + `mem://brand/core-repositioning-ai-first`: von „AI-first Agency" → „AI Business Audit Plattform für Schweizer KMU" (falls Entscheidung 2 = voll umstellen).

**Nicht in diesem Sprint**: Code-Redesign, neue Seiten.

---

## Sprint 2 — Information Architecture & neue Seiten

**Route-Finalisierung** (DE/EN paarig, via `routePairs.ts`):

```text
/                       Home (bereits neu, nur Copy-Refresh)
/ai-business-audit      NEU — Landing für Haupt-Lead-Magnet (statt /audit-Formular pur)
/website-audit          NEU — SEO-Landing „website audit schweiz"
/seo-analyse            NEU — SEO-Landing „seo audit schweiz"
/ai-visibility          NEU — SEO-Landing „ai search visibility"
/business-health-check  NEU — breiter Einstieg KMU-Diagnose
/leistungen             ersetzt bisherige Services-Übersicht
/pakete                 bleibt (Copy-Refresh)
/fuer-kmu               NEU — Zielgruppenseite
/partner                NEU — Partner/White-Label-Funnel
/fallstudien            bleibt (nur belegbare Cases)
/insights (blog)        bleibt
/ueber-uns              NEU/refresh
/kontakt                bleibt
/audit → /audit         Prototyp bleibt technisches Funnel-End
```

Alte Routen (`/system`, `/gratis-audit`, etc.) → 301-Redirects über `<Navigate replace>`.

**Content-Skelett** (DE-CH-Sie, EN professional) pro Seite: Hero · Problem · Was wird analysiert · Beispiel-Output · Ablauf · CTA. Kein Lorem-Ipsum.

---

## Sprint 3 — AI Business Audit Produkt-Härtung

Bestehender Prototyp `AuditV0Page` wird zum Produkt gemacht:

- **Progressive Disclosure**: 3 Schritte statt Riesenformular (URL → Kontext → Kontakt).
- **Score-Report** klar labelled: `automatisch gemessen` · `basierend auf Ihren Angaben` · `vorläufige Schätzung` — visuelle Badges pro Signal.
- **Preliminary-Audit-Fallback**, wenn Site nicht crawlbar (Timeout/SSRF-Block/JS-only).
- Report-UI: Gesamtscore + Top-3 Stärken + Top-3 Risiken + 3-5 priorisierte Massnahmen + „Nächster Schritt"-CTA (Beratung buchen oder vertieftes Audit).
- Semrush-Enrichment (bereits vorhanden) im Report sichtbar & mit Herkunfts-Label.
- E-Mail-Versand `send-report-email` auf Produktion prüfen (aktueller Zustand: verifizieren).

---

## Sprint 4 — Tracking, CRM, SEO, Trust

**Tracking** (`src/lib/analytics.ts`): alle im Briefing gelisteten Events (`audit_start`, `audit_step_complete`, `audit_submit`, `lead_form_*`, `pricing_cta_click`, etc.) mit Parametern (`cta_location`, `page_type`, `audit_type`, `industry`, `utm_*`). Consent-Mode v2 bleibt, Debug-View-Screenshot als Beleg.

**CRM/Lead-Struktur** in Supabase `leads`: Attributions-Felder ergänzen falls fehlend (`landing_page`, `referrer`, `utm_*`, `cta_location`, `lead_score`, `status`). Migration inklusive GRANT + RLS.

**SEO**: pro Seite Title/Description/H1/Canonical/Hreflang/OG via `SEOHead`. `sitemap.xml` + `robots.txt` regenerieren. JSON-LD: `Organization`, `WebSite`, pro Leistungsseite `Service`, `FAQPage` nur mit sichtbaren Fragen, `BreadcrumbList`. **Keine erfundenen Reviews/AggregateRating**.

**AI Visibility**: About-/Methodik-Seite mit klaren Entity-Fakten (Firma, Gründer/Verantwortlich falls freigegeben, Standort, Leistungen, Prozess), Glossar (`/insights/glossar`), zitierfähige FAQ-Blöcke.

**Trust-System**: nur belegbare Cases (umzugscheck.ch, zuegelhelden.ch, sbpictures.ch, velolife.ch — als „verbundene Projekte" gekennzeichnet), transparente Methodik-Seite, Beispiel-Report-Screenshot, Datenschutz/Impressum-Refresh.

---

## Sprint 5 — QA, Performance, Launch

- Playwright-Sweep: alle Routen DE/EN bei 375/768/1440, Overflow-Detection, Konsolen-Fehler-Scan.
- Formular-E2E: Audit-Submit, Kontakt, Callback, Partner — mit Test-Lead in DB verifiziert.
- Lighthouse (Mobile) für `/`, `/ai-business-audit`, `/audit`: Ziel LCP < 2.5s, CLS < 0.1.
- A11y-Sweep: axe-core via Playwright, Kontraste, Focus-States, Reduced-Motion.
- Security: `security--run_security_scan`, RLS + GRANTs auf allen neuen Tabellen.
- **Abschlussbericht** (`docs/launch-report.md`) mit den 29 Punkten aus dem Briefing: Screenshots vorher/nachher, Event-Liste, Bundle-Delta, verbleibende Risiken, 30/60/90-Tage-Roadmap.
- Publish auf Lovable-URL (nur wenn Entscheidung 3 = ja).

---

## Constraints (durchgehend)

- Keine Vermischung mit feierabendservices.ch / umzugscheck.ch — separate Leads, keine übernommenen Copy/CTAs/Kampagnen.
- Keine erfundenen Logos, Testimonials, Zahlen, Zertifikate.
- Alle primären CTAs → `/ai-business-audit` (neu) bzw. `/audit`-Prototyp.
- Sie-Ansprache DE-CH, „you" EN, keine „revolutionär"/„disruptiv"-Sprache.
- DNS/Ads/E-Mails an echte Kontakte: nur mit expliziter Freigabe.

## Technische Details

- Branch: `feat/itsfeierabend-final-launch` (via Lovable-GitHub-Sync).
- Kein Framework-Wechsel, keine grosse Refactoring-Welle — bestehendes React/Vite/Tailwind/Supabase-Stack bleibt.
- Bundle-Budget Homepage: kein `jspdf`/Admin-Import (bereits erfüllt, im QA verifizieren).
- Neue Landings verwenden bestehende `EditorialHero`/`ScoreCard`/`SignalStream`-Komponenten — kein neues Design-System.

---

## Freigabe

Bitte antworten mit:
- **„Sprint 1 starten"** + Antworten auf Vorentscheidungen 1–4, oder
- Anpassungen am Plan (z. B. andere Sprint-Reihenfolge, Seiten streichen/ergänzen).

Ich starte dann mit Baseline-Audit + Semrush-Recherche und liefere die beiden Dokumente + Positioning-Diff, bevor Code für Sprint 2 entsteht.