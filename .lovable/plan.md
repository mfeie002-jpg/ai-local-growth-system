# Plan: Performance, SEO & Audit-Launch finalisieren

Drei parallele Arbeitsstränge, in einem Durchgang umgesetzt.

---

## 1) Core Web Vitals & Hintergrund-Balance

**Ziel:** LCP schneller, CLS null, INP stabil, Backdrop sichtbar aber ruhig.

- `NeuralBackdrop.tsx`
  - Partikel-Velocity halbieren (0.32 → 0.16 Desktop, 0.18 → 0.09 Mobile), Dichte leicht reduzieren (divisor 22k → 28k).
  - `IntersectionObserver` wieder aktivieren (pausiert Loop wenn keine `[data-neural-zone]` sichtbar).
  - `prefers-reduced-motion`: statischer Snapshot statt Loop.
  - Canvas erst nach `requestIdleCallback` mounten, damit LCP nicht blockiert wird.
- `index.css`
  - Orb-Zyklen von 24/32/40s auf 40/55/70s zurückdrehen (ruhiger, sichtbar).
  - Paper-Veil 25% → 35% (weniger Ablenkung von Text).
  - `content-visibility: auto` auf Sektionen unter dem Fold.
- Bilder / Assets
  - `loading="lazy"` und `decoding="async"` konsequent, `width`/`height` überall setzen (CLS = 0).
  - Fonts: `font-display: swap` prüfen, nur die 2–3 wirklich genutzten Weights preloaden.
- Header: Sicherstellen dass keine JS-Chunks das Hero blockieren (defer/async).

## 2) SEO & Structured Data pro Seite verifizieren

**Ziel:** Jede öffentliche Route hat korrektes Title/Description/Canonical/OG + passendes JSON-LD.

- Audit-Matrix erzeugen für alle Routen aus `src/App.tsx` (Home, Audit, Ultimate, Pricing, FAQ, Services, Case Studies, Blog, Blog-Post, System, Investor, Imprint, Privacy, 404 — je DE/EN).
- `SEOHead.tsx` prüfen: `og:title`, `og:description`, `og:url`, `og:type`, `twitter:card`, `canonical`, `hreflang` (aus `routePairs.ts`).
- JSON-LD pro Seitentyp:
  - Home: `Organization` + `WebSite` (mit `SearchAction` wenn sinnvoll).
  - Services-Hub + Detail: `Service`.
  - Pricing: `Product`/`Offer` **nur** wenn Preise real angezeigt werden.
  - FAQ: `FAQPage` aus tatsächlichen Fragen.
  - Blog-Post: `Article` mit `datePublished`/`author`.
  - Case Studies: `ItemList`.
  - Audit-Result: `noindex` (privat), kein Schema.
- `index.html`: sitewide `Organization`-Schema prüfen, `og:image` nur wenn absolute URL vorhanden.
- `sitemap.xml` gegen aktuelle Routen abgleichen, `robots.txt` bestätigt `/audit/r/`, `/admin`, `/analyse/` = Disallow.

## 3) Gratis-Audit-Launch finalisieren

**Ziel:** End-to-End-Flow poliert, verständliche States, klare Bestätigung.

- **Formular (`AuditV0Page.tsx`)**
  - Inline-Validierung (URL, E-Mail) mit klaren Fehlertexten DE/EN.
  - Submit-Button Loading-State + Disabled während Turnstile lädt.
  - Fehler-Toasts für: Rate-Limit, Bot-Check, ungültige URL, 30-Tage-Cooldown (mit Hinweis „Report existiert bereits, hier ansehen →").
- **Confirmation-Screen** (neu, nach Submit vor Redirect zum Report)
  - Was passiert jetzt? 3-Schritt-Visualisierung: Signale sammeln → Scoren → Report bauen.
  - Progress-Anzeige mit `ScanProgressPage`-Polling wiederverwenden.
  - „Report-Link wurde an deine E-Mail gesendet" — mit tatsächlichem Send-Status.
- **Report-Anzeige (`AuditV0ResultPage.tsx`)**
  - Score-Hero mit ScoreCard, Kategorie-Breakdown, Top-3-Opportunities, Semrush-Panel (mit Fallback wenn `unavailable`).
  - Klare CTA am Ende: „Umsetzung buchen" → `/call` bzw. Ultimate Package.
  - Print/PDF-freundliches Layout (`@media print`).
- **Bestätigungs-E-Mail (`send-report-email`)**
  - HTML-Template mit Score, Top-3-Findings, Link zum Report.
  - Fallback wenn Resend/Mail-Provider fehlt: nur Report-Link zeigen, E-Mail als „coming soon" markieren.

---

## Technische Details

**Betroffene Dateien**
- Performance: `src/components/neural/NeuralBackdrop.tsx`, `src/index.css`, `src/components/Layout.tsx`.
- SEO: `src/components/SEOHead.tsx`, `src/pages/*.tsx` (je nach Bedarf JSON-LD-Block), `index.html`, `public/sitemap.xml`, `public/robots.txt`.
- Audit-Launch: `src/pages/AuditV0Page.tsx`, `src/pages/AuditV0ResultPage.tsx`, ggf. neue `src/components/audit/ConfirmationCard.tsx`, `supabase/functions/send-report-email/index.ts`.

**Verifikation**
- `bunx tsc --noEmit` clean.
- Playwright-Smoke: `/audit` → submit → progress → report sichtbar.
- Manuelle Sichtprüfung Home Desktop + Mobile für Backdrop-Ruhe.
- View-Source-Check auf 3 Routen für Title/OG/JSON-LD.

**Nicht enthalten** (bewusst raus)
- Kein Redesign von Sektionen.
- Keine neuen Features/Signale im Scoring.
- Kein Rebrand.
