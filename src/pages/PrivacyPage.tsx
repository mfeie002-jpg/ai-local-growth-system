import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { Settings, Check, Shield, Database, Cookie, Phone, UserCheck, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getConsent, setConsent, type ConsentPreferences } from '@/lib/consent';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';

export default function PrivacyPage() {
  const { isEnglish } = useLanguage();
  const [preferences, setPreferences] = useState<Partial<ConsentPreferences>>({
    analytics: false,
    marketing: false,
  });
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
      setHasConsent(true);
    }
  }, []);

  const handleSavePreferences = () => {
    setConsent(preferences);
    setHasConsent(true);
    toast.success(isEnglish ? 'Preferences saved' : 'Einstellungen gespeichert');
  };

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Privacy Policy | Data Protection' : 'Datenschutzerklärung | Datenschutz'}
        description={isEnglish 
          ? 'Privacy policy and data protection information for itsFeierabend.ch. Learn how we protect your data under Swiss law (nFADP).' 
          : 'Datenschutzerklärung und Datenschutzinformationen für itsFeierabend.ch. Erfahren Sie, wie wir Ihre Daten gemäss Schweizer Recht (nDSG) schützen.'}
        noIndex
      />

      <SectionContainer padding="large">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="mb-0">{isEnglish ? 'Privacy Policy' : 'Datenschutzerklärung'}</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            {isEnglish 
              ? 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal data.'
              : 'Dein Datenschutz ist uns wichtig. Diese Erklärung erläutert, wie wir deine persönlichen Daten erheben, verwenden und schützen.'}
          </p>

          {/* Cookie & Analytics Consent Settings */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isEnglish ? 'Cookie & Analytics Settings' : 'Cookie- & Analytics-Einstellungen'}
              </CardTitle>
              <CardDescription>
                {isEnglish 
                  ? 'Manage your privacy preferences. Changes take effect immediately.'
                  : 'Verwalte deine Datenschutz-Einstellungen. Änderungen werden sofort wirksam.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Necessary - Always on */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="pr-4">
                  <Label className="font-medium text-foreground">
                    {isEnglish ? 'Necessary Cookies' : 'Notwendige Cookies'}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isEnglish 
                      ? 'Required for basic website functionality (session, language preference, consent storage).'
                      : 'Für die Grundfunktionen der Website erforderlich (Sitzung, Spracheinstellung, Consent-Speicherung).'}
                  </p>
                </div>
                <Switch checked disabled className="flex-shrink-0" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="pr-4">
                  <Label className="font-medium text-foreground">
                    {isEnglish ? 'Analytics Cookies' : 'Analyse-Cookies'}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isEnglish 
                      ? 'Help us understand how visitors use our website (Google Analytics 4). Data is anonymized.'
                      : 'Helfen uns zu verstehen, wie Besucher unsere Website nutzen (Google Analytics 4). Daten werden anonymisiert.'}
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                  className="flex-shrink-0"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="pr-4">
                  <Label className="font-medium text-foreground">
                    {isEnglish ? 'Marketing Cookies' : 'Marketing-Cookies'}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isEnglish 
                      ? 'Used for remarketing and measuring ad campaign effectiveness (Google Ads conversion tracking).'
                      : 'Für Remarketing und Messung der Werbekampagnen-Effektivität (Google Ads Conversion Tracking).'}
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  {hasConsent && (
                    <span className="flex items-center gap-1 text-primary">
                      <Check className="w-4 h-4" />
                      {isEnglish ? 'Preferences saved' : 'Einstellungen gespeichert'}
                    </span>
                  )}
                </p>
                <Button onClick={handleSavePreferences}>
                  {isEnglish ? 'Save Preferences' : 'Einstellungen speichern'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-neutral max-w-none space-y-10">
            {/* Responsible Party */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Data Controller' : 'Verantwortliche Stelle'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'The data controller for this website is itsFeierabend.ch, located in Switzerland. This website is subject to Swiss data protection law (nFADP/nDSG). We are committed to protecting your personal data and will only use it in accordance with applicable laws.'
                      : 'Verantwortlich für diese Website ist itsFeierabend.ch mit Sitz in der Schweiz. Diese Website unterliegt dem Schweizer Datenschutzgesetz (nDSG). Wir verpflichten uns, deine persönlichen Daten zu schützen und verwenden sie nur in Übereinstimmung mit den geltenden Gesetzen.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'What Data We Collect' : 'Welche Daten wir erheben'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEnglish
                      ? 'When you use our services, we may collect the following types of data:'
                      : 'Wenn du unsere Dienste nutzt, können wir folgende Arten von Daten erheben:'}
                  </p>
                  <ul className="text-muted-foreground space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        <strong>{isEnglish ? 'Contact Data:' : 'Kontaktdaten:'}</strong>{' '}
                        {isEnglish
                          ? 'Name, email, phone number when you submit a form or request a callback'
                          : 'Name, E-Mail, Telefonnummer bei Formular-Einsendungen oder Rückrufanfragen'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        <strong>{isEnglish ? 'Business Data:' : 'Geschäftsdaten:'}</strong>{' '}
                        {isEnglish
                          ? 'Industry, location, website URL, budget information for audit and service requests'
                          : 'Branche, Standort, Website-URL, Budget-Informationen für Audit- und Serviceanfragen'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        <strong>{isEnglish ? 'Usage Data:' : 'Nutzungsdaten:'}</strong>{' '}
                        {isEnglish
                          ? 'Pages visited, time spent, interactions via analytics cookies (only with your consent)'
                          : 'Besuchte Seiten, Verweildauer, Interaktionen über Analytics-Cookies (nur mit Zustimmung)'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        <strong>{isEnglish ? 'Technical Data:' : 'Technische Daten:'}</strong>{' '}
                        {isEnglish
                          ? 'Anonymized IP address, browser type, device information, referrer URL'
                          : 'Anonymisierte IP-Adresse, Browser-Typ, Geräteinformationen, Referrer-URL'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purpose of Data Processing */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                {isEnglish ? 'Purpose of Data Processing' : 'Zweck der Datenverarbeitung'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {isEnglish
                  ? 'We process your personal data for the following purposes:'
                  : 'Wir verarbeiten deine personenbezogenen Daten zu folgenden Zwecken:'}
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>{isEnglish ? 'To provide our services and respond to your inquiries' : 'Zur Erbringung unserer Dienstleistungen und Beantwortung deiner Anfragen'}</li>
                <li>{isEnglish ? 'To create and deliver audit reports and marketing analyses' : 'Zur Erstellung und Lieferung von Audit-Berichten und Marketing-Analysen'}</li>
                <li>{isEnglish ? 'To improve our website and services through analytics' : 'Zur Verbesserung unserer Website und Dienste durch Analysen'}</li>
                <li>{isEnglish ? 'To send relevant marketing communications (only with consent)' : 'Zum Versand relevanter Marketing-Kommunikation (nur mit Zustimmung)'}</li>
                <li>{isEnglish ? 'To comply with legal obligations' : 'Zur Erfüllung gesetzlicher Verpflichtungen'}</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Cookies & Analytics' : 'Cookies & Analytics'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEnglish
                      ? 'We use cookies and similar technologies to improve your experience. You can manage your cookie preferences using the settings panel above.'
                      : 'Wir verwenden Cookies und ähnliche Technologien, um deine Erfahrung zu verbessern. Du kannst deine Cookie-Einstellungen über das Panel oben verwalten.'}
                  </p>
                  <div className="bg-muted rounded-lg p-4 space-y-4">
                    <div>
                      <p className="font-medium text-foreground">{isEnglish ? 'Necessary Cookies' : 'Notwendige Cookies'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? 'Essential for website function. These cannot be disabled. Includes session management, language preferences, and consent storage.'
                          : 'Essentiell für Website-Funktion. Diese können nicht deaktiviert werden. Beinhaltet Sitzungsverwaltung, Sprachpräferenzen und Consent-Speicherung.'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{isEnglish ? 'Analytics (Google Analytics 4)' : 'Analytics (Google Analytics 4)'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? 'Used with IP anonymization to understand website usage patterns. Data is not shared with third parties for advertising.'
                          : 'Verwendet mit IP-Anonymisierung, um Nutzungsmuster zu verstehen. Daten werden nicht mit Dritten für Werbezwecke geteilt.'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{isEnglish ? 'Marketing (Google Ads)' : 'Marketing (Google Ads)'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? 'Conversion tracking to measure the effectiveness of our advertising campaigns. Used for remarketing to website visitors.'
                          : 'Conversion-Tracking zur Messung der Effektivität unserer Werbekampagnen. Verwendet für Remarketing an Website-Besucher.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Voice Agent */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'AI Voice Agent & Calls' : 'KI-Sprachassistent & Anrufe'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEnglish
                      ? 'If you interact with our AI voice assistant, please note the following:'
                      : 'Wenn du mit unserem KI-Sprachassistenten interagierst, beachte bitte Folgendes:'}
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      {isEnglish
                        ? 'The AI clearly identifies itself as a digital assistant at the start of each call'
                        : 'Die KI identifiziert sich zu Beginn jedes Anrufs klar als digitaler Assistent'}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      {isEnglish
                        ? 'Call recording only happens with your explicit prior consent'
                        : 'Anrufaufzeichnung erfolgt nur mit deiner ausdrücklichen vorherigen Zustimmung'}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      {isEnglish
                        ? 'Transcripts are stored securely and used only for service improvement'
                        : 'Transkripte werden sicher gespeichert und nur zur Serviceverbesserung verwendet'}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      {isEnglish
                        ? 'You can request removal from our call list at any time'
                        : 'Du kannst jederzeit die Entfernung von unserer Anrufliste beantragen'}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Your Rights' : 'Deine Rechte'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEnglish
                      ? 'Under Swiss data protection law (nFADP), you have the following rights:'
                      : 'Nach dem Schweizer Datenschutzgesetz (nDSG) hast du folgende Rechte:'}
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right of Access:' : 'Auskunftsrecht:'}</strong> {isEnglish ? 'Request information about your stored data' : 'Auskunft über deine gespeicherten Daten verlangen'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right to Rectification:' : 'Berichtigungsrecht:'}</strong> {isEnglish ? 'Correct inaccurate personal data' : 'Unrichtige personenbezogene Daten berichtigen'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right to Erasure:' : 'Löschungsrecht:'}</strong> {isEnglish ? 'Request deletion of your data (right to be forgotten)' : 'Löschung deiner Daten verlangen (Recht auf Vergessenwerden)'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right to Restriction:' : 'Einschränkungsrecht:'}</strong> {isEnglish ? 'Restrict processing of your data' : 'Verarbeitung deiner Daten einschränken'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right to Object:' : 'Widerspruchsrecht:'}</strong> {isEnglish ? 'Object to data processing for specific purposes' : 'Widerspruch gegen die Verarbeitung für bestimmte Zwecke'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>{isEnglish ? 'Right to Data Portability:' : 'Datenübertragbarkeit:'}</strong> {isEnglish ? 'Receive your data in a portable format' : 'Deine Daten in einem portablen Format erhalten'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Data Retention' : 'Datenspeicherung'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? 'We retain your data only as long as necessary for the purposes for which it was collected, or as required by law. Specifically:'
                      : 'Wir speichern deine Daten nur so lange, wie es für die Zwecke der Erhebung erforderlich ist oder gesetzlich vorgeschrieben ist. Im Einzelnen:'}
                  </p>
                  <ul className="text-muted-foreground space-y-2 mt-4">
                    <li>{isEnglish ? 'Lead and inquiry data: 2 years after last contact' : 'Lead- und Anfragedaten: 2 Jahre nach letztem Kontakt'}</li>
                    <li>{isEnglish ? 'Analytics data: 26 months (Google Analytics default)' : 'Analytics-Daten: 26 Monate (Google Analytics Standard)'}</li>
                    <li>{isEnglish ? 'Call recordings: 1 year (if consent given)' : 'Anrufaufzeichnungen: 1 Jahr (bei Zustimmung)'}</li>
                    <li>{isEnglish ? 'Accounting data: 10 years (legal requirement)' : 'Buchhaltungsdaten: 10 Jahre (gesetzliche Aufbewahrungspflicht)'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                {isEnglish ? 'Data Security' : 'Datensicherheit'}
              </h2>
              <p className="text-muted-foreground">
                {isEnglish
                  ? 'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encrypted data transmission (TLS/SSL), secure hosting infrastructure, access controls, and regular security audits.'
                  : 'Wir implementieren angemessene technische und organisatorische Sicherheitsmassnahmen, um deine personenbezogenen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen. Dies umfasst verschlüsselte Datenübertragung (TLS/SSL), sichere Hosting-Infrastruktur, Zugriffskontrollen und regelmässige Sicherheitsaudits.'}
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                {isEnglish ? 'Third-Party Services' : 'Drittanbieter-Dienste'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {isEnglish
                  ? 'We use the following third-party services that may process your data:'
                  : 'Wir nutzen folgende Drittanbieter-Dienste, die deine Daten verarbeiten können:'}
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li><strong>Google Analytics 4:</strong> {isEnglish ? 'Website analytics (with IP anonymization)' : 'Website-Analytics (mit IP-Anonymisierung)'}</li>
                <li><strong>Google Ads:</strong> {isEnglish ? 'Advertising and conversion tracking' : 'Werbung und Conversion-Tracking'}</li>
                <li><strong>Supabase:</strong> {isEnglish ? 'Database and authentication services (EU region)' : 'Datenbank- und Authentifizierungsdienste (EU-Region)'}</li>
                <li><strong>Retell AI:</strong> {isEnglish ? 'AI voice agent services' : 'KI-Sprachassistent-Dienste'}</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Contact for Data Protection' : 'Kontakt für Datenschutz'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEnglish
                      ? 'For any questions, requests, or concerns regarding data protection, please contact us:'
                      : 'Bei Fragen, Anfragen oder Anliegen zum Datenschutz kontaktiere uns bitte:'}
                  </p>
                  <p>
                    E-Mail:{' '}
                    <a 
                      href={`mailto:${siteConfig.email}`} 
                      className="text-primary hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <section className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {isEnglish 
                  ? 'Last updated: December 2024' 
                  : 'Zuletzt aktualisiert: Dezember 2024'}
              </p>
            </section>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
