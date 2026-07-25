import { AlertTriangle, Building2, Globe, Mail, MapPin, UserRound } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { siteConfig } from '@/config/site';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ImprintPage() {
  const { isEnglish } = useLanguage();

  const sections = [
    {
      num: '01',
      icon: Building2,
      title: isEnglish ? 'Brand and website' : 'Marke und Website',
      content: (
        <div className="space-y-2">
          <p className="font-editorial text-3xl font-semibold text-foreground">itsFeierabend.ch</p>
          <p className="text-muted-foreground">
            {isEnglish
              ? 'Digital business diagnostics, website, SEO and AI-visibility analysis, and implementation consulting.'
              : 'Digitale Unternehmensdiagnosen, Website-, SEO- und AI-Visibility-Analysen sowie Umsetzungsberatung.'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isEnglish
              ? 'itsFeierabend.ch is a brand and domain name. It is not a verified legal entity name.'
              : 'itsFeierabend.ch ist eine Marken- und Domainbezeichnung, keine verifizierte juristische Firmierung.'}
          </p>
        </div>
      ),
    },
    {
      num: '02',
      icon: MapPin,
      title: isEnglish ? 'Registered address' : 'Postanschrift',
      content: (
        <p className="text-muted-foreground text-lg">
          {isEnglish ? 'Not yet verified or approved for publication.' : 'Noch nicht verifiziert oder zur Publikation freigegeben.'}
        </p>
      ),
    },
    {
      num: '03',
      icon: Mail,
      title: isEnglish ? 'Contact' : 'Kontakt',
      content: (
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-aurora font-editorial text-lg transition-opacity hover:opacity-80"
        >
          {siteConfig.email}
        </a>
      ),
    },
    {
      num: '04',
      icon: Globe,
      title: isEnglish ? 'Website' : 'Webseite',
      content: (
        <a
          href={siteConfig.siteUrl}
          className="text-aurora font-editorial text-lg transition-opacity hover:opacity-80"
        >
          itsfeierabend.ch
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Imprint | Provider information' : 'Impressum | Anbieterinformationen'}
        description={
          isEnglish
            ? 'Provider and contact information for itsFeierabend.ch, including clearly marked outstanding legal details.'
            : 'Anbieter- und Kontaktinformationen für itsFeierabend.ch mit transparent gekennzeichneten offenen Pflichtangaben.'
        }
        noIndex
      />

      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {isEnglish ? 'Provider / 01' : 'Anbieter / 01'}
                </span>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-9">
              <h1 className="font-editorial text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                {isEnglish ? 'Imprint.' : 'Impressum.'}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {isEnglish
                  ? 'Provider information must be based on verified facts. Missing facts are shown as launch blockers instead of being invented.'
                  : 'Anbieterangaben müssen auf verifizierten Fakten beruhen. Fehlende Angaben werden als Launch-Blocker ausgewiesen, nicht erfunden.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-section">
          <div className="mx-auto mb-10 max-w-5xl border border-destructive/40 bg-destructive/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-destructive" aria-hidden="true" />
              <div>
                <h2 className="font-editorial text-2xl font-semibold">
                  {isEnglish ? 'Launch blocker: provider details incomplete' : 'Launch-Blocker: Anbieterangaben unvollständig'}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {isEnglish
                    ? 'The repository does not contain an approved legal entity name, legal form, postal address, Swiss UID/company-register number or authorised representative. These facts must be supplied and verified before this page can be treated as a complete imprint.'
                    : 'Im Repository sind weder freigegebene juristische Firmierung und Rechtsform noch Postanschrift, Schweizer UID-/Handelsregisterangabe oder vertretungsberechtigte Person hinterlegt. Diese Fakten müssen vor dem Launch ergänzt und verifiziert werden.'}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {isEnglish
                    ? 'This notice documents an operational gap. It is not legal advice or confirmation that the page meets every applicable requirement.'
                    : 'Dieser Hinweis dokumentiert eine operative Lücke. Er ist keine Rechtsberatung und keine Bestätigung, dass die Seite sämtliche anwendbaren Anforderungen erfüllt.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px border border-border/60 bg-border/60 md:grid-cols-2">
            {sections.map((section) => (
              <div key={section.num} className="group bg-card/40 p-8 backdrop-blur-sm transition-colors hover:bg-card/60 sm:p-10">
                <div className="mb-6 flex items-start justify-between">
                  <span className="font-editorial text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {section.num}
                  </span>
                  <section.icon className="h-5 w-5 text-primary opacity-60" aria-hidden="true" />
                </div>
                <h2 className="mb-4 font-editorial text-2xl font-semibold text-foreground sm:text-3xl">
                  {section.title}
                </h2>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="mx-auto grid max-w-5xl grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3">
              <UserRound className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-editorial text-3xl font-bold leading-tight sm:text-4xl">
                {isEnglish ? 'Accountability.' : 'Verantwortung.'}
              </h2>
            </aside>
            <div className="col-span-12 space-y-8 lg:col-span-9">
              <div className="border-l border-border/60 pl-6">
                <h3 className="mb-3 font-editorial text-xl font-semibold">
                  {isEnglish ? 'Responsible person' : 'Inhaltlich verantwortliche Person'}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? 'Not yet verified or approved for publication. Adding the responsible person is part of the launch blocker above.'
                    : 'Noch nicht verifiziert oder zur Publikation freigegeben. Die Ergänzung ist Teil des oben ausgewiesenen Launch-Blockers.'}
                </p>
              </div>

              <div className="border-l border-border/60 pl-6">
                <h3 className="mb-3 font-editorial text-xl font-semibold">
                  {isEnglish ? 'External links and content' : 'Externe Links und Inhalte'}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? 'External sources are identified where they are used. Their availability and content remain the responsibility of the respective providers. Errors on this website can be reported using the contact address above.'
                    : 'Externe Quellen werden dort gekennzeichnet, wo sie verwendet werden. Für Verfügbarkeit und Inhalt bleiben die jeweiligen Anbieter verantwortlich. Fehler auf dieser Website können über die oben genannte Kontaktadresse gemeldet werden.'}
                </p>
              </div>

              <div className="border-l border-border/60 pl-6">
                <h3 className="mb-3 font-editorial text-xl font-semibold">
                  {isEnglish ? 'Copyright' : 'Urheberrecht'}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? 'Unless otherwise indicated, original texts, designs and code published by itsFeierabend.ch may not be reused beyond applicable legal permissions without prior approval.'
                    : 'Soweit nicht anders gekennzeichnet, dürfen von itsFeierabend.ch veröffentlichte eigene Texte, Designs und Codes ausserhalb gesetzlicher Erlaubnisse nur mit vorgängiger Zustimmung weiterverwendet werden.'}
                </p>
              </div>

              <p className="border-t border-border/60 pt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {isEnglish ? 'Content reviewed · 25 July 2026' : 'Inhaltlich geprüft · 25. Juli 2026'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
