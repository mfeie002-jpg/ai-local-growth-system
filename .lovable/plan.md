# Wo wir stehen geblieben — 3 offene Fäden zusammenführen

Du hast "alle 3" gewählt. Ich packe Cleanup-Verifikation, AI-Modell-Upgrade und den Knowledge-Export in einen Durchlauf.

---

## Befunde aus der Verifikation (vorab gecheckt)

| Punkt | Status |
|---|---|
| `generate-analysis-report` Edge Function | ✅ Bereits gelöscht (nicht mehr im `supabase/functions/`-Ordner) |
| `jspdf-autotable` in `package.json` | ❌ **Noch drin** (`^5.0.2`) — muss raus, PDF läuft jetzt über `@react-pdf/renderer` |
| `AuditFormStepper.tsx` | ⚠️ **Existiert noch** (349 Zeilen) parallel zu `AnalysisRequestForm.tsx` — prüfen ob noch referenziert |
| `SocialProofSection.tsx` | ❌ **Enthält Fake-Daten**: erfundene Testimonials ("Sarah M., TechCorp", "85% Antwortzeiten", "Platz 1 in 4 Monaten") + Placeholder-Logos. Verstösst gegen `mem://constraints/no-fake-proof` |
| `ai-interpret` Modell | `google/gemini-2.5-flash` — Upgrade-Kandidat |

---

## Plan

### 1) Sprint 0 Cleanup (4 Schritte)

**a) jsPDF entfernen**
- `bun remove jspdf-autotable` (und prüfen ob `jspdf` selbst noch drin ist → auch raus)
- Sicherstellen dass keine Imports mehr existieren (`rg "jspdf"`)

**b) AuditFormStepper-Status klären**
- Suchen wo `AuditFormStepper` noch importiert wird
- Wenn nur noch in alten Routen (`AuditPage`, `AuditReportPage`) → prüfen ob diese Routen aktiv sind oder deprecated
- Falls deprecated: Komponente löschen, sonst: dranlassen + Notiz in Memory

**c) SocialProofSection bereinigen** (wichtigster Fix)
- Erfundene Testimonials & Logos ENTFERNEN
- Ersatz-Variante: 
  - Entweder Section komplett rausnehmen
  - Oder neutrale "Wie wir arbeiten"-Karten (Methodik, Werte, Prozess) ohne Namen/Zahlen
- Hängt an `siteConfig.trustBrandsEnabled` / `proofNumbersEnabled` (beide bereits `false`) — die Section sollte diese Flags respektieren

**d) `generate-analysis-report` finale Bestätigung**
- Per `supabase--delete_edge_functions` sicherstellen dass die deployte Funktion wirklich weg ist (nicht nur Code lokal gelöscht)

---

### 2) AI-Modell-Upgrade für `ai-interpret`

Wechsel von `google/gemini-2.5-flash` → **`google/gemini-3-flash-preview`**

Begründung:
- Default-Empfehlung der Lovable AI Gateway
- Bessere Qualität bei gleicher Geschwindigkeit/Kosten-Klasse
- Kein API-Key-Wechsel nötig (LOVABLE_API_KEY ist gesetzt)

Optional als Folge-Iteration: Admin-Selector — **nicht jetzt**, erst wenn Modell-Wechsel öfter vorkommt.

---

### 3) Knowledge Export als Datei

Den im letzten Turn zusammengestellten `PROJECT_KNOWLEDGE_EXPORT.md` (Sections 1–18) tatsächlich nach `/mnt/documents/PROJECT_KNOWLEDGE_EXPORT.md` schreiben, damit du ihn herunterladen kannst.

Inhalt: Identity, Architektur, Scanner-Pipeline, Constraints, Sprint-Status, Memory-Map, Service-Struktur — wie bereits ausgearbeitet.

---

## Technische Details

- **Files modified**: `package.json`, `src/components/SocialProofSection.tsx`, `supabase/functions/ai-interpret/index.ts`
- **Files possibly deleted**: `src/components/forms/AuditFormStepper.tsx` (nur falls unbenutzt), `src/pages/AuditPage.tsx` / `AuditReportPage.tsx` (nur falls deprecated)
- **Edge functions deleted**: `generate-analysis-report` (Bestätigung)
- **Files created**: `/mnt/documents/PROJECT_KNOWLEDGE_EXPORT.md`
- **Memory updates**: `mem://strategy/source-of-truth-v1.2` — Sprint-0-Cleanup als abgeschlossen markieren

## Was NICHT in diesem Loop passiert

- Globaler UI/UX-Redesign (Phase 1 + 2) — separate Session
- Admin-Modell-Selector — erst wenn nötig
- Cross-Project User-Memory (`mem://~user`) — separate kleine Aufgabe

---

## Phase 3 — Hero Redesign (DONE)

- HomePage Hero komplett im Maximalist-Push-Stil neu gebaut:
  - Editorial-Headline mit `font-editorial` + `text-aurora` + Italic-Akzent
  - 3 layered Aurora-Orbs (primary, ai-accent, cyan) statt flachem Hintergrund
  - `noise-overlay` für Textur, `mix-blend-luminosity` auf Hero-Bild
  - Asymmetrisches 12-col Grid (7/5) statt symmetrischem 2-col
  - Rechts: gestaffelte Pillar-Karten mit `glass-panel` + Aurora-Gradient-Icons
- **No-fake-proof Fix**: erfundene Stats ("200+ AI Integrations", "3x Avg. ROI") entfernt, durch methodologie-basierte Pillars (AI-First, Messbar, Schnell, Menschlich) ersetzt.
