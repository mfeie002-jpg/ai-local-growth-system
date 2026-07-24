## Ziel

Homepage konsequent auf Audit-first Lead-Generation umbauen: klare Diagnose → Audit als Produkt → Ultimate Package → Umsetzung/Preise. Bestehende 8-Sektionen-Struktur wird auf die 12-Slot-Storyline erweitert, DE/EN synchron, ohne erfundene Kennzahlen.

## Umfang

**Betroffene Dateien**
- `src/pages/HomePage.tsx` — vollständige Neustrukturierung (Sektionen 01–11)
- `src/components/Header.tsx` — Navigation, permanenter CTA „Gratis Audit starten"
- `src/components/Footer.tsx` — Paketnamen synchronisieren
- `src/pages/PricingPage.tsx` — Paketnamen/Preise auf Launch Sprint / Growth / Scale Retainer vereinheitlichen
- `src/i18n/translations.ts` — neue Copy-Blöcke DE/EN
- `src/App.tsx` — Redirects `/gratis-audit` → `/audit`, `/en/free-audit` → `/en/audit`; Legacy-Report-URLs bleiben
- `src/components/SEOHead.tsx` / Home-JSON-LD — FAQPage-Schema nur mit sichtbaren Fragen
- `public/sitemap.xml` — geänderte Prioritäten falls nötig

**Nicht angefasst**: Audit-Prototyp (`AuditV0Page`, `AuditV0ResultPage`), Backend/Edge-Functions, Admin.

## Sektions-Mapping (neu → aktuell)

```text
01 Hero              ← vorhandener Hero, rechts Score-Preview-Mock (statisch, kein PDF)
02 Vertrauensleiste  ← NEU (unter Hero, hairline-Row mit 4 Claims)
03 Problem/Diagnose  ← ersetzt „The Promise" (Sec 02) — 5 Felder statt Fließtext
04 Audit als Produkt ← Midnight-Sektion, ersetzt „The Engine" (Sec 03), Report-Snippet
05 Ultimate Package  ← bleibt (Sec 04), Wording „Audit zeigt, was fehlt"
06 Umsetzung/7 Disz. ← bleibt (Sec 05), KI-Implementation als Core markiert
07 Prozess+Anti-Knebel NEU zwischen Services und Cases
08 Echte Arbeiten    ← bleibt (Sec 06), nur belegbarer Scope
09 Pakete & Preise   ← bleibt (Sec 07), 3 Namen vereinheitlicht
10 FAQ               ← NEU, 4 Einwände, JSON-LD FAQPage
11 Finaler CTA       ← bleibt (Sec 08)
```

## Content-Regeln

- Sie-Ansprache DE, „you" EN. Keine Wörter wie „revolutionär", keine %-Zahlen ohne Beleg.
- Preise: **Launch Sprint CHF 1'990 einmalig**, **Growth Retainer CHF 3'900/Monat**, **Scale Retainer CHF 6'900/Monat** — überall identisch.
- Cases: umzugscheck.ch, zuegelhelden.ch, sbpictures.ch, velolife.ch — nur Branche + tatsächlich erbrachte Leistung.
- FAQ (sichtbar = im Schema): (1) wirklich kostenlos, (2) verwendete Daten, (3) Rolle der KI, (4) Umsetzung möglich.

## CTA-Tracking

Data-Attribut `data-cta-loc` mit Werten `header|hero|audit-engine|ultimate|pricing|final|trust-strip`. Auslesen im bestehenden Analytics-Hook (Consent-gated).

## Routing & Redirects

- `/gratis-audit` → `Navigate replace` auf `/audit`
- `/en/free-audit` → `Navigate replace` auf `/en/audit`
- `/gratis-audit/report/:token` und `/en/free-audit/report/:token` bleiben (Legacy).

## Performance

- Score-Preview als reines SVG/HTML (kein Chart-Lib).
- FAQ als `<details>` (nativ, kein Radix-Bundle für Above-the-fold).
- PDF-/Admin-Chunks bereits lazy — Check, dass HomePage keinen Import auf `AuditReportPage`, `AdminDashboard`, `jspdf` triggert.
- `NeuralBackdrop` bleibt sitewide, mit vorhandenem IntersectionObserver.

## Abnahme

- DE + EN identische Struktur, keine H1-Duplikate, `lang` korrekt, Canonical+hreflang.
- Prüfung bei 390/768/1440 px ohne Overflow.
- Alle primären CTAs landen auf `/audit` bzw. `/en/audit`; Redirects funktionieren (Playwright-Sniff).
- FAQ sichtbar = FAQ im JSON-LD.
- `tsgo` grün, Console/Network sauber.
- Bundle-Check: HomePage-Chunk enthält kein `jspdf`/Admin-Modul.

## Offene Punkte (bitte kurz bestätigen)

1. **Score-Preview** im Hero: statisches Mock-SVG mit Beispielwerten (kein Live-API-Call) — ok?
2. **Prozess-Sektion (07)**: als 4-Schritte-Editorial-Liste ohne Icons, Anti-Knebel als Fußnote — ok?
3. **Alte Sektion „The Promise"**: Inhalt wandert in Diagnose (03) oder wird ersatzlos gestrichen — Präferenz?