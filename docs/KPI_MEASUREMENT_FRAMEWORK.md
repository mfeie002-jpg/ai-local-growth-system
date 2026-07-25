# KPI- und Measurement-Framework

**Projekt:** itsfeierabend.ch  
**Status:** Messspezifikation ohne Zielwerte  
**Zweck:** Entscheidungen vom Website-Besuch bis zu Lead, Auftrag, Retainer und Umsatz ermöglichen

Dieses Dokument definiert Metriken, Ereignisse und Datenquellen. Es enthält bewusst keine erfundenen Baselines, Benchmarks oder Zielzahlen.

## 1. Messprinzipien

1. Ein serverseitig gespeicherter Audit beziehungsweise Lead ist die Conversion-Quelle der Wahrheit, nicht eine aufgerufene Danke- oder Ergebnis-URL.
2. GA4 beschreibt consent-basiertes Nutzungsverhalten; Supabase beziehungsweise das spätere CRM beschreibt Lead- und Funnelstatus.
3. Umsatz- und Kostenmetriken bleiben nicht verfügbar, bis verlässliche Rechnungs-, Buchhaltungs- und Mediakostendaten angebunden sind.
4. Eventnamen und Parameter sind für Deutsch und Englisch identisch.
5. Personenbezogene Daten, Freitext, E-Mail, Telefonnummer, Name, Firma und private Report-Tokens gehören nicht in Analytics.
6. First-Touch- und Last-Touch-Attribution werden getrennt gespeichert; sie dürfen nicht stillschweigend überschrieben werden.
7. feierabendservices.ch und umzugscheck.ch sind keine Traffic-, Lead-, Kampagnen- oder Umsatzquellen von itsfeierabend.ch, ausser ein Datensatz ist ausdrücklich als externer Referral gekennzeichnet.
8. Alle Raten werden aus eindeutigen Sessions, Audits, Leads oder Kunden berechnet, nicht aus unbereinigten Event-Zählungen.

## 2. Messhierarchie

### Geschäftsergebnisse

- qualifizierte Leads;
- gebuchte Beratungen;
- gewonnene Kunden;
- Umsatz und Deckungsbeitrag;
- Retainer- und Cross-Sell-Entwicklung;
- Partnerumsatz.

### Funnel-Treiber

- Sessions und organischer Non-Brand-Traffic;
- Audit Start Rate;
- Audit Completion Rate;
- Lead Conversion Rate;
- Lead-Qualität;
- Übergang zu Beratung, Audit, Sprint und Retainer.

### Guardrails

- serverseitige Erfolgsquote von Formularen und Audits;
- Event-Duplikate;
- fehlende Attribution;
- Consent-Abdeckung;
- PII-Freiheit der Analytics-Payloads;
- Differenz zwischen Frontend-Erfolgen und gespeicherten Backend-Datensätzen;
- Anteil nicht verfügbarer Audit-Evidenz.

## 3. Kanonische Eventtaxonomie

| Event | Wird ausgelöst, wenn | Deduplizierung | Zentrale Parameter |
|---|---|---|---|
| `audit_start` | erstmals eine inhaltliche Eingabe im Audit erfolgt | einmal pro Audit-Session | `page_type`, `audit_type`, `language`, `traffic_source`, `utm_*` |
| `audit_step_complete` | ein valider Schritt erfolgreich verlassen wurde | einmal je Audit-Session und Schritt | `audit_type`, `step_index`, `step_name`, `industry` |
| `audit_submit` | der Server den Audit angelegt und einen Erfolg bestätigt hat | einmal je serverseitigem Audit | `audit_type`, `industry`, `result_status`, `page_type` |
| `audit_result_view` | ein gültiger Report erfolgreich vom Server geladen wurde | einmal je Session und Report | `audit_type`, `lead_score`, `result_status`, `evidence_coverage` |
| `lead_form_start` | erstmals mit einem Kontaktformular interagiert wurde | einmal pro Session und Formular | `form_name`, `page_type`, `service_area` |
| `lead_form_submit` | ein valides Formular an den Server gesendet wurde | einmal pro Submit-Versuch | `form_name`, `page_type`, `service_area`, `traffic_source`, `utm_*` |
| `lead_form_success` | der Server die Speicherung des Leads bestätigt hat | einmal je serverseitigem Lead | `form_name`, `page_type`, `service_area` |
| `consultation_cta_click` | ein CTA zu Kontakt oder Beratung aktiviert wurde | einmal je Klick | `cta_location`, `page_type`, `audit_type` |
| `pricing_cta_click` | ein CTA der Angebotsleiter, „Offerte erhalten“ oder vergleichbarer Scope-CTA aktiviert wurde | einmal je Klick | `cta_location`, `page_type`, `service_area`; kein Preisparameter ohne Freigabe |
| `contact_click` | eine direkte Kontaktoption aktiviert wurde | einmal je Klick | `contact_type`, `cta_location`, `page_type` |
| `email_click` | ein `mailto:`-Link aktiviert wurde | einmal je Klick | `cta_location`, `page_type` |
| `phone_click` | ein `tel:`-Link aktiviert wurde | einmal je Klick | `cta_location`, `page_type` |
| `partner_application_start` | erstmals mit dem Partnerformular interagiert wurde | einmal pro Session | `form_name`, `page_type`, `traffic_source`, `utm_*` |
| `partner_application_submit` | die Partneranfrage serverseitig gespeichert wurde | einmal je Partner-Lead | `form_name`, `page_type`, `partner_model` sofern gewählt |
| `case_study_view` | eine Fallstudien-Detailansicht oder ein definierter Case-Abschnitt sichtbar wurde | einmal pro Session und Case | `case_study_slug`, `page_type` |
| `scroll_depth` | 25, 50, 75 oder 90 Prozent der scrollbaren Seite erreicht wurden | einmal pro Schwelle und Pageview | `depth_percentage`, `page_type`, `page_path` |
| `outbound_click` | ein Link auf eine externe Domain aktiviert wurde | einmal je Klick | `outbound_host`, `cta_location`, `page_type` |

`page_view` bleibt das technische Basisereignis für consent-basierte Seitenaufrufe. Es ist kein Conversion-Event.

### Event-Semantik

- `submit` und `success` sind nicht austauschbar.
- Beim Kontaktformular beschreibt `lead_form_submit` den validen Versuch und `lead_form_success` die bestätigte Speicherung.
- Beim Audit beschreibt `audit_submit` die bestätigte Erstellung des Audit-Datensatzes.
- `partner_application_submit` wird mangels separatem Success-Event erst nach bestätigter Speicherung ausgelöst.
- Ein Reload darf keine Start-, Submit- oder Success-Events erneut senden.
- Client- und Serverereignisse verwenden eine gemeinsame nicht-personenbezogene `event_id`, falls ein Event von beiden Ebenen gesendet wird.

## 4. Eventparameter

| Parameter | Definition | Regel |
|---|---|---|
| `page_type` | kontrollierte Seitenklasse wie `home`, `audit_landing`, `service`, `audit`, `audit_result`, `partner`, `contact`, `insight` | keine freie Benennung |
| `page_path` | Pfad ohne Domain, Querystring oder Token | Reporttoken als `:token` maskieren |
| `language` | `de` oder `en` | aus Route, nicht aus Browser geraten |
| `audit_type` | `business`, `website`, `seo`, `ai_visibility` oder anderer freigegebener Typ | kontrollierte Taxonomie |
| `industry` | standardisierte Branchenkategorie | kein Firmenname oder Freitext |
| `lead_score` | deterministischer Audit-Gesamtscore | nur nach erfolgreicher Berechnung |
| `result_status` | beispielsweise `ready`, `partial` oder `unavailable` | tatsächlicher Backendstatus |
| `evidence_coverage` | Anteil des prinzipiell möglichen Score-Gewichts mit verwertbarer Evidenz | Berechnungslogik versionieren |
| `traffic_source` | normalisierte Quelle der Session beziehungsweise des Leads | First und Last Touch getrennt im CRM |
| `campaign` | normalisierte Kampagnenkennung | entspricht `utm_campaign`, falls vorhanden |
| `utm_source` | UTM-Quelle | keine PII |
| `utm_medium` | UTM-Medium | keine PII |
| `utm_campaign` | UTM-Kampagne | keine PII |
| `utm_content` | Anzeigen-/Contentvariante | keine personenbezogenen IDs |
| `utm_term` | Kampagnenkeyword, sofern verfügbar | keine Suchanfrage oder Freitext-PII |
| `cta_location` | kontrollierte Position wie `header`, `hero`, `result`, `service_body`, `footer` | komponentenübergreifend konsistent |
| `form_name` | `audit`, `contact` oder `partner` | kontrollierte Taxonomie |
| `service_area` | angefragter Bereich wie `seo`, `ai_visibility`, `automation`, `offer` | aus kontrolliertem Feld oder URL-Topic |
| `step_index` | technische Schrittnummer | ab 1, über Versionen dokumentieren |
| `step_name` | kontrollierter technischer Schrittname | nicht der frei übersetzte UI-Text |
| `contact_type` | `email`, `phone` oder freigegebene direkte Kontaktart | keine Kontaktdaten |
| `outbound_host` | Hostname der externen Zielseite | kein vollständiger Pfad oder Querystring |
| `depth_percentage` | 25, 50, 75 oder 90 | nur definierte Schwellen |
| `case_study_slug` | nicht-personenbezogene Case-Kennung | nur freigegebene Cases |

Verbotene Analytics-Parameter sind insbesondere:

- Vor- und Nachname;
- E-Mail-Adresse oder Telefonnummer;
- Firmenname;
- Formularnachricht und andere Freitexte;
- vollständige Website-URL eines Leads;
- Audit-/Reporttoken;
- IP-Adresse;
- API-Schlüssel, CRM-IDs oder Datenbank-UUIDs, die eine Person direkt referenzieren.

## 5. Attribution und CRM-Verknüpfung

Jeder Lead-Datensatz benötigt mindestens:

- `lead_type` und `audit_type`;
- `landing_page`;
- `referrer`;
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`;
- `gclid`, sofern vorhanden und rechtlich zulässig;
- `traffic_source`;
- `industry`, `region`, `website_url`, `primary_goal`;
- `lead_score` und `status`;
- Erstell- und Aktualisierungszeitpunkt;
- Verarbeitungs- und optionale Marketingeinwilligung inklusive Version und Zeitpunkt;
- separate First-Touch- und Last-Touch-Felder.

Der Backend-Datensatz ist die Quelle der Wahrheit für Leadanzahl und Lifecycle. Analytics wird über nicht-personenbezogene technische Schlüssel beziehungsweise aggregierte Zeit- und Quellenmerkmale abgeglichen.

## 6. KPI-Dictionary

| KPI | Berechnung | Grain und Quelle | Wofür die Kennzahl dient |
|---|---|---|---|
| Sessions | eindeutige consent-basierte GA4-Sessions im Zeitraum | Session; GA4 | Reichweite und Nenner für Website-Raten |
| Organic Traffic | Sessions aus dem Kanal Organic Search; GSC-Klicks separat ausweisen | Session/Klick; GA4 und GSC | organische Nachfrage beurteilen |
| Non-Branded Traffic | organische GSC-Klicks aus Suchanfragen, die nicht der gepflegten itsfeierabend-Markenwortliste entsprechen | Query/Tag; GSC | unmarkierte Suchnachfrage statt Markenverkehr messen |
| Audit Start Rate | Sessions mit mindestens einem `audit_start` ÷ Sessions auf öffentlichen Audit-fähigen Seiten | Session; Analytics | Wirkung von Positionierung und Audit-CTA |
| Audit Completion Rate | eindeutige serverseitig erstellte Audits ÷ eindeutige gestartete Audit-Sessions | Audit/Session; Backend plus Analytics | Reibung im Audit-Flow |
| Lead Conversion Rate | eindeutige gespeicherte Leads aus Audit, Kontakt und Partner ÷ Sessions | Lead/Session; CRM plus Analytics | Website-zu-Lead-Leistung |
| Qualified Lead Rate | Leads im kontrollierten Status `qualified` ÷ alle im selben Zeitraum beziehungsweise derselben Kohorte erstellten Leads | Lead; CRM | Lead-Qualität und Zielgruppen-Fit |
| Booked Consultation Rate | Leads mit bestätigtem Beratungstermin ÷ qualifizierte Leads | Lead; CRM/Kalender | Übergang von Qualifizierung zu Gespräch |
| Lead Value | tatsächlich zugeordneter Umsatz oder Deckungsbeitrag einer gereiften Lead-Kohorte ÷ Leads dieser Kohorte | Lead-Kohorte; CRM und Rechnungsdaten | wirtschaftlicher Wert einer Leadquelle |
| Cost per Lead | zurechenbare Mediakosten ÷ gespeicherte Leads derselben Kampagne und Periode | Kampagne; Werbeplattform plus CRM | Paid-Effizienz |
| Customer Acquisition Cost | zurechenbare Akquisitionskosten ÷ neue gewonnene Kunden derselben Kohorte | Kundenkohorte; Finance, CRM, Werbeplattform | Gesamtkosten der Neukundengewinnung |
| Average Order Value | anerkannter Umsatz aus abgeschlossenen Erstaufträgen ÷ Anzahl dieser Aufträge | Auftrag; Rechnungs-/CRM-Daten | durchschnittlicher Umfang des Einstiegsangebots |
| Retainer Conversion | Kunden, die nach Audit oder Sprint in eine laufende Betreuung wechseln ÷ dafür berechtigte abgeschlossene Audit-/Sprint-Kunden | Kundenkohorte; CRM | Übergang zu wiederkehrender Betreuung |
| Gross Margin | `(anerkannter Umsatz − direkt zurechenbare Delivery-Kosten) ÷ anerkannter Umsatz` | Auftrag/Monat; Finance | wirtschaftliche Qualität des Umsatzes |
| Lifetime Value | realisierter kumulierter Deckungsbeitrag je Kundenkohorte; Prognose erst mit dokumentiertem Modell und genügend Historie | Kundenkohorte; Finance und CRM | langfristiger Kundenwert |
| Revenue by Source | anerkannter Umsatz gruppiert nach der festgelegten Attributionssicht | Umsatz/Quelle; CRM und Finance | Quellen mit Geschäftswert priorisieren |
| Revenue by Offer | anerkannter Umsatz gruppiert nach Quick/Deep Audit, Sprint, Projekt, Retainer oder Partnerangebot | Umsatz/Angebot; CRM und Finance | Angebotsleiter steuern |
| Partner Lead Revenue | anerkannter Umsatz aus Leads mit verifizierter Partnerquelle | Umsatz/Partnerquelle; CRM und Finance | Partnerkanal bewerten |
| Cross-Sell Revenue | anerkannter Umsatz aus einem zusätzlichen Angebot bei bestehendem Kunden | Umsatz/Kunde; CRM und Finance | Expansion jenseits des Erstauftrags messen |

### Definitionshinweise

- Rates verwenden eine dokumentierte Kohorten- oder Periodenlogik; Zähler und Nenner dürfen nicht aus unterschiedlichen Reifeperioden stammen.
- Umsatz ist anerkannter, nicht offerierter Umsatz.
- Ein Lead darf kanalübergreifend nur einmal gezählt werden.
- „Qualified“ und „Booked“ benötigen kontrollierte CRM-Statuswerte, Zeitstempel und einen verantwortlichen Owner.
- Für LTV wird während der Baseline nur realisierter Wert gezeigt. Eine Prognose ohne dokumentierte Annahmen wird nicht veröffentlicht.

## 7. Quellen der Wahrheit

| Bereich | Primärquelle | Aktueller Umgang bei fehlender Quelle |
|---|---|---|
| Websiteverhalten | GA4 nach Consent | als unvollständige consent-basierte Sicht kennzeichnen |
| organische Suchanfragen und Klicks | Google Search Console | Non-Brand-Traffic nicht schätzen |
| Auditstatus und Scores | `audit_requests` und `audit_events` | Backendstatus verwenden |
| Leads, Quelle und Lifecycle | getrennte itsfeierabend-Leadtabellen beziehungsweise CRM | keine Daten anderer Projekte substituieren |
| Termine | verknüpfter Kalender oder bestätigter CRM-Status | nicht aus CTA-Klicks ableiten |
| Werbekosten | itsfeierabend-spezifisches Ads-Konto | CPL/CAC nicht berechnen, solange Kosten fehlen |
| Umsatz und Delivery-Kosten | Rechnungs-/Buchhaltungssystem | Umsatz-, Marge- und LTV-KPIs als nicht verfügbar kennzeichnen |
| Markt- und Keyworddaten | Semrush, GSC oder freigegebene Exportdatei | keine Volumen-, KD- oder CPC-Werte erfinden |

## 8. Baseline-Phase

### Phase 0: Instrumentierungsabnahme

Vor dem Sammeln einer Performance-Baseline werden geprüft:

- jedes kanonische Event wird am richtigen Auslöser gesendet;
- Audit-, Kontakt- und Partner-Erfolge stimmen mit gespeicherten Backend-Datensätzen überein;
- Resultat-Reloads und direkte URL-Aufrufe erzeugen keine Conversions;
- UTMs, Referrer, Landingpage und Consent werden korrekt gespeichert;
- Reporttokens und PII erscheinen weder in GA4 noch im Data Layer;
- DE und EN verwenden identische technische Eventnamen;
- Test-Traffic und Test-Leads sind markiert und aus Business-Reports ausschliessbar.

### Phase 1: Launch-Baseline

Die erste Baseline umfasst mindestens vier vollständige Kalenderwochen nach bestandener Instrumentierungsabnahme. Bei sehr niedrigem Funnelvolumen wird sie verlängert; es werden keine Zielwerte aus statistisch unzureichenden Raten abgeleitet.

Während dieser Phase:

- werden keine Performance-Zielzahlen rückwirkend festgelegt;
- werden absolute Werte und Nenner neben jeder Rate gezeigt;
- werden Consent-, Bot-, Test- und interne Zugriffe dokumentiert;
- werden Leadstatus und Datenqualität wöchentlich geprüft;
- werden Umsatzmetriken nur gezeigt, wenn die zugrunde liegenden Systeme vollständig verbunden sind.

### Exit-Kriterien

Die Baseline ist entscheidungsfähig, wenn:

- kritische Events und serverseitige Erfolge reconciled sind;
- keine bekannte systematische Doppelerfassung besteht;
- die wichtigsten Quellen- und Statusfelder ausreichend gepflegt sind;
- mindestens ein vollständiger monatlicher Reportingzyklus vorliegt;
- verbleibende Datenlücken im Bericht sichtbar sind.

Erst danach werden Zielwerte mit historischem Verlauf, Kapazität, Lead-Wert und Kostenbasis festgelegt.

## 9. Review-Rhythmus

| Rhythmus | Inhalt | Entscheidung |
|---|---|---|
| laufend/technisch | Formularfehler, Auditstatus, Eventausfälle, E-Mail-Zustellung | Fehler beheben |
| wöchentlich | Sessions, Starts, Completion, gespeicherte und qualifizierte Leads, Datenlücken | Funnel- und UX-Prioritäten |
| monatlich | Source-/Offer-Mix, Beratung, Kunden, Umsatz, Marge sofern verfügbar | Budget und Angebotsfokus |
| quartalsweise | Retainer, Cross-Sell, Kohortenwert, Partnerkanal, Content-/SEO-Beitrag | Produkt- und Wachstumsentscheidungen |

## 10. Offene Abhängigkeiten

Folgende Kennzahlen bleiben bis zur jeweiligen Verifikation unvollständig:

- GA4 Measurement ID, Consent Mode und DebugView;
- Search-Console-Property;
- Kalender- beziehungsweise Bookingstatus;
- Rechnungs-, Kosten- und Margendaten;
- separates itsfeierabend-Ads-Konto;
- CRM-Lifecycle und Owner;
- reale E-Mail-Zustellung;
- Runtime-RLS und Datenbankzugriff.

