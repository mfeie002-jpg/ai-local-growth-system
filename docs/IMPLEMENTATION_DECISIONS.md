# Implementierungsentscheidungen

**Projekt:** itsfeierabend.ch  
**Status:** Launch-Entscheidungsprotokoll  
**Geltungsbereich:** Positionierung, Audit, Daten, Tracking, SEO, Sicherheit und Deployment

Dieses Dokument hält die beschlossenen Zielzustände fest. Es ist kein Nachweis, dass alle Punkte bereits implementiert oder produktiv verifiziert wurden.

## 1. Entscheidungsübersicht

| ID | Entscheidung | Begründung und Konsequenz |
|---|---|---|
| D-01 | itsfeierabend.ch ist ein eigenständiges Projekt. | Keine Angebote, Leads, Kampagnen, Tracking-Container oder Datenbanken von feierabendservices.ch beziehungsweise umzugscheck.ch werden ungeprüft übernommen. |
| D-02 | Positionierung als Schweizer Plattform für AI Business Audits und digitale Wachstumsdiagnose. | Der Einstieg ist Diagnose und Priorisierung, nicht eine generische Full-Service-Agentur oder „AI Transformation“. |
| D-03 | Primäre Zielgruppe sind etablierte Schweizer Dienstleistungs- und B2B-KMU mit wertvollen Leads und schwacher Transparenz über Sichtbarkeit, Conversion, Tracking oder Follow-up. | Branchen werden nach Fit und Evidenz angesprochen, nicht über zahlreiche Doorway Pages. |
| D-04 | Die fokussierte DE-/EN-Architektur aus `FINAL_INFORMATION_ARCHITECTURE.md` ist kanonisch. | `/ai-business-audit` erklärt das Produkt; `/audit` führt die Transaktion aus. |
| D-05 | Es werden keine ungeprüften Preise veröffentlicht. | CTA-Formulierungen lauten unter anderem „Analyse anfragen“ oder „Offerte erhalten“. Bestehende Legacy-Preise sind keine Freigabe. |
| D-06 | Die Angebotsleiter umfasst Quick Audit, vertieften Audit, Sprint/Projekt, laufende Optimierung und Partner/White Label später. | Jede Stufe erhält einen klaren Zweck und abgegrenzten Umfang. |
| D-07 | Der kostenlose Audit ist ein Preliminary Audit mit Progressive Disclosure. | URL und erster sichtbarer Nutzen kommen früh; Geschäftskontext und Kontakt folgen in kurzen, verständlichen Schritten. |
| D-08 | Scores sind deterministisch, versioniert und nachvollziehbar. | KI darf Scores weder erzeugen noch verändern. Änderungen an Regeln oder Gewichten benötigen eine neue Score-Version. |
| D-09 | Evidenzzustand, Quelle und Konfidenz sind getrennte Felder. | Nutzer erkennen, was gemessen, angegeben, abgeleitet, geschätzt, geprüft oder nicht verfügbar ist. |
| D-10 | Fehlende Daten werden nicht als neutraler oder negativer Messwert erfunden. | Nicht verfügbare Signale werden nicht als „0“ oder pauschal „50“ behandelt; Abdeckung und Einschränkung bleiben sichtbar. |
| D-11 | Empfehlungen werden nach nachvollziehbarer Wirkung und Umsetzbarkeit priorisiert. | Jede Top-Massnahme verweist auf Befund, Evidenz, betroffene Kategorie und nächsten Schritt. |
| D-12 | Leads werden serverseitig und getrennt für itsfeierabend.ch gespeichert. | Source Attribution, Consent, Lifecycle und Auditbezug sind Bestandteil des Leadmodells. |
| D-13 | Analytics folgt der Taxonomie aus `KPI_MEASUREMENT_FRAMEWORK.md`. | Keine PII, keine Token, keine Conversion durch reine Danke-/Resultat-Pageviews und keine doppelten Success-Events. |
| D-14 | Bestehender React-/Vite-/TypeScript-/Tailwind-/Supabase-Stack bleibt bestehen. | Kein Framework-Wechsel; gezielte Härtung, Wiederverwendung und Route-Level Code Splitting haben Vorrang. |
| D-15 | Designrichtung bleibt ruhig, präzise und datenorientiert. | Keine Roboter, leuchtenden Gehirne, Neon-Überladung, Fake-Logos oder Comic-Illustrationen. |
| D-16 | SEO und AI Visibility basieren auf eindeutigen Entities, sichtbarer Methodik, strukturierten Antworten und überprüfbaren Quellen. | Keine Ranking- oder Nennungsgarantien; Schema nur für sichtbare, sachlich korrekte Inhalte. |
| D-17 | Verbundene Projekte dürfen nur transparent und ohne erfundene Performance-Angaben gezeigt werden. | feierabendservices.ch und umzugscheck.ch bleiben eigenständige Angebote und Datenräume. |
| D-18 | Datenschutz-, Sicherheits- und E-Mail-Funktionen müssen technisch verifiziert werden. | Rechtstexte sind keine Rechtsberatung; produktive Zustellung, RLS, Rate Limits und Secrets benötigen reale Laufzeitprüfungen. |
| D-19 | Preview und Produktionsveröffentlichung sind getrennte Schritte. | DNS, geschützte Branch-Merges und Produktion ohne sicheren Rollback benötigen ausdrückliche Freigabe. |
| D-20 | Paid Search bleibt bis zur Readiness-Prüfung blockiert. | Keine Kampagnen, Budgets oder Gebote ohne separate Freigabe und keine Verwendung von Feierabend-Services-Kampagnendaten. |

## 2. Positionierung

### Verbindliche Kurzdefinition

itsfeierabend.ch analysiert die digitale Geschäftslage eines Schweizer Unternehmens, trennt Messwerte von Angaben und Annahmen und priorisiert Massnahmen für:

- Sichtbarkeit;
- Leads und Conversion;
- AI Search Visibility;
- Vertrauen und Reputation;
- Tracking und Attribution;
- CRM und Lead-Prozesse;
- Automatisierung;
- digitales Wachstumspotenzial.

### Nicht Teil der Positionierung

- Räumungs-, Reinigungs- oder Umzugsleistungen;
- generische „digitale Transformation“ ohne konkreten Prozess;
- garantierte Google-, ChatGPT-, Lead- oder Umsatzresultate;
- ein gesetzlicher, finanzieller, steuerlicher oder rechtlicher Unternehmensaudit;
- erfundene Kunden, Awards, Partnerschaften oder Kennzahlen.

## 3. Angebotsentscheidung

| Stufe | Ergebnis | Abgrenzung |
|---|---|---|
| Kostenloser Quick Audit | vorläufiger Score beziehungsweise Reifegrad, Evidenzabdeckung, Stärken, Risiken und priorisierte nächste Schritte | nur öffentlich messbare und freiwillig angegebene Daten |
| Vertiefter Audit | verifizierter Kontext, freigegebene Tooldaten und priorisierter Massnahmenplan | Umfang und Offerte nach Fragestellung |
| Growth Sprint/Projekt | begrenzte Umsetzung definierter Hebel | Deliverables, Systeme, Abnahme und Zeitrahmen vor Start |
| Laufende Optimierung | wiederkehrende SEO-, AI-Visibility-, Conversion-, Analytics- oder Reportingarbeit | keine unbegrenzte „Alles inklusive“-Leistung |
| Partner/White Label | Referral oder Co-Delivery; standardisiertes White Label später | Partnerschaft erst nach bestätigtem Fit, Pilot und Datenmodell |

## 4. Audit-Flow

Der Audit wird als kurze, fortschreitende Strecke geführt:

1. Website-URL;
2. Firma, Branche und Region;
3. primäres Geschäftsziel und wichtigste Lead-Quelle;
4. aktuelle Herausforderungen und vorhandene Systeme;
5. Kontakt und notwendige Verarbeitungseinwilligung;
6. bestätigte Erstellung, Fortschritt und Ergebnis.

Die genaue Gruppierung kann für Mobile angepasst werden, solange:

- der Fortschritt sichtbar bleibt;
- keine Daten vor dem serverseitigen Speichern als Erfolg gelten;
- optionale Marketingeinwilligung getrennt bleibt;
- bei nicht erreichbarer Website ein transparenter Preliminary-Audit-Fallback erscheint;
- das Ergebnis nicht aus Zufallszahlen oder unbelegten Annahmen besteht.

### Mindestinhalt des Resultats

- Gesamtscore oder klar gekennzeichneter Reifegrad;
- Score-Version und Evidenzabdeckung;
- Kategorie-Scores;
- wichtigste Stärken;
- grösste Risiken;
- drei bis fünf priorisierte Massnahmen;
- Evidenzzustand je Befund;
- klarer nächster Schritt;
- sichtbarer Hinweis, wenn ein vertiefter oder manueller Audit nötig ist.

## 5. Scoring-Modell

### Kategorien und Gewichte

| Interne Kategorie | Nutzerbezeichnung | Gewicht |
|---|---|---:|
| `technical` | Technische Basis | 15 |
| `content` | Content und Suchintention | 25 |
| `trust` | Vertrauen und Reputation | 20 |
| `conversion` | Conversion und Nutzererlebnis | 25 |
| `automation` | Automation und Datenreife | 15 |
|  | **Gesamt** | **100** |

Die Gewichte `15/25/20/25/15` sind für Score-Version `v1.0` festgeschrieben.

### Berechnung

Für eine Kategorie gilt:

`Kategorie-Prozent = Summe erreichte Punkte der bewertbaren Signale ÷ Summe Maximalpunkte dieser Signale × 100`

Für den Gesamtscore gilt:

`Gesamtscore = Σ(Kategorie-Prozent × Kategorie-Gewicht) ÷ 100`

Zusätzliche Regeln:

- Signale mit Zustand `unavailable` besitzen keine bewertbaren Maximalpunkte und senken den Score nicht künstlich.
- Fehlt eine komplette Kategorie, wird sie als `nicht verfügbar` angezeigt. Ein vorläufiger Gesamtscore muss die fehlende Gewichtsabdeckung sichtbar ausweisen.
- Selbstangaben dürfen nur dann in einen Score einfliessen, wenn die Regel dies ausdrücklich vorsieht und der Zustand sichtbar bleibt.
- Schätzungen erhalten keine höhere Konfidenz als `low` und dürfen nicht als automatisch gemessen dargestellt werden.
- Manuell bestätigte Evidenz überschreibt den Ursprung nicht; der Audit hält sowohl ursprünglichen Befund als auch Reviewstatus fest.
- Semrush- oder andere externe Tooldaten werden nur verwendet, wenn die Quelle tatsächlich verfügbar ist.
- Die Priorisierung von Massnahmen darf die numerischen Kategorien nicht nachträglich verändern.

### Score-Versionierung

Eine neue Score-Version ist erforderlich, wenn:

- ein Kategoriegewicht geändert wird;
- Signaldefinition oder Schwellenwert materiell geändert wird;
- ein Signal neu in den Score einfliesst oder daraus entfernt wird;
- die Behandlung fehlender Evidenz geändert wird.

Reports speichern Score-Version, Regelstand, Ausführungszeitpunkt und verwendete Quellen.

## 6. Evidenzmodell

### Evidenzzustände

| Interner Zustand | Nutzerlabel DE | Bedeutung | Score-Verwendung |
|---|---|---|---|
| `measured` | automatisch gemessen | reproduzierbarer technischer oder externer Messbefund | gemäss dokumentierter Regel |
| `user_provided` | von Ihnen angegeben | Geschäftskontext aus Nutzereingabe | nur bei ausdrücklich definierten Regeln |
| `inferred` | abgeleitet | Schlussfolgerung aus mehreren beobachtbaren Signalen | mit sichtbarer Herleitung und begrenzter Konfidenz |
| `estimated` | vorläufig geschätzt | Annahme, weil direkte Messung fehlt | nicht als Messwert ausgeben; grundsätzlich nicht scorebestimmend |
| `expert_reviewed` | manuell geprüft | Befund wurde durch eine verantwortliche Fachperson bestätigt oder korrigiert | gemäss dokumentierter Reviewregel |
| `unavailable` | nicht verfügbar | Quelle fehlte, Zugriff scheiterte oder Signal war nicht prüfbar | keine Punkte und keine künstliche Null |

### Quellen

Quelle und Zustand bleiben getrennt. Zulässige Quellenklassen sind beispielsweise:

- `html`;
- `http`;
- `network_probe`;
- `semrush`;
- `analytics`;
- `search_console`;
- `crm`;
- `user`;
- `expert`;
- `engine`.

Jeder Befund enthält mindestens:

- Signal-ID;
- Kategorie;
- Wert;
- Evidenztext;
- Zustand;
- Quelle;
- Konfidenz `high`, `medium` oder `low`;
- erhaltene und maximal mögliche Punkte, sofern bewertbar;
- Empfehlung;
- Score-Version.

## 7. Rolle von KI

KI darf:

- Befunde in verständliche Geschäftssprache übersetzen;
- verwandte Risiken und Chancen gruppieren;
- Massnahmen anhand dokumentierter Faktoren priorisieren;
- Rückfragen für fehlenden Geschäftskontext formulieren;
- eine Zusammenfassung aus vorhandener Evidenz erstellen.

KI darf nicht:

- Scores oder Messwerte erfinden;
- Kategoriegewichte ändern;
- fehlende Daten als vorhanden darstellen;
- Umsatzeffekt, Ranking oder AI-Nennung garantieren;
- persönliche oder vertrauliche Daten in Analytics übertragen;
- fachliche oder rechtliche Prüfung vortäuschen.

## 8. Lead-, CRM- und Datentrennung

### Minimales Leadmodell

Ein itsfeierabend-Lead benötigt:

- eindeutige interne ID;
- Leadtyp und Audittyp;
- Firma, Website, Branche, Region und primäres Ziel, soweit erhoben;
- Quelle, Landingpage, Referrer und UTM-Felder;
- Kampagne, Content und Keyword, sofern tatsächlich verfügbar;
- Auditbezug und deterministischen Lead-/Audit-Score;
- kontrollierten Lifecycle-Status;
- Consentwerte, Consentversion und Zeitstempel;
- Erstell- und Aktualisierungszeitpunkt;
- Spam-/Deduplizierungsmerkmale ohne unnötige sensible Daten.

### Isolation

- eigene Tabellen beziehungsweise klarer `tenant/project`-Scope für itsfeierabend.ch;
- keine wiederverwendeten Formulare oder Tracking-Container ohne dokumentierte Zweckprüfung;
- keine Feierabend-Services- oder Umzugscheck-Leads in itsfeierabend-Reports;
- verbundene Projekte erscheinen höchstens als verifizierte Referralquelle oder transparent gekennzeichneter Case;
- Production-Migrationen mit möglichem Datenverlust benötigen separate Freigabe.

## 9. Tracking und Consent

- GA4 wird erst entsprechend dem gespeicherten Consent initialisiert beziehungsweise aktualisiert.
- `analytics_storage`, `ad_storage`, `ad_user_data` und `ad_personalization` folgen der tatsächlichen Auswahl.
- Audit- und Lead-Erfolg wird mit dem Serverzustand abgeglichen.
- Token-Routen werden vor Analytics-Aufrufen maskiert.
- First-Touch-Attribution wird nicht durch spätere direkte Besuche überschrieben.
- Last Touch wird separat geführt.
- Eventpayloads enthalten keine PII.
- Testevents und Testleads müssen aus Business-Reports ausschliessbar sein.

Die kanonischen Events, Parameter und KPI-Formeln stehen in `KPI_MEASUREMENT_FRAMEWORK.md`.

## 10. SEO- und AI-Visibility-Entscheidungen

- `https://itsfeierabend.ch` ist die vorgesehene Canonical-Domain; das tatsächliche www-/non-www-Redirectverhalten wird vor Produktion geprüft.
- Jede DE-/EN-Seite erhält eigenes Title, Description, H1, Canonical und `hreflang`.
- Sitemap enthält nur kanonische, indexierbare Seiten.
- Strukturierte Daten werden nur für sichtbare und sachlich korrekte Inhalte eingesetzt.
- `FAQPage` wird nur verwendet, wenn dieselben Fragen und Antworten sichtbar sind.
- Keine `AggregateRating`-, Award- oder Kundenlogo-Claims ohne überprüfbaren Nachweis.
- AI Visibility wird über Entity-Klarheit, semantische Abdeckung, Quellen, strukturierte Antworten und technische Zugänglichkeit erklärt.
- Keine Garantie für Nennung oder Position in ChatGPT, Google AI Overviews oder anderen Antwortsystemen.
- Keyword-Volumen, KD und CPC werden nur aus einer tatsächlich verfügbaren Quelle veröffentlicht.

## 11. Trust und Case Studies

Erlaubte Trust-Bausteine:

- dokumentierte Methodik;
- nachvollziehbare Scores;
- sichtbare Evidenzzustände;
- Datenschutz und Impressum;
- reale Kontaktmöglichkeit;
- anonymisierte oder freigegebene Beispielreports;
- verifizierte, transparent verbundene Projektkontexte.

Nicht erlaubt:

- erfundene Kundenlogos oder Testimonials;
- nicht freigegebene interne Resultate;
- veraltete BlueGlass-, E-Sports-, UPC-, ASUS- oder andere Referenzclaims als aktueller itsfeierabend-Proof;
- unbestätigte Partnerschaften, Zertifizierungen oder Nutzerzahlen;
- Übernahme von Feierabend-Services-Texten oder Serviceversprechen.

## 12. Technische und Security-Entscheidungen

- Bestehende typisierte Komponenten werden bevorzugt.
- Öffentliche Edge Functions werden auf minimal notwendige Erreichbarkeit begrenzt.
- Interne Scoring-, Report- und Mailfunktionen benötigen Service-zu-Service-Autorisierung.
- Website-Fetching behält SSRF-Schutz, Redirectprüfung, Timeouts und Grössenlimits.
- RLS-Policies werden in der tatsächlich ausgerollten Supabase-Umgebung geprüft, nicht nur anhand von Migrationen angenommen.
- CORS wird pro öffentlichem Endpoint auf notwendige Origins und Methoden begrenzt.
- Secrets verbleiben in der Laufzeitumgebung und werden weder im Client noch in Reports ausgegeben.
- Formularschutz kombiniert Validierung, Honeypot beziehungsweise Challenge, Rate Limit und serverseitige Deduplizierung.
- Fehlerantworten enthalten keine internen Secrets, SQL-Details oder persönlichen Daten.

## 13. E-Mail- und Benachrichtigungsentscheidung

Ein Audit oder Kontaktflow gilt erst als vollständig, wenn:

- der Lead beziehungsweise Audit serverseitig gespeichert wurde;
- der Reportlink auf die tatsächlich vorhandene Route verweist;
- ein realer Mailprovider die Zustellung übernimmt;
- Zustellversuch und Ergebnis getrennt protokolliert werden;
- `email_sent_at` nur bei bestätigter Übergabe an den Provider gesetzt wird;
- Fehler einen wiederholbaren internen Status erzeugen und den Lead nicht verlieren.

Es werden keine Test- oder Marketing-E-Mails an reale Kontakte ohne ausdrückliche Freigabe gesendet.

## 14. Deployment-Entscheidung

Verbindliche Reihenfolge:

1. lokaler Production Build;
2. automatisierte Tests und statische Prüfungen;
3. Preview-Deployment;
4. responsive, funktionale, Accessibility-, Analytics- und Security-QA;
5. dokumentierter Rollback-Punkt;
6. Produktionsfreigabe;
7. Domain-, SSL-, Redirect- und Canonical-Prüfung nach Deployment.

DNS-Änderungen, Domaintransfer, Merge in eine geschützte Production-Branch oder Veröffentlichung ohne sicheren Rollback bleiben freigabepflichtig.

## 15. Verifikationsstatus

Vor einer finalen Launch-Abnahme müssen weiterhin real geprüft werden:

- Supabase Runtime-Schema und RLS;
- produktive Environment Variables und Secrets, ohne sie offenzulegen;
- E-Mail-Provider und Zustellung;
- GA4/GTM/Consent DebugView;
- Search-Console-Property;
- Custom-Domain-Zuordnung und www-Redirect;
- tatsächliche Form- und Audit-Speicherung;
- Event-Deduplizierung;
- Responsive QA für alle geforderten Viewports;
- Build, Linkcheck, Accessibility und Performance;
- Preview- und Rollback-Status.

