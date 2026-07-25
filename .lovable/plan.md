## Kontext

**Projekt:** `itsfeierabend.ch` — eigenständige Schweizer B2B-Plattform für AI Business Audits, Website-/SEO-Analysen, AI-Visibility, Growth Intelligence. Nicht zu verwechseln mit feierabendservices.ch. Ads komplett out-of-scope (per vorheriger Anweisung).

**Stand (verifiziert Ende Sprint 2):** Obsidian-Instrument-Design live, Homepage 11-Sektionen, 5 SEO-Landings live (`/website-audit`, `/seo-analyse`, `/ai-visibility`, `/fuer-kmu`, `/partner`), Audit-Prototyp v0.1 funktional, Hybrid-Pricing (Launch CHF 1'990 fix / Growth ab 3'900 / Scale ab 6'900), Semrush-Enrichment, Rate-Limits, Turnstile, CI-Tests, MCP-Server. Baseline: `docs/baseline-audit.md`, `docs/keyword-map.md`.

**Realitäts-Check der Ausführungsumgebung** (weil das Briefing aus ChatGPT-Work stammt):
- Kein Chrome-/Computer-Use-Plugin → Live-QA via Playwright im Sandbox (Screenshots, Console, Network, DOM).
- Kein Google-Drive, kein GA4/GSC-Direktzugriff → Tracking-QA via dataLayer-Inspektion und Playwright-Network-Sniffing.
- Kein GitHub-PR-Workflow → Commits landen direkt im aktuellen Branch; „Branch" ist hier ein Label, kein separater Push.
- Semrush ✅, Supabase/Cloud ✅, Lovable-AI ✅, Analytics-Read ✅, `websearch`/`fetch_website` ✅.
- Publish nur mit Ihrer expliziten Freigabe.

---

## 5-Sprint-Plan (sequenziell, mit Checkpoint pro Sprint)

### Sprint 3 — Positionierung & Audit-Produkt-Härtung
**Ziel:** Marke steht sichtbar als „AI Business Audit Plattform für Schweizer KMU" da. Audit funktioniert einwandfrei End-to-End.

- **Homepage-Hero neu:** H1 auf Plattform-Framing („AI Business Audit für Schweizer KMU — in 60 Sekunden sehen Sie, wo Ihr digitales Potenzial liegt"). CTA-Hierarchie: Primär `Kostenlosen Business Audit starten` → `/audit`, Sekundär `So funktioniert's` → `#ablauf`.
- **Navigation umbauen:** Header-Dropdown „Lösungen" (Website-Audit, SEO-Analyse, AI-Visibility, Für KMU, Partner), Footer-Sync, `/ultimate-package` als sichtbarer Menüpunkt.
- **Legacy-Routen aufräumen:** `/system`, `/demo`, `/scan` → Redirect auf `/audit` oder aus Nav entfernen (Files bleiben).
- **Audit-Flow Progressive Disclosure:** URL-First (1 Feld) → Ergebnis-Preview → Kontaktdaten optional für vollen Report. Kein Multi-Step-Wall.
- **Audit-Report v0.1 polieren:** Quellen-Badges (Lighthouse / Semrush / HTML-Parser) sichtbar pro Signal, „Was bedeutet dieser Score?"-Erklärbox, Preliminary-Fallback wenn Fetch fehlschlägt, PDF-Export testen.
- **Semrush-Baseline** über eigene Domain + 2 Wettbewerber dokumentiert.

**Deliverable:** `docs/sprint-3-report.md` mit Vorher/Nachher-Screenshots, Semrush-Snapshots, verifizierter Audit-Flow.

### Sprint 4 — Tracking, CRM, Trust, Recht, Content-Qualität
- **GA4-Events** (via bestehendes `analytics.ts` + `useUTMTracking`) verifizieren: `audit_start`, `audit_submit`, `lead_form_success`, `consultation_cta_click`, `pricing_cta_click`, `contact_click` — mit Parametern `page_type`, `audit_type`, `cta_location`, `utm_*`. Playwright-Netzwerk-Sniff mit/ohne Consent.
- **Duplicate-Event-Check** über dataLayer-Inspektion.
- **UTM-Persistenz** über Anchor-Navigation und Formular-Submit bestätigt.
- **Lead-Datenmodell:** `leads`-Tabelle Felder-Audit (Quelle, UTM, fs_intent, Audit-Typ, Consent, Timestamp) — fehlende Spalten via Migration ergänzen, RLS-Linter grün.
- **E-Mail-Benachrichtigung** (`send-report-email`) End-to-End getestet, kein Silent-Fail.
- **Impressum + Datenschutz** vollständig: Verantwortlicher, Auftragsverarbeiter (Supabase/Lovable AI/Semrush/Turnstile), Cookies, Betroffenenrechte, CH-DSG.
- **JSON-LD-Sweep:** Organization, WebSite, Service (5 Landings), FAQPage (Home+FAQ+Landings) — alle Rich-Results-valide.
- **Content-QA:** grep nach „Feierabend Services", „Räumung", „Zug", „Lovable App", TODO/FIXME/Lorem, kaputte interne Links.
- **Sitemap+robots-Diff:** alle öffentlichen Routen drin, alle privaten raus.

**Deliverable:** `docs/sprint-4-tracking-qa.md` mit Event-Matrix, Consent-Screenshots, RLS-Linter-Report.

### Sprint 5 — Mobile-QA, Performance, Accessibility, Publish-Vorbereitung
- **Playwright-Screenshots** aller Public-Routen bei **320 / 375 / 390 / 430 / 768 / 1024 / 1440 px** DE+EN.
- **Overflow-Check** (kein horizontaler Scroll, kein cut-off).
- **Core Web Vitals:** Lighthouse via Playwright auf Home + Audit + einer Landing. Targets: LCP <2.5s, CLS <0.1, INP <200ms. Fixes wo nötig (AVIF/WebP, Preload, Font-Subsetting, Third-Party-Weight).
- **Accessibility:** axe via Playwright, Focus-States, Kontraste, aria-Labels an Icon-Buttons, Reduced-Motion respektiert.
- **Broken-Link-Sweep** (interne Links, CTAs, Anchors, Sitelink-Targets `#ablauf`, `#preise`, `#wertanrechnung`).
- **Security-Scan** + Supabase-Linter → kritische Findings adressieren.
- **DNS-Verifikation** (nur read-only): itsfeierabend.ch / www / SSL / Redirect-Verhalten dokumentieren, keine DNS-Änderung.
- **Preview grün** → **Freigabe für Publish von Ihnen einholen** → dann `preview_ui--publish`.

**Deliverable:** Finaler Abschlussbericht `docs/final-launch-report.md` nach dem 29-Punkte-Schema aus Ihrem Briefing, inkl. 30/60/90-Tage-Prioritäten.

---

## Guardrails (nicht verhandelbar)

- **Keine erfundenen** Reviews, Kennzahlen, Zertifikate, Logos, Kundenlisten, Erfolgsquoten. Proof nur mit Quelle oder hinter `site.ts`-Flag.
- **Keine Preise erfinden** — Hybrid-Pricing bleibt, weitere Zahlen nur nach Ihrer Freigabe.
- **Ads komplett out-of-scope.**
- **Kein DNS-Change** ohne Freigabe.
- **Kein Publish** ohne Freigabe.
- **Design-System bleibt Obsidian Instrument** — kein Rebrand nach Navy/Gold.
- **Keine Feierabend-Services-Inhalte** übernehmen; Umzugscheck/Feierabend Services als Fallstudie nur wenn Aussagen belegbar und Verbindung transparent gekennzeichnet.
- **Keine Löschungen** in Supabase, keine RLS-Weichspülung.

---

## Checkpoint-Regel

Nach jedem Sprint pausiere ich und zeige Ergebnisse. Nächster Sprint erst nach Ihrem OK. Publish nur nach explizitem „Publish"-Kommando am Ende Sprint 5.

---

## Vor Start — 3 kurze Bestätigungen

1. **Sprint-Reihenfolge OK** (3 → 4 → 5), oder anderes Bündel zuerst?
2. **Audit-Report-Tonalität:** sachlich-analytisch (Beratungs-Tonalität) oder motivierend-aktivierend (Wachstums-Tonalität)? Prägt `ai-interpret`-Prompts.
3. **Fallstudien:** Umzugscheck / Feierabend Services als „verbundenes Projekt" auf Case-Studies-Seite ausweisen — mit welchem konkret belegbaren Scope (Leistung, Zeitraum)? Ohne Belege lasse ich sie feature-flagged off.

Nach kurzer Antwort auf diese 3 Punkte starte ich mit Sprint 3.