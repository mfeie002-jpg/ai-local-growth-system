# Finale Informationsarchitektur

**Projekt:** itsfeierabend.ch  
**Status:** verbindliche Launch-Entscheidung für Struktur, Nutzerführung und Seitenverantwortung  
**Sprachen:** Deutsch (Schweiz) und Englisch  
**Primärdomain:** `https://itsfeierabend.ch`  

Dieses Dokument beschreibt die fokussierte Launch-Architektur. Es ist keine Aussage darüber, dass jede Route bereits produktiv abgenommen oder indexiert ist.

## 1. Architekturprinzipien

1. Der kostenlose Business Audit ist der zentrale Lead-Magnet und der kürzeste gemeinsame nächste Schritt.
2. Jede indexierbare Hauptseite besitzt genau einen primären Such- oder Nutzerintent.
3. Deutsch und Englisch werden als vollständige, paarige Routen geführt. Die deutsche Seite ist kein Redirect auf Englisch.
4. Es gibt keine dünnen Seiten für Keyword-Varianten. Website Audit, SEO-Analyse, AI Visibility und Automation bleiben klar getrennte Themen.
5. `/ai-business-audit` erklärt das Produkt; `/audit` ist die transaktionale Audit-Strecke.
6. Preise werden erst nach bestätigtem Umfang offeriert. Es gibt zum Launch keine eigenständige indexierbare Preisseite mit ungeprüften Preisangaben.
7. Private Report-, Admin- und Token-Routen werden nicht indexiert.
8. Case Studies dürfen nur überprüfbare Projektkontexte und freigegebene Resultate enthalten.
9. itsfeierabend.ch bleibt technisch, inhaltlich und bei der Lead-Speicherung von feierabendservices.ch und umzugscheck.ch getrennt.

## 2. Zielgruppenpriorität

| Priorität | Zielgruppe | Qualifizierende Merkmale | Primärer Einstieg |
|---|---|---|---|
| Primär | Inhabergeführte Schweizer Dienstleistungs- und B2B-KMU | bestehendes Angebot und Website; wertvolle Leads; unklare digitale Engpässe; schwache Messung, Attribution oder Nachbearbeitung | `/`, `/fuer-kmu`, `/ai-business-audit` |
| Primär | Lokale Unternehmen mit erklärungsbedürftiger Leistung | Sichtbarkeit, Vertrauen und Anfrageprozess sind geschäftsrelevant; mehrere Übergaben zwischen Website, E-Mail, Telefon oder CRM | `/website-audit`, `/seo-analyse`, `/automation` |
| Sekundär | Immobilien-, Renovations-, Sanierungs-, Beratungs- und Praxisbetriebe | lokale oder komplexe Nachfrage; Reputation und Datenschutz müssen sachgerecht behandelt werden | `/fuer-kmu` und passende Leistungsseite |
| Sekundär | KMU mit bestehendem SEO-, Ads- oder CRM-Einsatz | Ausgaben oder Aktivitäten sind vorhanden, aber Quelle, Lead-Status und Geschäftsergebnis sind nicht sauber verbunden | `/seo-analyse`, `/automation` |
| Partner | Agenturen, Berater, IT-Dienstleister und Branchenplattformen | Bedarf an unabhängiger Diagnose, qualifizierter Übergabe oder Co-Delivery | `/partner` |
| Später | Gastronomie, Kleinstbetriebe, E-Commerce, grössere Unternehmen, SaaS- oder White-Label-Nutzer | erst nach validiertem Low-Touch-Modell beziehungsweise nach Ausbau von Methodik, Sicherheit und Betriebsprozessen | keine eigene Launch-Landingpage |

Nicht als Launch-Fit priorisiert werden:

- Vorhaben ohne funktionierendes Angebot oder verwertbare Ausgangsdaten;
- Unternehmen, die garantierte Google-, ChatGPT- oder Umsatzresultate erwarten;
- generische „AI-Transformation“ ohne definierten Geschäftsprozess;
- Branchen-Landingpages ohne überprüfbaren Use Case und eigenständigen Inhalt.

Reinigungs-, Umzugs- und Räumungsunternehmen können eine Audit-Zielgruppe sein. Reinigungs-, Umzugs- oder Räumungsleistungen sind jedoch kein Angebot von itsfeierabend.ch.

## 3. Navigation

Die Hauptnavigation bleibt bewusst kurz:

1. Business Audit
2. Leistungen
3. Für KMU
4. Insights
5. dominanter CTA: **Kostenlosen Business Audit starten**

Website Audit, SEO-Analyse, AI Visibility, Automation, Partner, Fallstudien, Über uns und Kontakt werden über Seitenkontext und Footer erschlossen. Auf Mobile bleiben Navigation und CTA mit ausreichend grossen Tap Targets erreichbar.

## 4. Öffentliche Routen und Indexierungsstatus

| Deutsch | Englisch | Primärer Intent | Haupt-CTA | Rolle |
|---|---|---|---|---|
| `/` | `/en` | Positionierung und Orientierung | Kostenlosen Business Audit starten | zentrale Startseite |
| `/ai-business-audit` | `/en/ai-business-audit` | bereichsübergreifende digitale Standortbestimmung verstehen | Kostenlosen Business Audit starten | kanonische Produktseite |
| `/website-audit` | `/en/website-audit` | Website analysieren und Conversion-Hürden erkennen | Kostenlosen Website Audit starten | Website-Diagnose |
| `/seo-analyse` | `/en/seo-analysis` | SEO-Sichtbarkeit und Suchintention prüfen | SEO-Analyse anfragen | SEO-Diagnose |
| `/ai-visibility` | `/en/ai-visibility` | AI-Search-/Entity-/Zitierfähigkeit verstehen | AI-Visibility-Analyse anfragen | AI-Visibility-Diagnose |
| `/automation` | `/en/automation` | CRM-, Funnel- und Automatisierungspotenzial prüfen | Automatisierungsanalyse anfragen | Prozess- und Daten-Diagnose |
| `/leistungen` | `/en/services` | Angebotsleiter und mögliche Umsetzung verstehen | Analyse anfragen | kommerzieller Leistungs-Hub |
| `/fuer-kmu` | `/en/for-smes` | Zielgruppen-Fit prüfen | Eignung im Quick Audit prüfen | Audience-/Fit-Seite |
| `/partner` | `/en/partners` | Referral, Co-Delivery oder später White Label qualifizieren | Partnergespräch anfragen | Partner-Funnel |
| `/fallstudien` | `/en/case-studies` | überprüfbare Projektkontexte und Methodik sehen | Audit starten oder Analyse anfragen | Trust-Seite |
| `/insights` | `/en/insights` | Fachwissen, Methodik und Glossar nutzen | Quick Audit starten | Content-Hub |
| `/ueber-uns` | `/en/about` | Entity, Methodik und Verantwortung verstehen | Kostenlosen Business Audit starten | About-/Methodik-Seite |
| `/kontakt` | `/en/contact` | vertieften Audit, Sprint oder Beratung anfragen | Anfrage senden | Kontakt-Funnel |
| `/impressum` | `/en/imprint` | Rechtsträger und Kontaktangaben | keiner | Legal; erst nach Faktenprüfung indexierbar |
| `/datenschutz` | `/en/privacy` | Datenverarbeitung und Rechte | keiner | Legal; erst nach Prozessoren- und Fristenprüfung indexierbar |

### Seiten, die bewusst nicht separat gestartet werden

- `/business-health-check`: Der Intent überlappt beim Launch mit `/ai-business-audit`. Eine eigene Seite ist erst sinnvoll, wenn ein eigenständiger Umfang und genügend einzigartige Evidenz existieren.
- `/preise`: Ohne freigegebene Preise führt die Route auf `/leistungen`.
- separate Seiten für Lead-Generierung oder Conversion-Optimierung: Diese Themen bleiben zunächst Module von `/leistungen` und dem Audit.
- generische Branchen-Unterseiten: keine Doorway Pages ohne belegbare Anwendungsfälle.

## 5. Transaktionale und private Routen

| Route | Zweck | Indexierung |
|---|---|---|
| `/audit` | deutscher Quick-Audit-Flow | `noindex`; Canonical auf `/ai-business-audit` |
| `/en/audit` | englischer Quick-Audit-Flow | `noindex`; Canonical auf `/en/ai-business-audit` |
| `/audit/r/:token` | privates deutsches Audit-Ergebnis | `noindex`; Token aus Analytics-URLs entfernen |
| `/en/audit/r/:token` | privates englisches Audit-Ergebnis | `noindex`; Token aus Analytics-URLs entfernen |
| `/analyse/progress/:token` und `/en/analysis/progress/:token` | stillgelegte Legacy-Fortschrittsroute; HTTP-301 auf den neuen Audit | nicht indexierbar; keine Legacy-Daten werden ausgeliefert |
| `/analyse/:token` und `/en/analysis/:token` | stillgelegte Legacy-Reportroute; HTTP-301 auf den neuen Audit | nicht indexierbar; keine Legacy-AI-Texte werden ausgeliefert |
| `/admin/*` | interner Betrieb | Auth erforderlich; `noindex` |
| `/oauth/consent` | technischer OAuth-Flow | `noindex` |

Ein manuelles Öffnen einer Ergebnis- oder Danke-URL darf keine Conversion erzeugen. Conversion-Events setzen einen zuvor erfolgreich serverseitig gespeicherten Audit oder Lead voraus.

Die transaktionalen Audit-Routen bleiben bewusst ausserhalb des Suchindex. Ihre
jeweilige Produktseite übernimmt den organischen Suchintent, während der
mehrstufige Flow auf Conversion und Datenerfassung fokussiert bleibt.

Die Legal-Routen bleiben bis zur Verifikation von Rechtsträger, Adresse,
verantwortlicher Person, UID/Registerangaben, Prozessoren, Transfers und
Aufbewahrungsfristen ebenfalls `noindex`. Nach fachlicher Freigabe werden
Robots-Metadaten, Sitemap, Tests und dieses Dokument gemeinsam auf
`index, follow` umgestellt.

## 6. Legacy-Konsolidierung

| Bisherige Route oder Familie | Ziel |
|---|---|
| `/gratis-audit`, `/en/free-audit` | `/audit`, `/en/audit` |
| `/gratis-call`, `/en/free-call` | `/kontakt`, `/en/contact` |
| `/pakete`, `/preise`, `/ultimate-package` | `/leistungen` |
| `/en/pricing`, `/en/ultimate-package` | `/en/services` |
| `/system`, `/en/system` | `/ueber-uns`, `/en/about` |
| `/faq`, `/en/faq` | FAQ-Inhalte in Produkt- und Leistungsseiten; Route auf Business-Audit-Seite |
| `/demo`, `/scan` und englische Varianten | jeweilige Audit-Route |
| `/blog` und `/en/blog` | `/insights`, `/en/insights` |
| bisherige SEO-/SEA-/Design-/Reputation-/Social-Service-Routen | auf die fachlich nächstliegende fokussierte Seite; kein paralleler Legacy-Index |
| Investor-Routen | aus öffentlicher Launch-Navigation entfernen |

Redirects müssen serverseitig oder auf Hosting-Ebene als permanente Redirects umgesetzt werden, sobald die Plattform dies unterstützt. Clientseitige Navigation ist nur eine Übergangslösung.

## 7. Angebotsleiter ohne Preisangaben

| Stufe | Angebot | Zweck | CTA |
|---|---|---|---|
| 1 | Kostenloser Quick Audit | erster nachvollziehbarer Befund und Lead-Qualifizierung | Audit starten |
| 2 | Vertiefter Business-, Website-, SEO- oder AI-Visibility-Audit | Datenprüfung, Expertenanalyse und priorisierter Massnahmenplan | Analyse anfragen |
| 3 | Growth Sprint oder Implementierungsprojekt | klar abgegrenzte Umsetzung der wichtigsten Hebel | Offerte erhalten |
| 4 | Laufende Optimierung | SEO, AI Visibility, Conversion, Analytics und Reporting | Betreuung anfragen |
| 5 | Partner-/Referral-Modell; White Label später | qualifizierte Übergabe, Co-Delivery und später standardisierte Audit-Infrastruktur | Partnergespräch anfragen |

Preis, Dauer, Deliverables und Abnahmekriterien werden erst nach bestätigtem Umfang verbindlich gemacht.

## 8. Funnel A–D

| Funnel | Einstieg | Message Match und Zielseite | Conversion | CRM-Nächster Schritt |
|---|---|---|---|---|
| A · Organische Suche | thematische Google-/Search-Anfrage | `/website-audit`, `/seo-analyse`, `/ai-visibility` oder passender Insight | Quick Audit oder Analyseanfrage | Ergebnis zustellen, qualifizieren, vertieften Audit oder Gespräch anbieten |
| B · B2B-Outreach | personalisierter, itsfeierabend-spezifischer Link | relevante Diagnose-Seite oder Audit mit sauberer Kampagnenattribution | Audit-Ergebnis oder Gesprächsanfrage | Kontext prüfen, Gespräch, vertiefter Audit oder Sprint |
| C · Partner | Empfehlung, Netzwerk oder Partner-Outreach | `/partner` mit Nutzen, Grenzen, Daten- und Mandantentrennung | gespeicherte Partneranfrage | Fit prüfen, Pilot definieren, Referral oder Co-Delivery schriftlich abgrenzen |
| D · Retargeting/Paid Search | intent-spezifische Anzeige | ausschliesslich eine passende Audit-/Leistungsseite mit funktionierendem Tracking | Audit oder Beratung | qualifiziertes Follow-up; keine Kampagne ohne separate Freigabe |

Paid Search bleibt blockiert, bis Suchnachfrage und Kosten verifiziert, die passende Landingpage live, Audit- und Lead-Conversions dedupliziert und Lead-Qualität im CRM messbar sind.

## 9. Verbindliche Seitenbausteine

Jede kommerzielle Hauptseite enthält:

1. eindeutige H1 und Problemdefinition;
2. Zielgruppe und Ausschlusskriterien;
3. konkrete Prüfbereiche oder Deliverables;
4. transparente Methodik und Evidenzgrenzen;
5. einen primären CTA;
6. passende Proof-Elemente ohne Fake-Claims;
7. kurze Conversion-Distanz;
8. interne Links zum Audit, zur Methodik und zum nächsten Angebotsniveau;
9. sichtbare FAQs, falls `FAQPage`-Schema verwendet wird;
10. sprachlich und technisch korrektes DE-/EN-Gegenstück.

## 10. Interne Verlinkungslogik

- Startseite → Produktseite, fachliche Audits, Leistungen, Zielgruppen, Fallstudien und Audit.
- Fachliche Audit-Seite → Audit oder Kontakt; zusätzlich Methodik und relevante Insights.
- Audit-Ergebnis → passende vertiefte Analyse oder Kontakt, nicht pauschal zu allen Leistungen.
- Leistungen → Fachseiten und Kontakt.
- Für KMU → Audit und Kontakt.
- Partner → ausschliesslich Partneranfrage und Methodik.
- Insights → fachlich passende Diagnose-Seite und Audit.
- Über uns → Audit, Kontakt, Datenschutz und Impressum.

## 11. Abnahmekriterien für die IA

- Jede öffentliche DE-Route besitzt genau ein EN-Gegenstück und korrekte `hreflang`-Verweise.
- Canonical verweist auf die aktuelle Sprachroute der Primärdomain.
- Sitemap enthält nur kanonische, indexierbare Seiten.
- Token-, Admin-, Legacy-Report- und technische Routen fehlen in der Sitemap und sind `noindex`.
- Kein Header- oder Footer-Link führt auf eine nicht vorhandene Route.
- Legacy-URLs besitzen ein dokumentiertes Ziel.
- Kein Service von feierabendservices.ch oder umzugscheck.ch erscheint als Angebot von itsfeierabend.ch.
- Es gibt keine erfundenen Preise, Kundenlogos, Bewertungen, Zertifikate oder Leistungsresultate.
