# itsfeierabend.ch — Abschlussbericht zum Launch-Kandidaten

**Stand:** 25. Juli 2026  
**Projekt:** ausschliesslich `itsfeierabend.ch`  
**Primärdomain:** `https://itsfeierabend.ch`  
**Repository:** `mfeie002-jpg/itsfeierabend.ch`  
**Status:** Code-Kandidat umgesetzt und als Draft-PR bereit; **Production NO-GO**

Dieser Bericht trennt belegte Implementierung, lokale Verifikation und noch ausstehende Laufzeitabnahmen. Er enthält keine erfundenen Preise, Marktvolumen, Rankings, Kundenergebnisse oder Produktionsfreigaben.

## 1. Executive Summary

itsfeierabend.ch wurde auf dem bestehenden React-/Vite-/TypeScript-/Supabase-Stack als eigenständige Schweizer B2B-Plattform für nachvollziehbare digitale Geschäftsaudits neu fokussiert. Der Launch-Kandidat umfasst eine neue DE-/EN-Informationsarchitektur, eine verkaufsfähige Startseite, thematische Audit-Seiten, einen progressiven dreistufigen Quick Audit, eine getrennte CRM-/Lead-Architektur, Consent-abhängiges Tracking, statische SEO-Einstiegspunkte und eine automatisierte Responsive-/Accessibility-Testmatrix.

Der Code liegt auf `feat/itsfeierabend-final-launch` und ist im offenen Draft-[PR #1](https://github.com/mfeie002-jpg/itsfeierabend.ch/pull/1) enthalten. Der kombinierte Launch-Code wurde als [`327a319396a07108606f4cef2f567317c2620fe4`](https://github.com/mfeie002-jpg/itsfeierabend.ch/commit/327a319396a07108606f4cef2f567317c2620fe4) veröffentlicht; der vollständig geprüfte Code-/Test-Stand ist [`129bac16494e9aa14590bfec769410aa58b9fe67`](https://github.com/mfeie002-jpg/itsfeierabend.ch/commit/129bac16494e9aa14590bfec769410aa58b9fe67). Der nachfolgende Bericht-/Beweis-Stand [`f95bf482bf433499719a72329bfaf8bfabbe465c`](https://github.com/mfeie002-jpg/itsfeierabend.ch/commit/f95bf482bf433499719a72329bfaf8bfabbe465c) war vor dieser Dokumentationsaktualisierung ebenfalls vollständig grün.

| Prüfpunkt | Status | Beleg / Einschränkung |
|---|---|---|
| Positionierung, Inhalte und Architektur | umgesetzt | fokussierte DE-/EN-Routen, keine Räumungs-, Reinigungs- oder Umzugsangebote |
| Lokaler Typecheck, Lint und Production Build | bestanden | `npm run typecheck`, `npm run lint -- --quiet`, `npm run build` |
| Statische öffentliche URLs | bestanden | 26/26 Sitemap-Routen sowie `robots.txt`, Sitemap und OG-Asset lokal mit HTTP 200 |
| Draft-PR | vorhanden | PR #1; geprüfte Bericht-/Beweis-Baseline mit 10 Commits und 151 geänderten Dateien |
| GitHub CI | **bestanden** | Code-/Test-Stand Run #31: 129/129 Tests in 1.3 Minuten; Bericht-/Beweis-Baseline Run #35: 129/129 in 1.2 Minuten |
| Lovable-Preview | **blockiert** | API-Antwort `FORBIDDEN`; kein verifizierter Release-Preview |
| Produktionsdeployment | **bewusst nicht ausgeführt** | kein sicher abgenommener Preview, Rollback und Runtime-Setup |
| Vollständiger Audit-zu-CRM-zu-E-Mail-Test | offen | keine echten Leads oder E-Mails erzeugt |
| Recht / Datenschutz | blockiert | Rechtsträger, Anschrift, Verantwortliche, Anbieter-/Regionen-/Löschinventar fehlen |
| Production Readiness | **NO-GO** | Turnstile, Resend, GA4, Runtime-Migrationen und DNS-Rebinding-Schutz nicht verifiziert |

## 2. Ursprünglicher Zustand

Die Baseline wurde am 25. Juli 2026 gegen die öffentlich erreichbare Live-Site vor Deployment des Launch-Branches erhoben.

| Bereich | Aktueller Zustand der Live-Baseline | Problem | Auswirkung | Umgesetzte oder erforderliche Massnahme |
|---|---|---|---|---|
| Erreichbarkeit | Apex und `www` lieferten HTTP 200 ohne Redirect; `www` setzte den Canonical auf `https://itsfeierabend.ch/` | `www` leitete nicht auf die bevorzugte non-`www`-Domain um | zwei öffentlich erreichbare Hosts trotz korrektem Canonical | Hosting-Redirect im Kandidaten vorbereitet; nach Deployment real verifizieren |
| HTTPS | HTTP leitete je Host auf HTTPS; TLS-Prüfung erfolgreich; HSTS vorhanden | Host-Kanonisierung blieb offen | Duplicate-Host-Risiko | `https://itsfeierabend.ch` als Canonical festgelegt |
| 404 | unbekannte URL lieferte HTTP 200 und erst clientseitig eine `noindex`-404 | Soft-404 | Crawling- und Qualitätsproblem | statische `404.html` und Hosting-Regel `/* /404.html 404` erstellt |
| Robots/Sitemap | `robots.txt` und `sitemap.xml` lieferten HTTP 200 | der Inhalt gehörte noch zur alten Architektur | unnötige oder inkonsistente Indexsignale | beide Dateien auf die fokussierte Route-Map umgestellt |
| Metadaten | Roh-HTML mehrerer Routen enthielt denselben generischen Title, Description und Homepage-Canonical | route-spezifische Daten erst nach JavaScript | schwache Crawler- und Social-Preview-Basis | route-spezifische statische Einstiegspunkte generiert |
| Sprache | EN-Routen konnten `html lang="de"` behalten; Sprache hing teilweise vom vorherigen Zustand ab | URL und Sprache nicht deterministisch | SEO- und Accessibility-Fehler | DE-/EN-Routenpaare und URL-basierte Sprachlogik umgesetzt |
| Audit | ein langes Formular; Turnstile meldete einen Site-Key-Konfigurationsfehler | Reibung und potenziell blockierte Submission | Leadverlust | dreistufiger Audit und korrekt typisierte Site-Key-Einbindung implementiert; Production-Secrets offen |
| Tracking | in einer frischen Live-Session waren weder `dataLayer`, `gtag`, GA4/GTM-Script noch Consent-UI sichtbar | Conversions und Attribution nicht belastbar | keine verwertbare Funnel-Baseline | Consent-/GA4-/Eventmodell implementiert; Measurement ID und DebugView offen |
| Performance | Haupt-JS 1’689’293 Byte unkomprimiert / 479’781 Byte gzip; CSS 114’757 Byte / 18’835 Byte gzip | grosser monolithischer Einstieg | langsamere Interaktion, besonders mobil | Route-Lazy-Loading, manuelle Vendor-Chunks und Font-Bereinigung |
| Mobile/A11y | 20 Routen bei festem 1363 × 936 Viewport ohne horizontalen Overflow; mehrere Ziele kleiner als 44–48 px | geforderte Viewport-Matrix war nicht abgenommen | Mobile- und Accessibility-Risiko | Controls, 320-px-Header und Heading-Hierarchie korrigiert; CI-Matrix mit 129/129 Tests bestanden, reale Preview-QA bleibt offen |
| Markt-/SEO-Daten | Semrush verbunden, aber Berichtsermittlung wegen ungenügender API Units abgebrochen | Volumen, KD, CPC, Rankings und Authority nicht verfügbar | keine belastbare Paid- oder Nachfragequantifizierung | qualitative SERP-Analyse dokumentiert; Zahlen bewusst nicht erfunden |
| Recht | kein verifizierter Rechtsträger, keine Anschrift oder verantwortliche Person | Pflichtangaben unvollständig | Produktionsblocker | Legal-Seiten zeigen den Arbeitsstand transparent; Fakten müssen freigegeben werden |

Die bestehende Live-Produktion wurde in diesem Arbeitsgang nicht überschrieben.

## 3. Positionierung

**Verbindliche Kurzpositionierung:**

> itsfeierabend.ch analysiert die digitale Geschäftslage eines Schweizer Unternehmens, trennt Messwerte von Angaben und Annahmen und priorisiert Massnahmen für Sichtbarkeit, Leads, Conversion, AI Search Visibility, Vertrauen, Tracking, CRM, Automatisierung und Wachstumspotenzial.

Die Abgrenzung wurde in Copy, Navigation, Seitenarchitektur und FAQ verankert:

- Diagnose und Priorisierung statt generischer Full-Service-Agentur.
- Regelbasierter Quick Audit statt Fake-AI-Score.
- AI dient der Einordnung; sie erfindet oder verändert keine Messwerte.
- Keine Garantie für Rankings, Leads, Umsatz oder Nennungen in ChatGPT beziehungsweise anderen Answer Engines.
- Keine Räumungs-, Reinigungs- oder Umzugsleistung.
- feierabendservices.ch und umzugscheck.ch werden weder als Angebote noch als Datenquelle oder ungeprüfter Proof verwendet.

Der primäre CTA lautet **„Kostenlosen Business Audit starten“**. Vertiefte Leistungen verwenden scope-basierte CTAs wie „Analyse anfragen“ und „Offerte erhalten“; konkrete Preise wurden nicht veröffentlicht.

## 4. Zielgruppen

| Priorität | Zielgruppe | Qualifizierende Merkmale | Einstieg |
|---|---|---|---|
| Primär | inhabergeführte Schweizer Dienstleistungs- und B2B-KMU | bestehende Website, wertvolle Leads, unklare Engpässe, schwache Messung oder Nachbearbeitung | `/`, `/fuer-kmu`, `/ai-business-audit` |
| Primär | lokale Unternehmen mit erklärungsbedürftiger Leistung | Sichtbarkeit, Vertrauen und Anfrageprozess sind geschäftsrelevant | `/website-audit`, `/seo-analyse`, `/automation` |
| Sekundär | Immobilien-, Renovations-, Sanierungs-, Beratungs- und Praxisbetriebe | lokale oder komplexe Nachfrage; Reputation und Datenschutz sind relevant | `/fuer-kmu` und passende Leistungsseite |
| Sekundär | KMU mit bestehendem SEO-, Ads- oder CRM-Einsatz | Aktivitäten vorhanden, aber Quelle, Leadstatus und Ergebnis nicht sauber verbunden | `/seo-analyse`, `/automation` |
| Partner | Agenturen, Berater, IT-Dienstleister, Branchenplattformen | unabhängige Diagnose, Referral oder Co-Delivery | `/partner` |
| Später | Gastronomie, Kleinstbetriebe, E-Commerce, grössere Unternehmen, White Label | erst nach validiertem Low-Touch-Modell beziehungsweise reiferer Security und Methodik | keine eigene Launch-Landingpage |

Nicht priorisiert werden Projekte ohne funktionierendes Angebot oder verwertbare Ausgangsdaten, generische „AI Transformation“ ohne Prozess sowie Unternehmen, die garantierte Google-, ChatGPT- oder Umsatzresultate erwarten.

## 5. Geschäftsmodell

Die implementierte Angebotsleiter vermeidet ungeprüfte Preise und unbegrenzte Leistungsversprechen.

| Stufe | Angebot | Ergebnis | CTA |
|---|---|---|---|
| 1 | kostenloser Quick Audit | vorläufiger Befund, Reifegrad, Evidenzabdeckung und priorisierte Massnahmen | Audit starten |
| 2 | vertiefter Business-, Website-, SEO- oder AI-Visibility-Audit | verifizierter Kontext, freigegebene Daten und Massnahmenplan | Analyse anfragen |
| 3 | Growth Sprint / Implementierungsprojekt | klar abgegrenzte Umsetzung mit Deliverables und Abnahmekriterien | Offerte erhalten |
| 4 | laufende Optimierung | SEO, AI Visibility, Conversion, Analytics und Reporting nach vereinbartem Umfang | Betreuung anfragen |
| 5 | Partner-/Referral-Modell; White Label später | qualifizierte Übergabe oder Co-Delivery; Produktisierung nach Pilot | Partnergespräch anfragen |

Preis, Dauer, Deliverables und Abnahmekriterien werden erst nach Scope-Klärung verbindlich. Wettbewerberpreise aus der Marktanalyse wurden ausdrücklich nicht als itsfeierabend-Preise übernommen.

## 6. Finale Informationsarchitektur

Die Architektur besitzt einen fokussierten kommerziellen Kern und vollständige DE-/EN-Paare.

| Deutsch | Englisch | Hauptintent |
|---|---|---|
| `/` | `/en` | Positionierung und Orientierung |
| `/ai-business-audit` | `/en/ai-business-audit` | bereichsübergreifende digitale Standortbestimmung |
| `/website-audit` | `/en/website-audit` | Technik, UX, Vertrauen und Conversion-Hürden |
| `/seo-analyse` | `/en/seo-analysis` | SEO, Indexierung, Local SEO und Content-Lücken |
| `/ai-visibility` | `/en/ai-visibility` | Entity-Klarheit, Zitierfähigkeit und AI-Search-Grundlagen |
| `/automation` | `/en/automation` | CRM-, Funnel- und Workflow-Potenzial |
| `/leistungen` | `/en/services` | Angebotsleiter und Umsetzung |
| `/fuer-kmu` | `/en/for-smes` | Zielgruppen-Fit |
| `/partner` | `/en/partners` | Referral und Co-Delivery |
| `/fallstudien` | `/en/case-studies` | überprüfbare Methodik und Projektkontexte |
| `/insights` | `/en/insights` | Fachwissen und Begriffe |
| `/ueber-uns` | `/en/about` | Entity, Methodik und Verantwortung |
| `/kontakt` | `/en/contact` | Analyse-, Sprint- oder Beratungsanfrage |
| `/audit` | `/en/audit` | transaktionaler Quick Audit, `noindex` |
| `/impressum` | `/en/imprint` | Legal-Arbeitsstand, `noindex` |
| `/datenschutz` | `/en/privacy` | Datenschutz-Arbeitsstand, `noindex` |

Bewusste Konsolidierungen:

- `/business-health-check` wurde nicht als dünnes Synonym gestartet.
- `/preise` leitet auf `/leistungen`, solange keine Preise freigegeben sind.
- Legacy-Paket-, Scanner-, Blog- und Agentur-Service-URLs besitzen dokumentierte 301-Ziele.
- Private Report- und Admin-Routen sind aus Sitemap und Index ausgeschlossen.

## 7. Keyword Map

Semrush-Volumen, KD, CPC, Rankings, Backlinks und Authority Score sind **nicht verfügbar**, nicht null. Die Semrush-Verbindung war aktiv, die Berichtsermittlung wurde jedoch wegen ungenügender API Units vor `get_report_schema` und `execute_report` gestoppt.

| Cluster | Primärer Intent | Hauptseite | Sekundäre Keywords / Themen | CTA |
|---|---|---|---|---|
| digitale Geschäftsdiagnose | gemischt bis kommerziell | `/ai-business-audit` | Online-Marketing-Audit, Digitalisierungscheck KMU, digitaler Wachstumscheck | Kostenlosen Business Audit starten |
| Website-Diagnose | kommerzielle Prüfung / Free-Tool | `/website-audit` | Website Analyse Schweiz, Website Check Unternehmen, Website Optimierung KMU | Website prüfen lassen |
| SEO-Diagnose | starke kommerzielle Prüfung | `/seo-analyse` | SEO Audit Schweiz, SEO Analyse Schweiz, technisches SEO, Local SEO | SEO-Analyse anfragen |
| AI Visibility | informativ und kommerziell | `/ai-visibility` | AI Search Visibility, ChatGPT SEO, GEO, LLMO, Entity-Klarheit | AI-Sichtbarkeit prüfen |
| CRM und Automation | Software-/Implementierungsintent | `/automation` | CRM Automation Schweiz, Marketing Automation KMU, Lead Routing, Follow-up | Automations-Potenzial prüfen |
| Lead und Conversion | kommerziell; Proof nötig | `/leistungen` | Lead-Generierung KMU, Conversion Optimierung Schweiz, Tracking Audit | Lead-Potenzial analysieren |
| KMU-Fit | kommerzieller Audience-Qualifier | `/fuer-kmu` | Website Optimierung KMU, Online-Marketing-Beratung KMU | Audit für mein KMU starten |
| lokale Sichtbarkeit | überwiegend informativ | `/insights` | Google Sichtbarkeit, Google Unternehmensprofil, NAP, Bewertungen | Sichtbarkeit analysieren |

Kannibalisierung wird verhindert, indem Website, SEO, AI Visibility und Automation jeweils eine eindeutige Seite besitzen; generische Verbesserungsfragen gehören in `/insights`.

## 8. Wettbewerbsanalyse

Die öffentliche SERP-Stichprobe vom 25. Juli 2026 zeigt einen vorhandenen, aber stark besetzten Schweizer Markt. Die Ergebnisse sind qualitative Evidenz, kein ortsfestes Rank Tracking.

| Wettbewerber | Sichtbarer Funnel | Konsequenz für itsfeierabend.ch |
|---|---|---|
| [webscore.ch](https://webscore.ch/) | kostenloser Website-Check, erweiterter Bericht | nicht als weiterer generischer Scanner auftreten |
| [zottermedia](https://www.zottermedia.ch/website-check) | Live-Check plus detaillierter Human-Audit | automatisiert, manuell und Ergebnisumfang klar trennen |
| [MIK Group](https://www.mikgroup.ch/seo-analyse/) | URL + E-Mail, SEO-Bericht | früh sichtbaren Wert liefern und Reibung reduzieren |
| [SEOX](https://seox.ch/) | SEO/GEO/Local/Automation mit starkem CTA | über Methodik und bereichsübergreifende Priorisierung differenzieren |
| [JvM GEO](https://www.jvm.ch/de/leistungen-themen/leistungen/geo-generative-engine-optimization) | Enterprise-GEO und Messung | AI Visibility sachlich erklären, SEO-Basis und Grenzen zeigen |
| [TH Analytica](https://th-analytica.com/ai-visibility) | Readiness-Framework und Quick Check | statisch lesbare Definitionen und No-Guarantee-Position stärken |
| [AIMACO](https://aimaco.ai/) | Monitoring-Software und GEO-Check | kein Echtzeit-SaaS suggerieren, solange es nicht betrieben wird |
| [Cloudweb](https://www.cloudweb.ch/conversion-optimierung/) | Conversion mit Tracking als Voraussetzung | Tracking-Qualität vor CRO-Versprechen prüfen |
| [Rocket9](https://rocket9.ch/services/business-automation/) | konkrete Workflow-Automation | reale Prozessbeispiele statt AI-Buzzwords |

Die belegte Marktlücke ist kein einzelner Scanner, sondern eine transparente, funktionsübergreifende Diagnose, die Messung, Selbstangabe, Schätzung und Expertenprüfung trennt und Massnahmen nach Geschäftswirkung und Abhängigkeit priorisiert.

Paid Search bleibt nicht freigegeben. Ein Test setzt verifizierte Schweizer Volumen-/CPC-Daten, live abgenommene Zielseiten, deduplizierte Conversions, CRM-Leadqualität und ausdrückliche Kampagnenfreigabe voraus.

## 9. Implementierte Seiten

Im Branch umgesetzt beziehungsweise konsolidiert:

- neue Startseite mit Hero, einem dominanten Audit-CTA, sekundärem Methodik-CTA, Audit-Landkarte, Methodik, Angebotsleiter, Trust-Grenzen, FAQ und Abschluss-CTA;
- fokussierte Plattformseiten für Business Audit, Website Audit, SEO-Analyse, AI Visibility, Automation, Leistungen, KMU, Partner, Insights, Über uns und Kontakt;
- DE-/EN-Ausgaben aller zentralen Seiten;
- transaktionaler Audit und private Ergebnisansicht;
- Kontakt- und Partnerformular über die gemeinsame serverseitige Lead-Strecke;
- Fallstudienseite ohne ungeprüfte verbundene Kundenclaims; öffentlich gezeigt wird nur der eigene Quick-Audit-Produktkontext;
- Impressum und Datenschutz als transparent markierter Arbeitsstand, nicht als vorgetäuschte Rechtsabnahme;
- echte 301-Zuordnungen für alte Scanner-, Preis-, Paket-, Blog- und Agentur-Service-Routen;
- statische 404-Seite sowie private Admin-/Report-Routen mit `noindex`.

Öffentliche feierabendservices.ch- oder umzugscheck.ch-Cases wurden entfernt, bis Beziehung, Ausgangslage, Messfenster, Resultat und Publikationsfreigabe überprüft sind.

## 10. Implementierter AI Business Audit

Der Quick Audit ist ein progressiver dreistufiger Funnel:

1. Website-URL und Firma;
2. Branche, Region, Geschäftsziel, Leadquelle, Herausforderungen und Systeme;
3. Kontakt, notwendiger Processing-Consent, separater optionaler Marketing-Consent und Turnstile.

Wesentliche technische und methodische Eigenschaften:

- serverseitige URL-Normalisierung und Validierung;
- keine IP-Literale, lokalen oder privaten Ziele;
- deterministisches Scoring, Version `v1.0`;
- Gewichte: technische Basis 15, Content/Suchintention 25, Vertrauen 20, Conversion/UX 25, Automation/Datenreife 15;
- Evidenzzustände `measured`, `user_provided`, `inferred`, `estimated`, `expert_reviewed`, `unavailable`;
- fehlende Signale werden nicht als erfundene Null oder neutraler Mittelwert verrechnet;
- Semrush-Daten werden nur bei real verfügbarer Quelle verwendet;
- Score, Kategorien, Stärken/Risiken und drei bis fünf priorisierte Massnahmen;
- private Ergebnis-URL mit frischem Token je Audit;
- Resultatstatus `ready`, `partial` oder `unavailable` bleibt sichtbar;
- Report-Abfrage ist POST-only, Token bleibt aus Analytics-URL und Eventpayloads entfernt.
- synchrone Doppelklick-Sperren verhindern parallele Audit-, Kontakt- und Partner-Submits im Client.

Die Playwright-Flows für DE und EN mocken die Serverantwort und prüfen Schritte, Attribution, genau einen Request bei Doppelklick, serverbestätigte Erstellung und private Resultatroute. Separate Kontakt- und Partnerflows prüfen ebenfalls Attribution, Payload und genau einen Client-Request. Dies ist kein Beleg für eine reale Production-Speicherung, serverseitige Idempotenz oder E-Mail-Zustellung.

## 11. CRO- und Funnel-Struktur

| Funnel | Einstieg | Zielseite | Conversion | Nächster Schritt |
|---|---|---|---|---|
| A · Organische Suche | thematische Suchanfrage | `/website-audit`, `/seo-analyse`, `/ai-visibility` | Quick Audit oder Analyseanfrage | Resultat, Qualifizierung, vertiefter Audit |
| B · B2B-Outreach | personalisierter itsfeierabend-Link | passende Diagnose-Seite oder `/audit` mit Attribution | Audit oder Gespräch | Kontextprüfung, Audit oder Sprint |
| C · Partner | Empfehlung / Netzwerk | `/partner` | gespeicherte Partneranfrage | Fit, Pilot, Referral oder Co-Delivery |
| D · Retargeting / Paid | intent-spezifische Anzeige | nur passende Audit-/Leistungsseite | Audit oder Beratung | CRM-Follow-up |

CRO-Entscheidungen:

- ein dominanter Haupt-CTA pro Kontext;
- kurze Distanz vom Leistungsproblem zum Audit oder Formular;
- formulareigene Start-, Submit- und Success-Events;
- `submit` und `success` sind getrennte Zustände;
- ein direkter Aufruf oder Reload einer Ergebnis-URL löst keine Conversion aus;
- UTM, Landingpage und Referrer werden in den Lead übernommen;
- keine drei gleich starken Hero-CTAs und keine erfundenen Proof-Zahlen.

## 12. Designsystem

Das konsolidierte System heisst intern **Obsidian Instrument**:

- tiefes Navy-/Obsidian-Fundament (`#05070a`) und Graphitflächen;
- Chrom-/Eisfarben für Text, Signal und Fokus;
- dezente Gradient-, Raster- und Instrumenten-Elemente statt Roboter- oder Gehirn-Stockbilder;
- 1320-px-Container, 12-Spalten-Seitenraster und grosszügige Abschnittsabstände;
- wiederverwendbare Tokens für Farben, Radius, Schatten, Border und Spacing;
- systemeigene Sans-/Mono-Fontstacks; keine Google-Font-Anfrage;
- Scorecards, Audit-Landkarte und Evidenzlabels als Produktvisualisierung;
- 44- beziehungsweise 48-px-Mindesthöhen für zentrale Navigation, CTAs und Form-Controls;
- sichtbare Focus-Ringe und Reduced-Motion-Regeln.

Das System übernimmt keine gelben Feierabend-Services-Farben, fremden Kundenlogos, Fake-Testimonials oder Comic-/Sci-Fi-Illustrationen.

## 13. Mobile-QA

Implementiert ist eine Playwright-Matrix für `320`, `375`, `390`, `430`, `768`, `1024` und `1440` px. Sie deckt acht kritische Routen ab:

`/`, `/ai-business-audit`, `/audit`, `/partner`, `/kontakt`, `/en`, `/en/audit`, `/en/contact`.

Die Tests prüfen:

- horizontalen Overflow und auslösende Elemente;
- Mobile-Menü öffnen/schliessen;
- Audit bis zum Kontaktschritt;
- genau ein sichtbares `main` und `h1`;
- erreichbare Namen für Links, Buttons und Controls;
- Formularlabels, Headings, Alttexte, Iframe-Titel, doppelte IDs und positive `tabindex`;
- Console- und Runtime-Fehler.

**Automatisierter Abnahmestatus:** GitHub CI [Run #31](https://github.com/mfeie002-jpg/itsfeierabend.ch/actions/runs/30146078734) bestand vollständig. Chromium führte 129/129 E2E-Tests in sechs Spec-Dateien in 1.3 Minuten erfolgreich aus. Die Remediation-Commits schlossen responsive und semantische Testlücken (`c80128c`), den Header-Overflow bei 320 px (`cd449a1`), einen semantisch korrekten mobilen Heading-Zeilenumbruch (`3fd401d`) sowie Hosting- und Doppelsubmit-Contracts (`d208dd4`, `129bac1`).

Damit ist die automatisierte Viewport-Matrix auf dem CI-Produktionsbuild bestanden. Nicht abgenommen sind weiterhin das reale Lovable-/Production-Hosting, gerätespezifische Browserbesonderheiten, Network-Verhalten und echte Backend-Submissions.

## 14. Desktop-QA

Belegte lokale und CI-Prüfungen:

- TypeScript, ESLint und Production Build bestanden;
- GitHub CI Run #31: Quality/Deno und Production Build `success`;
- Chromium E2E: 129/129 Tests in 1.3 Minuten `passed`;
- 26/26 Sitemap-Routen plus `robots.txt`, Sitemap und OG-Asset im lokalen statischen Build mit HTTP 200;
- Build erzeugte route-spezifische HTML-Einstiegspunkte;
- `git diff --check` ohne Whitespace-Fehler;
- keine Build-Warnung für einen Chunk über 500 kB.

Die Baseline-Live-Site zeigte bei 1363 × 936 auf 20 verlinkten Routen keinen horizontalen Dokument-Overflow. Der Kandidat bestand die automatisierte Desktop-Matrix bei 1024 und 1440 px im CI-Produktionsbuild. Wegen des blockierten Lovable-Previews fehlen weiterhin die reale Host-/Network-Abnahme, Redirectprüfung und echte Form-Submission.

## 15. SEO-Änderungen

Umgesetzt:

- eindeutige Title, Meta Description, H1 und Canonical pro Route;
- DE-/EN-Route-Paare mit `de-CH`, `en` und `x-default`-Alternates;
- 26 kanonische indexierbare URLs in der Sitemap;
- Audit-, Legal-, Admin- und private Tokenrouten aus der Sitemap ausgeschlossen beziehungsweise `noindex`;
- `robots.txt` mit Sperren für Admin, private Reports, Legacy-Analyse und technische Routen;
- statische route-spezifische HTML-Dateien und slashlose Aliase;
- statische 404 plus Hosting-Regel für echten HTTP-404;
- 301-Regeln für Legacy-Routen und `www` → non-`www`;
- Open Graph und Twitter-Metadaten mit eigenem Audit-Asset;
- Organization-, WebSite-, Service-, Breadcrumb- und sichtbares FAQ-Schema nur im sachlich passenden Kontext;
- Security- und Cache-Header in `public/_headers`;
- interne Verlinkung entlang Audit, Fachseite, Leistungen, Methodik und Kontakt.

Im lokalen und CI-Produktionsbuild verifiziert:

- erfolgreicher statischer Production Build;
- route-spezifische HTML-Einstiegspunkte;
- 26/26 Sitemap-Routen sowie `robots.txt`, Sitemap und OG-Asset im lokalen HTTP-Smoke-Test;
- Metadaten-, Sprach-, Canonical-, `hreflang`-, `noindex`- und 404-Verträge in der grünen Chromium-E2E-Suite.

Auf dem realen Zielhost noch zu verifizieren:

- ob der Zielhost `_redirects` und `_headers` wie vorgesehen ausführt;
- reale `www`-Weiterleitung, Canonicals und 404 nach Deployment;
- strukturierte Daten gegen die ausgerollte HTML-Version;
- Search Console, Indexierung und Core Web Vitals.

## 16. AI-Visibility-Änderungen

Die Website definiert die Entity konsistent als Schweizer Plattform für digitale Geschäftsaudits. Ergänzt wurden:

- klare Leistungs- und Zielgruppendefinitionen;
- sichtbare Audit-, Score- und Evidenzmethodik;
- strukturierte Antworten und sichtbare FAQs;
- AI-Visibility-Begriffe wie GEO, LLMO, Entity-Klarheit, Zitierfähigkeit und Crawler-Zugänglichkeit in einem abgegrenzten Kontext;
- eindeutige Aussage, dass Nennungen und Rankings in ChatGPT, Google AI Overviews oder anderen Antwortsystemen nicht garantiert werden;
- Quellen- und Vertrauenslogik ohne erfundene Autoritätssignale;
- About-, Kontakt-, Datenschutz- und Impressumsrouten für Entity-Kohärenz.

Autoren-/Expertenprofile, verifizierte juristische Identität, unabhängige Erwähnungen und freigegebene Case-Evidenz fehlen noch und begrenzen die externe Entity-Bestätigung.

## 17. Tracking-Events

Die kanonische Taxonomie ist im Code und im KPI-Framework vorbereitet:

| Event | Auslöser |
|---|---|
| `audit_start` | erste inhaltliche Audit-Interaktion |
| `audit_step_complete` | valider Schritt abgeschlossen |
| `audit_submit` | Audit serverseitig erstellt |
| `audit_result_view` | gültiger Report mit `ready` oder `partial` geladen |
| `lead_form_start` | erste Interaktion mit Kontaktformular |
| `lead_form_submit` | valider Sendeversuch |
| `lead_form_success` | Server bestätigt Speicherung |
| `consultation_cta_click` | Beratungs-/Kontakt-CTA |
| `pricing_cta_click` | Offerten-/Angebotsleiter-CTA |
| `contact_click` | direkte Kontaktoption |
| `email_click` | `mailto:` |
| `phone_click` | `tel:` |
| `partner_application_start` | erste Partnerformular-Interaktion |
| `partner_application_submit` | Partnerlead serverseitig gespeichert |
| `case_study_view` | definierter Case-Kontext geöffnet |
| `scroll_depth` | 25, 50, 75 oder 90 Prozent |
| `outbound_click` | externe Domain aktiviert |

`page_view` ist ein consent-basierter Basis-Event, keine Conversion.

Vorgesehene Parameter sind unter anderem `page_type`, `audit_type`, `industry`, `lead_score`, `result_status`, `traffic_source`, `campaign`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `cta_location` und `form_name`.

Kontaktdaten, Firmenname, Freitext, vollständige Lead-Website, Reporttoken, IP, API-Schlüssel und direkte CRM-UUIDs sind in Analytics verboten. Tokenpfade werden zu `:token` normalisiert. GA4 initialisiert erst nach Analytics-Consent; ohne `VITE_GA4_MEASUREMENT_ID` bleibt es deaktiviert. Production-ID, Consent Mode und DebugView sind noch nicht abgenommen.

## 18. CRM- und Lead-Flow

Im Branch und in den Migrationen vorbereitet:

- getrennte kanonische Tabellen `leads`, `audit_requests`, `audit_events` und `rate_limits`;
- atomare RPC `public.create_audit_with_lead`;
- Audit- und Lead-Erstellung, Rate-Limit-Reservierung und Event in einer Transaktion;
- Deduplizierung nach E-Mail plus Website innerhalb von 30 Tagen;
- trotzdem frischer privater Reporttoken pro angenommenem Audit;
- First-/Last-Touch-Felder, Landingpage, Referrer, UTM-Parameter, Leadtyp, Audittyp, Branche, Region, Ziel, Consent, Status und Zeitstempel;
- Default-Limits von 5 Audits je IP/24 Stunden und 200 frischen Audits gesamt/Tag;
- Turnstile-Verifikation serverseitig und Fail-Closed-Verhalten;
- Kontakt- und Partneranfragen über eine serverseitige Lead-Funktion;
- Resend-Übergabe mit getrennten Zuständen `email_sent`, `email_failed` und `email_skipped`;
- Slack-Benachrichtigung ohne PII oder persistente Lead-UUID; Link nur auf die generische Adminliste;
- Admin-Dashboard und Reports lesen die kanonischen Audit-/Leadquellen statt Demo-Umsatzwerten.

Produktionsstatus:

- Migration `20260725050000_final_launch_lead_security.sql` muss vor `20260725060000_atomic_audit_create.sql` angewendet werden;
- Edge Functions dürfen erst danach deployt werden;
- Supabase-Runtime, RLS, echte Speicherung, Deduplizierung und Benachrichtigung sind nicht verifiziert;
- es wurde bewusst kein echter Lead gespeichert und keine E-Mail an einen realen Kontakt gesendet;
- für E-Mail-Fehler fehlt weiterhin eine dauerhafte Retry-Queue.

## 19. Datenschutz- und Sicherheitsprüfung

**Umgesetzt beziehungsweise gehärtet:**

- notwendiger Processing-Consent und separater optionaler Marketing-Consent;
- Consent-Version wird serverseitig autoritativ gesetzt;
- optionale Analytics-/Marketing-Speicherung erst nach Auswahl;
- UTM-Daten vor Consent nur in der Session, 30-Tage-Persistenz erst nach passendem Consent;
- POST-only-Reportabruf mit Body-Limit und `no-store`;
- Request-Grössenlimits für öffentliche Endpoints;
- Service-to-Service-Autorisierung für interne Writer/Reader;
- Turnstile Fail-Closed, Rate Limits, URL-/Schema-/IP-Prüfung und Deduplizierung;
- CSP, `X-Frame-Options: DENY`, `nosniff`, Permissions Policy und strikte Referrer Policy;
- keine Secrets, PII oder Token in Analytics;
- keine Fake-Rechtsangaben.

**Blocker:**

1. juristische Firmierung, Rechtsform, Postanschrift, UID/Handelsregisterangabe und verantwortliche Person fehlen;
2. aktive Produktionsanbieter, Zwecke, Verarbeitungsregionen, Auftragsbearbeitungsverträge und Transfergarantien sind nicht vollständig verifiziert;
3. Aufbewahrungs- und Löschkonzept ist nicht freigegeben;
4. `TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY`, `RESEND_API_KEY`, `REPORT_EMAIL_FROM` und GA4-Konfiguration sind nicht laufzeitgeprüft;
5. RLS-Policies und Production-Schema sind nur als Code/Migration, nicht in der Zielumgebung bestätigt;
6. Website-Fetching prüft private Ziele und Redirects, aber ein DNS-Rebinding zwischen Prüfung und nativem Fetch bleibt möglich. Vor Production ist ein IP-gepinnter Egress-Proxy oder eine Plattform-Netzwerkregel nötig;
7. `npm audit --omit=dev` meldet zwei moderate React-Router-Advisories; für die installierte Linie ist derzeit kein Fix verfügbar.

Die Legal-Seiten sind ein transparenter Arbeitsstand und keine Rechtsberatung oder endgültige Compliance-Bestätigung.

## 20. Performance-Ergebnisse

| Artefakt | Live-Baseline | Launch-Kandidat, lokaler/CI-Build |
|---|---:|---:|
| CSS | 114’757 B roh / 18’835 B gzip | 92.92 kB roh / 16.04 kB gzip |
| Main JS | 1’689’293 B roh / 479’781 B gzip | 167.56 kB / 53.07 kB gzip |
| React Vendor | im Main-Bundle | 163.05 kB / 53.26 kB gzip |
| Supabase Vendor | im Main-Bundle | 171.55 kB / 44.36 kB gzip |
| Query Vendor | im Main-Bundle | 27.44 kB / 8.60 kB gzip |
| Home lazy | im Main-Bundle | 24.03 kB / 6.99 kB gzip |
| Platform lazy | im Main-Bundle | 54.76 kB / 17.79 kB gzip |
| Audit lazy | im Main-Bundle | 85.31 kB / 24.21 kB gzip |
| Admin Dashboard lazy | im Main-Bundle | 408.30 kB / 113.47 kB gzip |

Zusätzlich:

- 3’510 Module im Production Build transformiert;
- keine Chunk-Warnung über 500 kB;
- Google Fonts entfernt und durch Systemfonts ersetzt;
- Route-Level Lazy Loading und Vendor-Splitting;
- immutable Cache-Header für Assets;
- statische öffentliche HTML-Einstiegspunkte.
- derselbe Production-Build-Schritt in GitHub CI Run #31 erfolgreich;
- Chromium E2E gegen das CI-Build-Artefakt vollständig erfolgreich.

Die Build- und Bundle-Werte oben sind verifiziert. Es werden keine LCP-, CLS- oder INP-Werte behauptet: Lighthouse, reale Core Web Vitals und Zielhost-Netzwerkzeiten konnten ohne verifizierten Lovable-/Production-Preview nicht belastbar erhoben werden.

## 21. Accessibility-Ergebnisse

Code-seitig umgesetzt:

- semantische `main`-/Heading-Struktur;
- korrigierte Heading-Hierarchie auf der Datenschutzseite;
- sichtbare `:focus-visible`-Ringe;
- zugängliche Namen und Labels für Form-Controls;
- `aria-live` für Audit- und Consent-Status;
- Alttext-, Iframe-Titel-, ID- und `tabindex`-Prüfungen in E2E;
- zentrale Tap Targets mit mindestens 44 oder 48 px;
- Reduced-Motion-Media-Query und komponentenseitige Motion-Abschaltung;
- keine Bedeutung des Audit-Evidenzstatus ausschliesslich über Farbe;
- Mobile-Menü mit benannten Öffnen-/Schliessen-Buttons.

Die automatisierte Accessibility-/Responsive-Basismatrix ist mit 129/129 Chromium-Tests in CI Run #31 bestanden. Offen bleiben die vollständige manuelle Tastatur-/Screenreader-Abnahme, eine dedizierte Kontrastmessung und die Prüfung im realen Lovable-/Production-Hosting. Accessibility ist deshalb code-seitig verifiziert, aber noch nicht vollständig produktiv abgenommen.

## 22. Git-Branch

- Arbeitsbranch: `feat/itsfeierabend-final-launch`
- Zielbranch: `main`
- Basis des Remote-PRs: `74ce1154e818f9406f6d7141a8fdcc758853eef7`
- kombinierter Launch-Code-Commit: `327a319396a07108606f4cef2f567317c2620fe4`
- in CI geprüfter Code-/Test-Stand: `129bac16494e9aa14590bfec769410aa58b9fe67`
- vor dieser Dokumentationsaktualisierung ebenfalls grüner Bericht-/Beweis-Stand: `f95bf482bf433499719a72329bfaf8bfabbe465c`
- Projektisolation: ausschliesslich `mfeie002-jpg/itsfeierabend.ch`

Es wurde weder in `main` gemergt noch ein geschützter Production-Branch verändert.

## 23. Commits

Lokale Arbeitsfolge:

| Commit | Inhalt |
|---|---|
| `9b53d92` | Audit- und CRM-Pipeline abgesichert |
| `7141fb5` | Launch-Quality-Gates und E2E-Tests |
| `764bd6e` | Schweizer Growth-Audit-Plattform und neue Seiten |
| `c3a3f4d` | aktuelle Lovable-`main`-Änderungen integriert |
| `4b30bb7` | generierte QA-Artefakte ignoriert |
| `09f2dbb` | verbleibende Preview-/Security-Risiken im Code geschlossen |

Für GitHub wurde der geprüfte Hauptstand als kombinierter Remote-Commit veröffentlicht:

- `327a319396a07108606f4cef2f567317c2620fe4` — Launch-Kandidat für PR #1.
- `1eca071dc18da1e37519f351003791bb859d0660` — früherer Remote-Zwischenstand.
- `c80128c` — responsive und semantische Accessibility-Testlücken geschlossen.
- `cd449a1` — 320-px-Header-Overflow korrigiert.
- `3fd401d79cae35cc077d104ad79b4fa00f8dac9c` — semantischen mobilen Heading-Zeilenumbruch finalisiert.
- `b7e6eee` — Abschlussbericht und Vorher-/Nachher-Belege ergänzt.
- `d208dd4835f478b6bdcd7e147844cd385d3846e8` — Form-Doppelsubmit-Sperren, Hosting-Contracts sowie Kontakt-/Partner-E2E ergänzt.
- `129bac16494e9aa14590bfec769410aa58b9fe67` — sichtbare Firmenfelder im neuen E2E exakt adressiert; vollständig geprüfter Code-/Test-Stand.
- `829db9efcf7a73810272e8193c030226785399e9` — Abschlussbericht und finale Run-31-Screenshots an den grünen Code-/Test-Stand gebunden.
- `f95bf482bf433499719a72329bfaf8bfabbe465c` — geprüften Code-/Test-Stand vom nachfolgenden Bericht-Stand getrennt; vollständig grüne Bericht-/Beweis-Baseline vor dieser Aktualisierung.

## 24. Pull Request

- [PR #1 — Launch itsfeierabend.ch audit platform](https://github.com/mfeie002-jpg/itsfeierabend.ch/pull/1)
- Status: offen, Draft, nicht gemergt
- GitHub-Metadaten zum Berichtszeitpunkt: `mergeable: true`
- geprüfte Bericht-/Beweis-Baseline: `f95bf482bf433499719a72329bfaf8bfabbe465c`
- Umfang dieser Baseline: 151 Dateien, 12’956 Ergänzungen, 16’765 Löschungen und 10 Remote-Commits
- Code-/Test-Baseline: `129bac16494e9aa14590bfec769410aa58b9fe67`; [Run #31](https://github.com/mfeie002-jpg/itsfeierabend.ch/actions/runs/30146078734) mit 129/129 Tests in 1.3 Minuten
- Bericht-/Beweis-Baseline-CI: Workflow `CI`, [Run #35](https://github.com/mfeie002-jpg/itsfeierabend.ch/actions/runs/30146363221), ID `30146363221`
  - `Lint · Typecheck · Deno tests`: `success`
  - `Production build`: `success`
  - `End-to-end · Public launch QA`: `success`
  - Chromium: 129/129 Tests in 1.2 Minuten bestanden
  - Gesamtstatus: `success`

`mergeable: true` bedeutet nur, dass GitHub keinen Mergekonflikt meldet; es ist keine Produktionsfreigabe.

## 25. Preview-URL

**Status: blockiert.**

Das korrekte Lovable-Projekt wurde identifiziert:

- Projekt-ID: `ff1ee944-2315-457f-8a97-db2703924b0c`
- verknüpftes Supabase-Projekt: `akxdeuvxvhecvddxyqnd`

Die Erstellung eines Release-Previews für den Remote-Commit wurde vom Lovable-Connector mit **`FORBIDDEN`** abgewiesen. Deshalb existiert keine verifizierte, commitspezifische Preview-URL für diesen Launch-Kandidaten.

Die bereits vorhandenen Lovable-Adressen

- `https://id-preview--ff1ee944-2315-457f-8a97-db2703924b0c.lovable.app`
- `https://itsfeierabend.lovable.app`

werden nicht als Nachweis für den neuen Commit ausgegeben, solange deren Code-Stand und Deployment-SHA nicht bestätigt sind.

## 26. Production-URL oder verbleibender Freigabeschritt

Aktuelle öffentliche URLs:

- `https://itsfeierabend.ch`
- `https://www.itsfeierabend.ch`

Die gewünschte Primärdomain bleibt `https://itsfeierabend.ch`. Das neue Release wurde **bewusst nicht produktiv veröffentlicht**. Es wurden weder DNS-Einträge geändert noch `main` gemergt oder Production-Daten migriert.

Verbindliche Reihenfolge vor einer Produktionsfreigabe:

1. Lovable-/Hosting-Zugriff für einen commitspezifischen Preview herstellen;
2. den grünen CI-Produktionsbuild des finalen Release-Branch-Heads mit Code-/Test-Baseline `129bac1…` als commitspezifischen Preview bereitstellen;
3. rechtliche und produktive Anbieterangaben freigeben;
4. beide Supabase-Migrationen in dokumentierter Reihenfolge auf einer sicheren Zielumgebung anwenden;
5. erst danach Edge Functions deployen;
6. Turnstile, Resend und GA4 konfigurieren;
7. DNS-Rebinding-Schutz auf Egress-/Plattformebene schliessen;
8. synthetischen Audit-, Kontakt- und Partnerflow inklusive Speicherung, E-Mail und Event-Deduplizierung testen;
9. Viewport-, Console-, Network-, Accessibility-, Link-, 404-, Redirect- und Performance-QA auf dem Preview;
10. Rollback-Version dokumentieren und erst dann separate Production-Freigabe erteilen.

## 27. Screenshots vorher/nachher

| Zustand | Artefakt | Status |
|---|---|---|
| vorher · Startseite Desktop | `docs/screenshots/before-home-desktop-20260725.jpg` | Live-Baseline |
| vorher · Audit Desktop | `docs/screenshots/before-audit-desktop-20260725.jpg` | Live-Baseline |
| nachher · Startseite 1440 px | `docs/screenshots/after-home-desktop-1440.jpg` | grüner CI-Produktionsbuild |
| nachher · Audit 390 px | `docs/screenshots/after-audit-mobile-390.png` | grüner CI-Produktionsbuild |

Die beiden Nachher-Bilder dokumentieren das gebaute Release-Artefakt aus der grünen CI-Strecke. Sie sind ausdrücklich **kein** Lovable- oder Production-Preview und belegen weder Zielhost-Verhalten noch echte Backend-Integrationen. Nach Freischaltung des commitspezifischen Previews bleibt eine reale Screenshot- und Host-QA bei 320, 390, 768, 1024 und 1440 px erforderlich.

## 28. Verbleibende Risiken

| Priorität | Risiko | Auswirkung | Launch-Gate |
|---|---|---|---|
| P0 | unvollständiger Rechtsträger und Datenschutz-Inventar | rechtliche und vertrauensbezogene Lücke | Fakten liefern und fachlich prüfen |
| P0 | DNS-Rebinding beim Website-Fetch | potenzieller SSRF-Bypass | IP-gepinnter Egress oder Plattformregel |
| P0 | Migration/Function-Rollout nicht laufzeitgeprüft | Audit kann fehlschlagen oder inkonsistent speichern | Migrationen zuerst, danach Functions |
| P0 | Turnstile-Keys nicht verifiziert | Audit scheitert Fail-Closed oder Bot-Schutz ist unklar | Site-/Secret-Key-Paar testen |
| P0 | kein commitspezifischer Preview | keine reale Browser-, Network- oder Hosting-Abnahme | Lovable-`FORBIDDEN` beheben |
| P1 | Resend-Sender/API und Zustellung offen | Report-Mail fehlt | echte Provider-Übergabe mit Testkontakt |
| P1 | keine dauerhafte Mail-Retry-Queue | temporäre Providerfehler bleiben liegen | Retry-Worker und Alerting |
| P1 | GA4 ID, Consent Mode und DebugView offen | keine belastbare Funnel-Messung | Production-ID und Event-Reconciliation |
| P1 | Supabase RLS/Schema nicht in Zielumgebung geprüft | Datenzugriffs- oder Speicherungsrisiko | Runtime-Inspektion und Testdatensätze |
| P2 | zwei moderate React-Router-Advisories ohne Fix | bekannte Dependency-Risiken | Upstream beobachten, bei Fix aktualisieren |
| P2 | Semrush API Units fehlen | Volumen, KD, CPC, Rank/Authority unbekannt | Units bereitstellen oder freigegebenen Export nutzen |
| P2 | keine freigegebenen verbundenen Cases | schwächere externe Glaubwürdigkeit | Claims, Beziehung und Publikation freigeben |
| P2 | keine realen CWV-/Lighthouse-Daten | Performance nur über Build belegt | Preview-/Production-Messung |

Bis P0 geschlossen und die P1-Launch-Gates bestanden sind, bleibt Production **NO-GO**.

## 29. Nächste 30-, 60- und 90-Tage-Prioritäten

### 0–30 Tage: Launch-Gates schliessen

- Lovable-Preview-Berechtigung herstellen und den nach der letzten CI-Prüfung freigegebenen Release-Branch-Head deployen.
- Den vollständig grünen CI Run #35 sowie Code-/Test-Run #31 als Build-Baseline verwenden und Console-, Network-, Link-, 404-, Redirect- und Hosting-QA auf dem realen Preview abschliessen.
- Rechtsträger, Anschrift, Verantwortliche, UID/Handelsregisterangaben und vollständiges Anbieter-/Regionen-/Löschinventar freigeben.
- DNS-Rebinding-Schutz implementieren.
- Supabase-Migrationen in Reihenfolge testen; RLS und Service-Rollen verifizieren.
- Turnstile, Resend und GA4 konfigurieren; DebugView und E-Mail-Zustellung prüfen.
- synthetische Audit-, Kontakt- und Partnerleads markieren und Backend-/Event-Daten abgleichen.
- Rollback-Punkt dokumentieren; danach separate Production-Freigabe einholen.

### 31–60 Tage: belastbare Baseline aufbauen

- mindestens vier vollständige Kalenderwochen nach Instrumentierungsabnahme als Launch-Baseline sammeln; bei geringem Volumen verlängern.
- Sessions, Audit Start Rate, Completion, gespeicherte Leads, Qualified Lead Rate und Datenlücken wöchentlich prüfen.
- Search Console verbinden und Non-Brand-Traffic ohne Schätzung ausweisen.
- CRM-Lifecycle, Owner, Beratungstermin-Status und Quellenqualität operationalisieren.
- Semrush Units oder freigegebenen Export beschaffen und die „Unavailable“-Spalten mit datierter Evidenz ersetzen.
- Methodik-, Tracking-vor-CRO-, Lead-Leakage- und Local-Visibility-Inhalte publizieren.
- verbundene Projekte nur nach überprüfter Beziehung, Messung und Publikationsfreigabe als Cases aufnehmen.

### 61–90 Tage: datenbasiert optimieren

- Funnel-Reibung anhand serverseitiger Audits und qualifizierter Leads priorisieren, nicht anhand Klicks allein.
- Website-, SEO- und AI-Visibility-Seiten anhand Search-Console-Queries und Leadqualität vertiefen.
- einen Partnerpilot mit klarer Datentrennung, Referral-Regeln und Co-Delivery-Grenzen durchführen.
- Paid Search nur als separat genehmigten, kleinen Intent-Test starten, wenn Volumen/CPC, Landingpage, Conversions und CRM-Qualität belegt sind.
- Retainer-, Cross-Sell-, Revenue-by-Source- und Gross-Margin-KPIs erst anbinden, wenn CRM- und Finanzquellen zuverlässig verbunden sind.
- einen anonymisierten Schweizer Benchmark erst bei ausreichender Stichprobe und reproduzierbarer Methodik erwägen.

---

**Launch-Entscheidung am 25. Juli 2026:** Der Code-Kandidat ist reviewfähig, lokal und in CI buildbar. Die Bericht-/Beweis-Baseline `f95bf48…` hat in Run #35 alle drei Jobs und 129/129 Chromium-E2E-Tests bestanden. Ein Lovable-Preview oder Produktionslaunch ist wegen `FORBIDDEN`, fehlender Runtime-/Form-/E-Mail-/GA4-/Rechtsabnahme und des offenen DNS-Rebinding-Risikos dennoch nicht freigegeben.
