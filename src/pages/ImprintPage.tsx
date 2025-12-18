import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { AlertTriangle } from 'lucide-react';

export default function ImprintPage() {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title={t.legal.imprint.title}
        description={isEnglish ? 'Legal imprint for itsFeierabend.ch' : 'Impressum von itsFeierabend.ch'}
        noIndex
      />

      <SectionContainer padding="large">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-8">{t.legal.imprint.title}</h1>
          
          <div className="bg-accent border border-border rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">
                  {isEnglish ? 'Placeholder Content' : 'Platzhalter-Inhalt'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.legal.imprint.note}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <div className="bg-muted rounded-lg p-6 font-mono text-sm">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {t.legal.imprint.placeholder}
              </p>
            </div>

            <h2 className="mt-8">{isEnglish ? 'Contact' : 'Kontakt'}</h2>
            <p>
              E-Mail: <a href="mailto:info@itsfeierabend.ch" className="text-primary hover:underline">info@itsfeierabend.ch</a>
            </p>
            <p>{isEnglish ? 'Location: Switzerland' : 'Standort: Schweiz'}</p>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
