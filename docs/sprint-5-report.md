# Sprint 5 — Mobile QA, Performance, Publish-Vorbereitung

## Mobile & Multi-Viewport QA
Playwright-Sweep über **11 öffentliche Routen × 3 Viewports (375 / 768 / 1280 px)**:
- **0 horizontale Overflows**
- **0 JS-Runtime-Errors** in unserem App-Code
- Screenshots: `/tmp/browser/qa/shots/*.png`

## Behobene Findings
- **Turnstile-Widget:** `String(SITE_KEY)`-Coercion in `src/components/Turnstile.tsx` als Härtung.
- **Turnstile 110200** auf localhost = "Domain not allowed" (Cloudflare-Widget-Setting). **Kein Code-Bug** — muss in Cloudflare Turnstile `itsfeierabend.ch` als erlaubte Domain hinterlegt sein. Auf localhost/preview zeigt der Widget deshalb einen Error — Produktion bleibt sauber.

## Sitemap ↔ Routen Abgleich
- 65 URLs in `public/sitemap.xml` inkl. aller 12 Blog-Slugs (DE+EN) und 5 SEO-Landings.
- 61 Route-Definitionen in `App.tsx` (inkl. `:slug`-Wildcards und Admin — Admin bewusst nicht im Sitemap).
- **Deckung: vollständig** für öffentliche Routen.

## Supabase Linter
```
INFO ×2  RLS Enabled No Policy   (interne Tabellen, kein Data-API-Zugriff)
WARN ×2  SECURITY DEFINER Funktionen exponiert (has_role-Pattern — bewusst)
WARN ×1  Leaked-Password-Protection disabled  ← empfohlen in Cloud-Auth-Settings aktivieren
```
Keine kritischen Findings. Empfehlung: Leaked-Password-Protection einschalten (User-Aktion in Auth-Settings).

## Offen vor Publish
1. **Impressum-Pflichtangaben** (Rechtsform, Sitz, verantwortliche Person, ggf. UID) — braucht Ihre Facts.
2. **Turnstile Cloudflare-Widget:** Domain `itsfeierabend.ch` + `www.itsfeierabend.ch` als "Allowed hostnames" eintragen.
3. **Leaked-Password-Protection** in Backend-Auth aktivieren.
4. **Freigabe** für `preview_ui--publish`.

## Bereit
- Design, Navigation, Audit-Flow, Tracking, SEO, Sitemap → alle grün.
- Publish-Ready **sobald** Punkte 1–3 geklärt sind.
