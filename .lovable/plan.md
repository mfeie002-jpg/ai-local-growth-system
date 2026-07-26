## Status Masterplan

Der 5-Sprint-Plan für `itsfeierabend.ch` ist **abgeschlossen**. Die Seite ist live unter `https://itsfeierabend.ch` und `https://itsfeierabend.lovable.app`.

**Abgeschlossene Sprints:**
- Sprint 1–2: IA, 5 SEO-Landings, Hybrid-Pricing
- Sprint 3: Audit-Produkt-Härtung, neue Hero-Positionierung, Navigation
- Sprint 4: Tracking/CRM, Lead-Datenmodell, Rechtstexte (Rahmen)
- Sprint 5: Mobile QA, Performance, Security-Scan, Publish

**Noch offene Pflichtpunkte vor 100% Launch-Sauberkeit:**
1. Impressum: Rechtsform, Sitz, verantwortliche Person (ggf. UID) fehlen.
2. Cloudflare Turnstile: `itsfeierabend.ch` + `www.itsfeierabend.ch` als erlaubte Hostnames eintragen.
3. Supabase Auth: Leaked-Password-Protection aktivieren.

---

## Vorschlag: Nächste Phase

Ich schlage vor, wir machen **zwei Dinge parallel**:

### A. Offene Launch-Punkte finalisieren (blockierend für sauberen Betrieb)

1. **Impressum + Datenschutz vervollständigen**
   - Du lieferst: Rechtsform, Sitz, verantwortliche Person, UID (falls vorhanden).
   - Ich trage die Werte in `src/pages/ImprintPage.tsx` und `src/pages/PrivacyPage.tsx` ein (DE + EN).
   - Datenschutz: Auftragsverarbeiter-Liste prüfen (Supabase, Lovable Cloud, Semrush, Turnstile) und aktualisieren.

2. **Turnstile Produktionssicherheit**
   - Cloudflare Turnstile Widget: Hostnames `itsfeierabend.ch` und `www.itsfeierabend.ch` zur Allowlist hinzufügen.
   - `src/components/Turnstile.tsx` hat bereits eine `String(SITE_KEY)`-Härtung.

3. **Auth-Härtung**
   - In den Backend-Auth-Settings "Leaked Password Protection" aktivieren.
   - Optional: Supabase Linter nochmals laufen lassen und bestätigen, dass keine kritischen Findings zurückbleiben.

### B. Post-Launch-Wachstum (nächste 30–60 Tage)

1. **Content-Sprint: 4–6 SEO-Artikel**
   - Ziel: organische Sichtbarkeit für Schweizer KMU-Themen rund um AI, Website-Audit, SEO.
   - Format: 1.500–2.000 Wörter, FAQ-Block, interne Verlinkung zu `/audit`.

2. **Fallstudien-Seite(n)**
   - Eine Case-Study pro Service (Website-Audit, SEO, AI-Visibility).
   - Nur mit belegbaren Daten; keine erfundenen Kennzahlen.

3. **Lead-Nurture-Sequenz**
   - 3 E-Mails nach Audit-Submission: Report erklären → nächster Schritt → Beratungsangebot.
   - Edge Function `send-report-email` existiert bereits.

4. **Conversion-Optimierung**
   - A/B-Test Hero-CTA-Texte (`Kostenlosen Audit starten` vs. `Website in 60 Sek. analysieren`).
   - Exit-Intent für `/audit` und `/pricing` prüfen.

5. **Analytics-Review**
   - 2 Wochen nach Launch: GA4-Events auf `audit_start`, `audit_submit`, `lead_form_success`, `pricing_cta_click` prüfen.
   - UTM-Persistenz über Seitenaufrufe validieren.

---

## Technische Details

**Dateien, die bei Impressum-Update betroffen sind:**
- `src/pages/ImprintPage.tsx`
- `src/pages/PrivacyPage.tsx`
- ggf. `public/sitemap.xml` (keine Änderung nötig, da rechtliche Seiten bereits drin)

**Externe Settings (nicht im Code):**
- Cloudflare Turnstile Dashboard → Site Settings → Allowed hostnames
- Lovable Cloud / Supabase Auth → Security → Leaked Password Protection

**Empfohlene Reihenfolge:**
1. Du lieferst Impressum-Fakten.
2. Ich aktualisiere Impressum + Datenschutz.
3. Du setzt Turnstile-Hostnames und Auth-Härtung.
4. Wir laufen einen finalen Smoke-Test gegen Produktion.
5. Dann starten wir Post-Launch-Wachstum mit Content-Sprint.

---

## Was ich von dir brauche

- Impressum-Fakten (Rechtsform, Sitz, verantwortliche Person, UID).
- Go für Turnstile-Hostname-Update (ich kann das nicht in Cloudflare setzen).
- Go für Leaked-Password-Protection (Backend-Setting).
- Priorität für Post-Launch-Welle: Content, Fallstudien, oder Lead-Nurture zuerst?

Sobald du die Fakten lieferst, implementiere ich Impressum + Datenschutz in einem Zug.