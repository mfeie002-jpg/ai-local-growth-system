import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { Mail, MapPin, Globe, Building2 } from 'lucide-react';

export default function ImprintPage() {
  const { isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Imprint | Legal Information' : 'Impressum | Rechtliche Informationen'}
        description={isEnglish 
          ? 'Legal imprint and company information for itsFeierabend.ch - AI-powered digital marketing agency in Switzerland.' 
          : 'Impressum und Unternehmensinformationen für itsFeierabend.ch - KI-gestützte Digital Marketing Agentur in der Schweiz.'}
        noIndex
      />

      <SectionContainer padding="large">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-8">{isEnglish ? 'Imprint' : 'Impressum'}</h1>
          
          <div className="prose prose-neutral max-w-none">
            {/* Company Information */}
            <section className="mb-10">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Company Information' : 'Angaben gemäss Art. 5 DSG'}
                  </h2>
                  <div className="text-foreground space-y-1">
                    <p className="font-semibold text-lg mb-2">itsFeierabend.ch</p>
                    <p className="text-muted-foreground">
                      {isEnglish 
                        ? 'AI-Powered Digital Marketing Agency' 
                        : 'KI-gestützte Digital Marketing Agentur'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="mb-10">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Location' : 'Standort'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEnglish ? 'Switzerland' : 'Schweiz'}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Contact' : 'Kontakt'}
                  </h2>
                  <p className="mb-2">
                    <span className="text-muted-foreground">E-Mail: </span>
                    <a 
                      href="mailto:info@itsfeierabend.ch" 
                      className="text-primary hover:underline"
                    >
                      info@itsfeierabend.ch
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Website */}
            <section className="mb-10">
              <div className="flex items-start gap-3 mb-4">
                <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3 mt-0">
                    {isEnglish ? 'Website' : 'Webseite'}
                  </h2>
                  <p>
                    <a 
                      href="https://itsfeierabend.ch" 
                      className="text-primary hover:underline"
                    >
                      https://itsfeierabend.ch
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                {isEnglish ? 'Disclaimer' : 'Haftungsausschluss'}
              </h2>
              
              <h3 className="text-lg font-medium mb-2 mt-6">
                {isEnglish ? 'Liability for Content' : 'Haftung für Inhalte'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isEnglish 
                  ? 'The contents of our pages have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own content on these pages under general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.'
                  : 'Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'}
              </p>

              <h3 className="text-lg font-medium mb-2 mt-6">
                {isEnglish ? 'Liability for Links' : 'Haftung für Links'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isEnglish 
                  ? 'Our website contains links to external websites of third parties, over whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.'
                  : 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'}
              </p>

              <h3 className="text-lg font-medium mb-2 mt-6">
                {isEnglish ? 'Copyright' : 'Urheberrecht'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isEnglish 
                  ? 'The content and works created by the site operators on these pages are subject to Swiss copyright law. Duplication, processing, distribution, or any form of commercialization of such material beyond the scope of copyright law requires the prior written consent of its respective author or creator.'
                  : 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.'}
              </p>
            </section>

            {/* Applicable Law */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                {isEnglish ? 'Applicable Law' : 'Anwendbares Recht'}
              </h2>
              <p className="text-muted-foreground">
                {isEnglish 
                  ? 'Swiss law applies exclusively. The place of jurisdiction is Switzerland.'
                  : 'Es gilt ausschliesslich schweizerisches Recht. Gerichtsstand ist die Schweiz.'}
              </p>
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
