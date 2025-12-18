import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { AlertTriangle, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getConsent, setConsent, type ConsentPreferences } from '@/lib/consent';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';

export default function PrivacyPage() {
  const { t, isEnglish } = useLanguage();
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
        title={t.legal.privacy.title}
        description={isEnglish ? 'Privacy policy for itsFeierabend.ch' : 'Datenschutzerklärung von itsFeierabend.ch'}
        noIndex
      />

      <SectionContainer padding="large">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-8">{t.legal.privacy.title}</h1>
          
          <div className="bg-accent border border-border rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">
                  {isEnglish ? 'Placeholder Content' : 'Platzhalter-Inhalt'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.legal.privacy.note}
                </p>
              </div>
            </div>
          </div>

          {/* Cookie & Analytics Consent Settings */}
          <Card className="mb-8">
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

          <div className="prose prose-neutral max-w-none">
            <h2>{isEnglish ? 'Data Protection Basics' : 'Datenschutz Grundlagen'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'This website is operated by itsFeierabend.ch and is subject to Swiss data protection law (nFADP). We are committed to protecting your personal data and will only use it in accordance with applicable laws.'
                : 'Diese Website wird von itsFeierabend.ch betrieben und unterliegt dem Schweizer Datenschutzgesetz (nDSG). Wir verpflichten uns, deine persönlichen Daten zu schützen und verwenden sie nur in Übereinstimmung mit den geltenden Gesetzen.'}
            </p>

            <h2>{isEnglish ? 'What Data We Collect' : 'Welche Daten wir sammeln'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'When you use our services, we may collect:'
                : 'Wenn du unsere Dienste nutzt, können wir folgende Daten erheben:'}
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                {isEnglish
                  ? 'Contact information (name, email, phone) when you submit a form'
                  : 'Kontaktdaten (Name, E-Mail, Telefon) bei Formular-Einsendungen'}
              </li>
              <li>
                {isEnglish
                  ? 'Business information (industry, location, website) for audit requests'
                  : 'Geschäftsdaten (Branche, Ort, Website) für Audit-Anfragen'}
              </li>
              <li>
                {isEnglish
                  ? 'Usage data (pages visited, time spent) via analytics cookies (if consented)'
                  : 'Nutzungsdaten (besuchte Seiten, Verweildauer) über Analytics-Cookies (bei Zustimmung)'}
              </li>
              <li>
                {isEnglish
                  ? 'Technical data (IP address anonymized, browser type, device)'
                  : 'Technische Daten (anonymisierte IP-Adresse, Browser-Typ, Gerät)'}
              </li>
            </ul>

            <h2>{isEnglish ? 'Cookies & Analytics' : 'Cookies & Analytics'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'We use cookies and analytics tools to improve your experience on our website. You can manage your preferences using the settings above.'
                : 'Wir verwenden Cookies und Analyse-Tools, um deine Erfahrung auf unserer Website zu verbessern. Du kannst deine Einstellungen oben verwalten.'}
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>{isEnglish ? 'Necessary cookies:' : 'Notwendige Cookies:'}</strong>{' '}
                {isEnglish
                  ? 'Essential for website function (session management, consent storage). Cannot be disabled.'
                  : 'Essentiell für Website-Funktion (Sitzungsverwaltung, Consent-Speicherung). Können nicht deaktiviert werden.'}
              </li>
              <li>
                <strong>{isEnglish ? 'Analytics cookies:' : 'Analyse-Cookies:'}</strong>{' '}
                {isEnglish
                  ? 'Google Analytics 4 with IP anonymization. Helps us understand usage patterns.'
                  : 'Google Analytics 4 mit IP-Anonymisierung. Hilft uns, Nutzungsmuster zu verstehen.'}
              </li>
              <li>
                <strong>{isEnglish ? 'Marketing cookies:' : 'Marketing-Cookies:'}</strong>{' '}
                {isEnglish
                  ? 'Google Ads conversion tracking for measuring campaign effectiveness.'
                  : 'Google Ads Conversion-Tracking zur Messung der Kampagnen-Effektivität.'}
              </li>
            </ul>

            <h2>{isEnglish ? 'AI Voice Agent & Calls' : 'AI Voice Agent & Anrufe'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'If you interact with our AI voice assistant, please note:'
                : 'Wenn du mit unserem AI Voice Assistant interagierst, beachte bitte:'}
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                {isEnglish
                  ? 'The AI clearly identifies itself as a digital assistant at the start of each call.'
                  : 'Die KI identifiziert sich klar als digitaler Assistent zu Beginn jedes Anrufs.'}
              </li>
              <li>
                {isEnglish
                  ? 'Call recording only happens with your explicit consent.'
                  : 'Anrufaufzeichnung erfolgt nur mit deiner ausdrücklichen Zustimmung.'}
              </li>
              <li>
                {isEnglish
                  ? 'You can request removal from our call list at any time.'
                  : 'Du kannst jederzeit die Entfernung von unserer Anrufliste beantragen.'}
              </li>
            </ul>

            <h2>{isEnglish ? 'Your Rights' : 'Deine Rechte'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'Under Swiss data protection law, you have the right to:'
                : 'Nach dem Schweizer Datenschutzgesetz hast du das Recht auf:'}
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>{isEnglish ? 'Access your personal data' : 'Auskunft über deine persönlichen Daten'}</li>
              <li>{isEnglish ? 'Correct inaccurate data' : 'Berichtigung unrichtiger Daten'}</li>
              <li>{isEnglish ? 'Delete your data (right to be forgotten)' : 'Löschung deiner Daten (Recht auf Vergessenwerden)'}</li>
              <li>{isEnglish ? 'Restrict processing of your data' : 'Einschränkung der Verarbeitung deiner Daten'}</li>
              <li>{isEnglish ? 'Object to data processing' : 'Widerspruch gegen die Datenverarbeitung'}</li>
              <li>{isEnglish ? 'Data portability' : 'Datenübertragbarkeit'}</li>
            </ul>

            <h2>{isEnglish ? 'Data Retention' : 'Datenspeicherung'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'We retain your data only as long as necessary for the purposes for which it was collected, or as required by law. Lead data is typically retained for 2 years after last contact.'
                : 'Wir speichern deine Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden, erforderlich ist, oder wie es gesetzlich vorgeschrieben ist. Lead-Daten werden in der Regel 2 Jahre nach dem letzten Kontakt aufbewahrt.'}
            </p>

            <h2>{isEnglish ? 'Contact' : 'Kontakt'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'For any questions regarding data protection, please contact us at:'
                : 'Bei Fragen zum Datenschutz kontaktiere uns bitte unter:'}
            </p>
            <p>
              E-Mail: <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">{siteConfig.email}</a>
            </p>

            <div className="bg-muted rounded-lg p-6 font-mono text-sm mt-8">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {t.legal.privacy.placeholder}
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
