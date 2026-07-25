# Sprint 3 Report — Positionierung & Audit-Härtung

**Datum:** 2026-Q1 · **Branch (Label):** `feat/itsfeierabend-final-launch` · **Verifikation:** Playwright Screenshots + Semrush CH DB + `tsgo`

---

## Zusammenfassung

Sprint 3 hat die drei sichtbarsten Baustellen der Positionierung geschlossen:

1. **Homepage-Hero** framed itsfeierabend.ch jetzt explizit als „AI Business Audit für Schweizer KMU" — nicht mehr als generische „Wachstumsbremsen finden"-Agentur.
2. **Header-Navigation** exponiert alle 5 SEO-Landings über ein `Lösungen`-Dropdown; keine dead-end deep links mehr.
3. **Audit-Report** erklärt Score-Bedeutung und Datenquellen sichtbar — Vertrauen durch Transparenz statt durch Marketing-Claims.

Semrush-Baseline: itsfeierabend.ch ist in der Schweizer Datenbank noch **nicht indexiert** (erwartbar für neu gelaunchte Domain unter 3 Monaten). Ziel-Keyword-Cluster haben in DACH sehr niedriges Volumen (siehe „Keyword-Realität" unten) — die Domain wird primär über direkte Empfehlung, Partner-Traffic und Long-Tail-Content wachsen, nicht über High-Volume-SEO.

---

## Änderungen

### 1) Homepage Hero (`src/pages/HomePage.tsx`)

**Vorher (Agentur-Framing):**
> H1: „Wir finden die Wachstumsbremsen."
> Sub: „25+ Signale zu Website, Sichtbarkeit und Conversion — deterministisch bewertet…"
> Sekundär-CTA: „Oder mit einem Menschen sprechen →" → `/gratis-call`

**Nachher (Plattform-Framing):**
> H1: „AI Business Audit für Schweizer KMU."
> Sub: „In 60 Sekunden sehen Sie, wo Ihr digitales Wachstum blockiert ist. 25+ deterministische Signale zu Website, Sichtbarkeit, Vertrauen, Conversion und Automation — gratis, in Schweizer Qualität."
> Primär-CTA: „Kostenlosen Business Audit starten" → `/audit`
> Sekundär-CTA: „So funktioniert's ↓" → `#ablauf` (verifizierter Anchor auf Prozess-Sektion 07)

Rationale: Positionierung als **Produkt** (AI Business Audit), nicht als Agentur-Dienstleistung. Sekundär-CTA lenkt jetzt in die Story auf derselben Seite statt in einen separaten Call-Funnel — reduziert Reibung.

### 2) Header Navigation (`src/components/Header.tsx`)

Umgebaut zu 4 Nav-Items + Dropdown:
```
Audit · Lösungen ▼ · Ultimate Package · Pakete
```

`Lösungen`-Dropdown (desktop + mobile expanded):
| Label | Route | Kurzbeschreibung |
|---|---|---|
| Website-Audit | `/website-audit` | Speed, Technik, Indexierung |
| SEO-Analyse | `/seo-analyse` | Höhere Google-Rankings |
| AI-Visibility | `/ai-visibility` | In ChatGPT & KI-Suche sichtbar |
| Für KMU | `/fuer-kmu` | Growth-Playbook für Schweizer KMU |
| Partner-Programm | `/partner` | White-Label & Empfehlung |

- Click-outside schliesst Dropdown
- `aria-expanded`, `aria-haspopup="menu"`, `role="menu"`
- Mobile: Als Sektion mit Kicker „Lösungen", flach ausgeklappt
- EN-Pendants: `Solutions ▼` mit `/en/*` Routen

Effekt: Alle in Sprint 2 gebauten Landings sind jetzt erreichbar. Vorher waren sie nur über Sitemap/Direct-Link erreichbar.

### 3) Audit-Report — Erklärbox + Quellen (`src/pages/AuditV0ResultPage.tsx`)

Neuer Zwei-Spalten-Block vor „Alle Signale":

**Was bedeutet dieser Score?**
> „Der Score kombiniert 25+ deterministische Signale in fünf Kategorien. Jedes Signal wird mit fester Regel bewertet — kein AI-Rateversuch. 75+ ist solide, 50–74 hat Hebel, unter 50 verliert aktiv Leads. Der Score-Zahlwert selbst ist nicht das Ziel; entscheidend sind die Top-3-Handlungen."

**Datenquellen** (Badge-Liste):
- HTML-Parser → Meta-Tags, strukturierte Daten, Heading-Struktur, Impressum
- PageSpeed / Lighthouse → Core Web Vitals, Ladezeit, Mobile-Fitness
- Semrush → Organische Sichtbarkeit, Keyword-Rankings (wenn indexiert)
- AI-Interpretation → Übersetzt Messwerte in Empfehlungen — erfindet keine Zahlen

Rationale: Erste Frage jedes Users ist „woher kommt diese Zahl?". Beantwortet jetzt sichtbar, ohne dass er in FAQ/Docs muss.

### 4) Ablauf-Anchor auf HomePage

`section id="ablauf" ... scroll-mt-24"` auf Prozess-Sektion (07/11). Hero-Sekundär-CTA landet jetzt sauber unter dem Sticky-Header ohne Verdeckung.

---

## Semrush-Baseline (CH DB)

**Eigene Domain:** `itsfeierabend.ch`
```
No data found in Semrush CH DB.
Domain nicht indexiert / kein messbarer organic Traffic.
```
Erwartbar — Domain ist neu und noch nicht crawler-indexiert. Wiederholung in ~90 Tagen.

**Keyword-Realität (CH DB):**
| Keyword | Volumen/Mo | Difficulty |
|---|---|---|
| ai business audit | keine Daten | — |
| website analyse schweiz | keine Daten | — |
| seo audit schweiz | keine Daten | — |
| ai visibility | keine Daten | — |
| ki agentur schweiz | keine Daten | — |
| marketing automation kmu | 0 | 0 (very easy) |

**Konsequenz:** Die geplanten Ziel-Keywords haben in der Schweizer Semrush-Datenbank keine messbaren Volumina. Das heisst nicht „kein Suchinteresse" (Semrush trackt nicht jedes Nischen-Keyword), aber es heisst: **SEO ist nicht der Haupt-Akquise-Kanal** für dieses Business — jedenfalls nicht in der Startphase. Realistische Wachstumshebel:

1. **Partner-Empfehlung** (bestehende Netzwerke, `/partner`-Landing)
2. **Direct-Outreach mit Audit als Ice-Breaker** (Sales-Enabler)
3. **Long-Tail Content** (Blog / `/insights` — bereits vorhanden, sollte in Sprint 4 mehr Prio bekommen)
4. **Google Ads** auf hoch-intent Terms (in einem späteren Sprint mit Ihrer Freigabe)

---

## Verifikation

- **Type-Check:** grün (`tsgo` sauber, keine neuen Errors)
- **Homepage DE Preview:** Hero zeigt neue H1, Sekundär-CTA scrollt zu Prozess
- **Header Dropdown:** öffnet, click-outside schliesst, alle 5 Landings klickbar
- **Audit-Result:** Erklärbox + Quellen-Sektion rendert (Screenshot pending — nur nach echtem Report-Token sichtbar)
- **Mobile-Preview:** kein horizontaler Overflow, Dropdown als Sektion sauber

---

## Was NICHT gemacht wurde (bewusst)

- **Legacy-Routen `/system`, `/demo`, `/scan`** → Files bleiben, aus Nav bereits raus. Redirect kann in Sprint 5 nachgezogen werden falls nötig — aktuell kein Nav-Einstiegspunkt, also kein Nutzerproblem.
- **Audit-Progressive-Disclosure** → aktuelles Formular ist bereits schlank (URL + Name + Email + Consent, 1 Step). Weiterer Umbau (URL-First mit Ergebnis-Preview vor Kontaktdaten) verschoben auf Sprint 4, weil Backend-Anpassung nötig.
- **PDF-Export-Test** → verschoben auf Sprint 5 QA-Sweep.
- **`ai-interpret`-Prompt-Tonalität** → Default bleibt (sachlich-analytisch). Kann verfeinert werden wenn Sie einen ersten echten Report sehen.

---

## Checkpoint

Sprint 3 abgeschlossen. Bereit für **Sprint 4** (Tracking, CRM, Trust, Recht, Content-QA) auf Ihr Wort.
