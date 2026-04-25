import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Mail, MapPin, Globe, Building2 } from 'lucide-react';

export default function ImprintPage() {
  const { isEnglish } = useLanguage();

  const sections = [
    {
      num: '01',
      icon: Building2,
      title: isEnglish ? 'Company' : 'Unternehmen',
      content: (
        <div className="space-y-2">
          <p className="font-editorial text-3xl font-semibold text-foreground">itsFeierabend.ch</p>
          <p className="text-muted-foreground">
            {isEnglish ? 'AI-Powered Digital Marketing Agency' : 'KI-gestützte Digital Marketing Agentur'}
          </p>
        </div>
      ),
    },
    {
      num: '02',
      icon: MapPin,
      title: isEnglish ? 'Location' : 'Standort',
      content: <p className="text-muted-foreground text-lg">{isEnglish ? 'Switzerland' : 'Schweiz'}</p>,
    },
    {
      num: '03',
      icon: Mail,
      title: isEnglish ? 'Contact' : 'Kontakt',
      content: (
        <a href="mailto:info@itsfeierabend.ch" className="text-aurora font-editorial text-lg hover:opacity-80 transition-opacity">
          info@itsfeierabend.ch
        </a>
      ),
    },
    {
      num: '04',
      icon: Globe,
      title: isEnglish ? 'Website' : 'Webseite',
      content: (
        <a href="https://itsfeierabend.ch" className="text-aurora font-editorial text-lg hover:opacity-80 transition-opacity">
          itsfeierabend.ch
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Imprint | Legal Information' : 'Impressum | Rechtliche Informationen'}
        description={isEnglish ? 'Legal imprint and company information for itsFeierabend.ch.' : 'Impressum und Unternehmensinformationen für itsFeierabend.ch.'}
        noIndex
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Legal / 01' : 'Rechtlich / 01'}
                </span>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-9">
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                {isEnglish ? <>Imprint.</> : <>Impressum.</>}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                {isEnglish
                  ? 'Required disclosures under Swiss law (Art. 5 nFADP).'
                  : 'Pflichtangaben nach Schweizer Recht (Art. 5 nDSG).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info grid */}
      <section className="py-20 sm:py-28">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/60 border border-border/60 max-w-5xl mx-auto">
            {sections.map((s) => (
              <div key={s.num} className="bg-card/40 backdrop-blur-sm p-8 sm:p-10 group hover:bg-card/60 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                    {s.num}
                  </span>
                  <s.icon className="w-5 h-5 text-primary opacity-60" />
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold mb-4 text-foreground">{s.title}</h2>
                {s.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-6 lg:gap-12 max-w-5xl mx-auto">
            <aside className="col-span-12 lg:col-span-3">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {isEnglish ? 'Section / 02' : 'Abschnitt / 02'}
              </span>
              <h2 className="mt-3 font-editorial text-3xl sm:text-4xl font-bold leading-tight">
                {isEnglish ? 'Disclaimer.' : 'Haftung.'}
              </h2>
            </aside>

            <div className="col-span-12 lg:col-span-9 space-y-10">
              {[
                {
                  title: isEnglish ? 'Liability for Content' : 'Haftung für Inhalte',
                  text: isEnglish
                    ? 'The contents of our pages have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own content on these pages under general laws.'
                    : 'Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.',
                },
                {
                  title: isEnglish ? 'Liability for Links' : 'Haftung für Links',
                  text: isEnglish
                    ? 'Our website contains links to external websites of third parties, over whose contents we have no influence. Therefore, we cannot assume any liability for these external contents.'
                    : 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.',
                },
                {
                  title: isEnglish ? 'Copyright' : 'Urheberrecht',
                  text: isEnglish
                    ? 'The content and works on these pages are subject to Swiss copyright law. Duplication, processing, distribution, or commercialization beyond copyright law requires prior written consent.'
                    : 'Die Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Vervielfältigung und Verbreitung bedürfen der schriftlichen Zustimmung.',
                },
                {
                  title: isEnglish ? 'Applicable Law' : 'Anwendbares Recht',
                  text: isEnglish
                    ? 'Swiss law applies exclusively. The place of jurisdiction is Switzerland.'
                    : 'Es gilt ausschliesslich schweizerisches Recht. Gerichtsstand ist die Schweiz.',
                },
              ].map((item, i) => (
                <div key={i} className="border-l border-border/60 pl-6">
                  <h3 className="font-editorial text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}

              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase pt-6 border-t border-border/60">
                {isEnglish ? 'Last updated · December 2024' : 'Zuletzt aktualisiert · Dezember 2024'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
