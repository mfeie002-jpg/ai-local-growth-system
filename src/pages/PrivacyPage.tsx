import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  const { t, isEnglish } = useLanguage();

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

          <div className="prose prose-neutral max-w-none">
            <div className="bg-muted rounded-lg p-6 font-mono text-sm">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {t.legal.privacy.placeholder}
              </p>
            </div>

            <h2 className="mt-8">{isEnglish ? 'Data Protection Basics' : 'Datenschutz Grundlagen'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'This website is operated by itsFeierabend.ch and is subject to Swiss data protection law (nFADP). We are committed to protecting your personal data and will only use it in accordance with applicable laws.'
                : 'Diese Website wird von itsFeierabend.ch betrieben und unterliegt dem Schweizer Datenschutzgesetz (nDSG). Wir verpflichten uns, deine persönlichen Daten zu schützen und verwenden sie nur in Übereinstimmung mit den geltenden Gesetzen.'}
            </p>

            <h2>{isEnglish ? 'Cookies & Analytics' : 'Cookies & Analytics'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'We use cookies and analytics tools to improve your experience on our website. Details about specific tools and how to opt-out will be provided in the full privacy policy.'
                : 'Wir verwenden Cookies und Analyse-Tools, um deine Erfahrung auf unserer Website zu verbessern. Details zu spezifischen Tools und Opt-out-Möglichkeiten werden in der vollständigen Datenschutzerklärung bereitgestellt.'}
            </p>

            <h2>{isEnglish ? 'Contact' : 'Kontakt'}</h2>
            <p className="text-muted-foreground">
              {isEnglish
                ? 'For any questions regarding data protection, please contact us at:'
                : 'Bei Fragen zum Datenschutz kontaktiere uns bitte unter:'}
            </p>
            <p>
              E-Mail: <a href="mailto:info@itsfeierabend.ch" className="text-primary hover:underline">info@itsfeierabend.ch</a>
            </p>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
