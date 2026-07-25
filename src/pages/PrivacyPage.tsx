import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Clock, Cookie, Database, Mail, Settings, Shield, UserCheck } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { siteConfig } from '@/config/site';
import { useLanguage } from '@/i18n/LanguageContext';
import { getConsent, setConsent, type ConsentPreferences } from '@/lib/consent';
import { toast } from 'sonner';

export default function PrivacyPage() {
  const { isEnglish } = useLanguage();
  const [preferences, setPreferences] = useState<Partial<ConsentPreferences>>({
    analytics: false,
    marketing: false,
  });
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) return;

    setPreferences({
      analytics: consent.analytics,
      marketing: consent.marketing,
    });
    setHasConsent(true);
  }, []);

  const handleSavePreferences = () => {
    setConsent(preferences);
    setHasConsent(true);
    toast.success(isEnglish ? 'Preferences saved' : 'Einstellungen gespeichert');
  };

  const blockerItems = isEnglish
    ? [
        'The approved legal entity, postal address and responsible person are not stored in the repository.',
        'The active production vendors, processing regions, data-transfer safeguards and processor agreements have not been verified end to end.',
        'A binding retention and deletion schedule has not been approved.',
        'The final policy must be reviewed against the production configuration and the countries in which the service is offered.',
      ]
    : [
        'Freigegebene juristische Firmierung, Postanschrift und verantwortliche Person sind im Repository nicht hinterlegt.',
        'Aktive Produktionsanbieter, Verarbeitungsregionen, Garantien für Datenübermittlungen und Auftragsbearbeitungsverträge sind nicht vollständig verifiziert.',
        'Ein verbindliches Aufbewahrungs- und Löschkonzept ist noch nicht freigegeben.',
        'Die finale Erklärung muss gegen die Produktionskonfiguration und die tatsächlich bedienten Länder geprüft werden.',
      ];

  const dataCategories = isEnglish
    ? [
        'Contact details supplied in a form, such as name, business email and optional telephone number.',
        'Business context supplied for an audit or enquiry, such as company, website, industry, region, goals and current tools.',
        'Audit answers, report identifiers and workflow status needed to create and deliver a requested result.',
        'Attribution and technical metadata needed for security, diagnostics and source measurement, such as landing page, referrer, campaign parameters, device/browser information and timestamps.',
        'Consent choices and communication preferences.',
      ]
    : [
        'In Formularen angegebene Kontaktdaten wie Name, geschäftliche E-Mail-Adresse und optionale Telefonnummer.',
        'Für Audit oder Anfrage angegebener Geschäftskontext wie Firma, Website, Branche, Region, Ziele und bestehende Systeme.',
        'Audit-Antworten, Report-Kennungen und Bearbeitungsstatus, die zur Erstellung und Zustellung eines angeforderten Ergebnisses benötigt werden.',
        'Attributions- und technische Metadaten für Sicherheit, Diagnose und Quellenmessung, etwa Landingpage, Referrer, Kampagnenparameter, Geräte-/Browserinformationen und Zeitstempel.',
        'Consent-Entscheidungen und Kommunikationspräferenzen.',
      ];

  const serviceCategories = isEnglish
    ? [
        'hosting, database and server-side processing;',
        'anti-abuse and form protection;',
        'email delivery and operational notifications;',
        'website and SEO data enrichment requested for an audit;',
        'optional analytics or advertising measurement after the required consent;',
        'optional AI interpretation or voice functions, only when configured and disclosed.',
      ]
    : [
        'Hosting, Datenbank und serverseitige Verarbeitung;',
        'Missbrauchs- und Formularschutz;',
        'E-Mail-Zustellung und operative Benachrichtigungen;',
        'für einen Audit angeforderte Website- und SEO-Datenanreicherung;',
        'optionale Analyse- oder Werbemessung nach erforderlicher Zustimmung;',
        'optionale KI-Interpretation oder Sprachfunktionen, nur wenn konfiguriert und offengelegt.',
      ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Privacy policy | Working status' : 'Datenschutzerklärung | Arbeitsstand'}
        description={
          isEnglish
            ? 'Transparent working status for data processing on itsFeierabend.ch, including unresolved launch requirements.'
            : 'Transparenter Arbeitsstand zur Datenbearbeitung auf itsFeierabend.ch mit klar ausgewiesenen offenen Launch-Anforderungen.'
        }
        noIndex
      />

      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />
        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {isEnglish ? 'Privacy / working status' : 'Datenschutz / Arbeitsstand'}
                </span>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-9">
              <h1 className="font-editorial text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                {isEnglish ? 'Privacy policy.' : 'Datenschutzerklärung.'}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {isEnglish
                  ? 'This page describes the intended data flows without presenting unverified vendors, regions or retention periods as established facts.'
                  : 'Diese Seite beschreibt die vorgesehenen Datenflüsse, ohne unbestätigte Anbieter, Regionen oder Aufbewahrungsfristen als gesicherte Fakten darzustellen.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionContainer padding="large">
        <div className="mx-auto max-w-3xl">
          <Card className="mb-10 border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                {isEnglish ? 'Launch blocker: legal and production facts incomplete' : 'Launch-Blocker: Rechts- und Produktionsfakten unvollständig'}
              </CardTitle>
              <CardDescription>
                {isEnglish
                  ? 'This policy is an operational working document, not legal advice or a final compliance confirmation.'
                  : 'Diese Erklärung ist ein operativer Arbeitsstand, keine Rechtsberatung und keine abschliessende Compliance-Bestätigung.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {blockerItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" aria-hidden="true" />
                {isEnglish ? 'Cookie and measurement settings' : 'Cookie- und Mess-Einstellungen'}
              </CardTitle>
              <CardDescription>
                {isEnglish
                  ? 'These choices permit optional categories if a corresponding service is configured. Enabling a category does not prove that a particular vendor is active.'
                  : 'Diese Auswahl erlaubt optionale Kategorien, falls ein entsprechender Dienst konfiguriert ist. Das Aktivieren einer Kategorie bestätigt nicht, dass ein bestimmter Anbieter aktiv ist.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b border-border py-3">
                <div className="pr-4">
                  <Label className="font-medium text-foreground">
                    {isEnglish ? 'Necessary storage' : 'Notwendige Speicherung'}
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isEnglish
                      ? 'Used for essential functions such as consent state and basic session or language behaviour.'
                      : 'Für wesentliche Funktionen wie Consent-Status sowie grundlegendes Sitzungs- oder Sprachverhalten.'}
                  </p>
                </div>
                <Switch checked disabled className="flex-shrink-0" aria-label={isEnglish ? 'Necessary storage enabled' : 'Notwendige Speicherung aktiviert'} />
              </div>

              <div className="flex items-center justify-between border-b border-border py-3">
                <div className="pr-4">
                  <Label htmlFor="privacy-analytics" className="font-medium text-foreground">
                    {isEnglish ? 'Analytics' : 'Analyse'}
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isEnglish
                      ? 'Allows optional usage measurement after a measurement service has been verified and configured.'
                      : 'Erlaubt optionale Nutzungsmessung, nachdem ein Messdienst verifiziert und konfiguriert wurde.'}
                  </p>
                </div>
                <Switch
                  id="privacy-analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences((previous) => ({ ...previous, analytics: checked }))}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between border-b border-border py-3">
                <div className="pr-4">
                  <Label htmlFor="privacy-marketing" className="font-medium text-foreground">
                    {isEnglish ? 'Marketing measurement' : 'Marketing-Messung'}
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isEnglish
                      ? 'Allows optional campaign or conversion measurement after the production setup has been verified.'
                      : 'Erlaubt optionale Kampagnen- oder Conversion-Messung nach Verifikation des Produktions-Setups.'}
                  </p>
                </div>
                <Switch
                  id="privacy-marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences((previous) => ({ ...previous, marketing: checked }))}
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {hasConsent && (
                    <span className="flex items-center gap-1 text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {isEnglish ? 'Preferences saved' : 'Einstellungen gespeichert'}
                    </span>
                  )}
                </p>
                <Button onClick={handleSavePreferences}>
                  {isEnglish ? 'Save preferences' : 'Einstellungen speichern'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-neutral max-w-none space-y-10">
            <section>
              <div className="mb-4 flex items-start gap-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Controller' : 'Verantwortliche Stelle'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'The approved legal entity and postal address are not yet available. Until those facts are supplied, itsFeierabend.ch and the contact address below are the only verified public identifiers in this repository.'
                      : 'Freigegebene juristische Firmierung und Postanschrift liegen noch nicht vor. Bis diese Fakten ergänzt sind, sind itsFeierabend.ch und die unten genannte Kontaktadresse die einzigen in diesem Repository verifizierten öffentlichen Identifikatoren.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-start gap-3">
                <Database className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Data categories' : 'Datenkategorien'}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {isEnglish
                      ? 'Depending on the feature you use and the information you provide, the service may process:'
                      : 'Abhängig von der verwendeten Funktion und den von Ihnen angegebenen Informationen können verarbeitet werden:'}
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    {dataCategories.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {isEnglish ? 'Purposes' : 'Zwecke'}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>{isEnglish ? 'Respond to an enquiry and deliver a requested audit or report.' : 'Anfragen beantworten und einen angeforderten Audit oder Report bereitstellen.'}</li>
                <li>{isEnglish ? 'Operate, secure and troubleshoot the service.' : 'Den Dienst betreiben, absichern und Fehler untersuchen.'}</li>
                <li>{isEnglish ? 'Measure sources and improve the funnel where the required consent exists.' : 'Quellen messen und den Funnel verbessern, soweit die erforderliche Zustimmung vorliegt.'}</li>
                <li>{isEnglish ? 'Send optional follow-up or marketing communication only where separately permitted.' : 'Optionale Folge- oder Marketing-Kommunikation nur versenden, wenn sie separat erlaubt wurde.'}</li>
                <li>{isEnglish ? 'Meet documented legal or contractual obligations after those obligations are verified.' : 'Dokumentierte rechtliche oder vertragliche Pflichten erfüllen, nachdem diese geprüft wurden.'}</li>
              </ul>
            </section>

            <section>
              <div className="mb-4 flex items-start gap-3">
                <Cookie className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Cookies and similar storage' : 'Cookies und ähnliche Speicherung'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'Necessary storage can retain consent and essential interface state. Optional analytics or marketing storage must remain disabled until the user permits the relevant category and the production service is correctly configured. The final cookie inventory is a launch requirement.'
                      : 'Notwendige Speicherung kann Consent- und wesentliche Oberflächenzustände sichern. Optionale Analyse- oder Marketing-Speicherung muss deaktiviert bleiben, bis die relevante Kategorie erlaubt und der Produktionsdienst korrekt konfiguriert ist. Das finale Cookie-Inventar ist eine Launch-Anforderung.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {isEnglish ? 'Service providers and external enrichment' : 'Dienstleister und externe Datenanreicherung'}
              </h2>
              <p className="mb-4 text-muted-foreground">
                {isEnglish
                  ? 'The codebase contains optional integration points, but that does not establish which vendors are active in production. Before launch, the operator must publish the verified provider, purpose, processing region and relevant transfer information for each active category:'
                  : 'Der Code enthält optionale Integrationspunkte; daraus folgt nicht, welche Anbieter in Produktion aktiv sind. Vor dem Launch müssen für jede aktive Kategorie Anbieter, Zweck, Verarbeitungsregion und relevante Angaben zu Datenübermittlungen verifiziert veröffentlicht werden:'}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {serviceCategories.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {isEnglish ? 'Audit results and AI assistance' : 'Audit-Ergebnisse und KI-Unterstützung'}
              </h2>
              <p className="text-muted-foreground">
                {isEnglish
                  ? 'An audit may combine automatically observed signals, information supplied by the user, rule-based scoring, external enrichment and optional AI-assisted wording. The result must identify these evidence levels and should be treated as a preliminary business diagnostic, not as legal, tax, credit, employment or statutory audit advice.'
                  : 'Ein Audit kann automatisch beobachtete Signale, Nutzerangaben, regelbasiertes Scoring, externe Datenanreicherung und optionale KI-unterstützte Formulierung kombinieren. Das Ergebnis muss diese Evidenzstufen ausweisen und ist als vorläufige digitale Unternehmensdiagnose zu verstehen, nicht als Rechts-, Steuer-, Kredit-, Personal- oder gesetzliche Revisionsberatung.'}
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-start gap-3">
                <UserCheck className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Requests concerning personal data' : 'Anfragen zu Personendaten'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'Depending on the applicable law and its exceptions, a person may be entitled to request information, correction, deletion or delivery of their personal data. Requests can be sent to the contact address below. Identity may need to be verified before data is disclosed or changed.'
                      : 'Je nach anwendbarem Recht und dessen Ausnahmen kann eine Person Auskunft, Berichtigung, Löschung oder Herausgabe ihrer Personendaten verlangen. Anfragen können an die unten genannte Adresse gesendet werden. Vor einer Offenlegung oder Änderung kann eine Identitätsprüfung erforderlich sein.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-start gap-3">
                <Clock className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Retention and deletion' : 'Aufbewahrung und Löschung'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'No fixed retention periods are published here because the production data inventory and approved retention schedule are not complete. Defining justified periods for leads, audits, operational logs, communications and any optional recordings or transcripts is a launch blocker.'
                      : 'Hier werden keine festen Fristen veröffentlicht, weil Produktions-Dateninventar und freigegebenes Aufbewahrungskonzept noch nicht vollständig sind. Begründete Fristen für Leads, Audits, Betriebsprotokolle, Kommunikation und optionale Aufzeichnungen oder Transkripte festzulegen, ist ein Launch-Blocker.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {isEnglish ? 'Security' : 'Sicherheit'}
              </h2>
              <p className="text-muted-foreground">
                {isEnglish
                  ? 'HTTPS is enabled on the public website. Access controls, database policies, rate limits, secret handling, backups, incident response and vendor configuration must still be verified against production. No internet service can promise absolute security.'
                  : 'HTTPS ist auf der öffentlichen Website aktiviert. Zugriffskontrollen, Datenbankrichtlinien, Rate Limits, Secret-Verwaltung, Backups, Incident Response und Anbieterkonfiguration müssen weiterhin gegen Produktion verifiziert werden. Kein Internetdienst kann absolute Sicherheit versprechen.'}
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-start gap-3">
                <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="mt-0 mb-3 text-xl font-semibold">
                    {isEnglish ? 'Privacy contact' : 'Datenschutz-Kontakt'}
                  </h2>
                  <p className="mb-4 text-muted-foreground">
                    {isEnglish
                      ? 'Questions and requests can be sent to:'
                      : 'Fragen und Anfragen können gesendet werden an:'}
                  </p>
                  <p>
                    <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {isEnglish ? 'Working status reviewed: 25 July 2026' : 'Arbeitsstand geprüft: 25. Juli 2026'}
              </p>
            </section>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
