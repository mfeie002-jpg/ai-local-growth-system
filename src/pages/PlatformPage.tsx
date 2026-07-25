import { ArrowRight, Check, Info, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import {
  BreadcrumbSchema,
  FAQSchema,
  SEOHead,
  ServiceSchema,
} from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { LeadInquiryForm } from '@/components/forms/LeadInquiryForm';
import { useLanguage } from '@/i18n/LanguageContext';
import { localized, platformPages } from '@/content/platformPages';

interface PlatformPageProps {
  page: keyof typeof platformPages;
}

export default function PlatformPage({ page }: PlatformPageProps) {
  const definition = platformPages[page];
  const { language, isEnglish } = useLanguage();
  const lang = language === 'en' ? 'en' : 'de';
  const canonicalPath = isEnglish ? definition.slugEn : definition.slug;
  const title = localized(definition.title, lang);
  const description = localized(definition.description, lang);
  const primaryPath = isEnglish ? definition.primaryPathEn : definition.primaryPath;
  const secondaryPath = isEnglish ? definition.secondaryPathEn : definition.secondaryPath;

  return (
    <Layout>
      <SEOHead title={title} description={description} canonical={`https://itsfeierabend.ch${canonicalPath}`} />
      {definition.serviceSchema && <ServiceSchema name={title} description={description} />}
      <FAQSchema
        items={definition.faq.map((item) => ({
          question: localized(item.question, lang),
          answer: localized(item.answer, lang),
        }))}
      />
      <BreadcrumbSchema
        items={[
          {
            name: isEnglish ? 'Home' : 'Startseite',
            url: isEnglish ? 'https://itsfeierabend.ch/en' : 'https://itsfeierabend.ch/',
          },
          { name: title, url: `https://itsfeierabend.ch${canonicalPath}` },
        ]}
      />

      <section className="border-b border-border py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
                {localized(definition.eyebrow, lang)}
              </p>
              <h1 className="mt-5 max-w-5xl text-balance">{title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-sm rounded-md border border-border bg-card p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isEnglish ? 'Evidence standard' : 'Evidenzstandard'}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {(isEnglish
                    ? ['Measured', 'User-stated', 'Estimated', 'Expert review']
                    : ['Gemessen', 'Angegeben', 'Geschätzt', 'Expertenprüfung']
                  ).map((label) => (
                    <div key={label} className="rounded-sm border border-border px-3 py-2">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CTAButton variant="primary" size="lg" href={primaryPath} location={`${page}-hero`} className="min-h-12">
              {localized(definition.primaryCta, lang)}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </CTAButton>
            {definition.secondaryCta && secondaryPath && (
              <CTAButton variant="secondary" size="lg" href={secondaryPath} location={`${page}-hero-secondary`} className="min-h-12">
                {localized(definition.secondaryCta, lang)}
              </CTAButton>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              01 · {isEnglish ? 'Starting point' : 'Ausgangslage'}
            </p>
            <h2 className="mt-4 text-balance">
              {isEnglish ? 'First understand the constraint.' : 'Zuerst den Engpass verstehen.'}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="max-w-3xl text-xl leading-relaxed text-foreground/80">
              {localized(definition.intro, lang)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            02 · {localized(definition.deliverablesTitle, lang)}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance">
            {localized(definition.deliverablesTitle, lang)}
          </h2>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {definition.deliverables.map((item) => (
              <li key={localized(item, lang)} className="flex min-h-20 items-start gap-4 rounded-md border border-border bg-background p-5">
                <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <span className="leading-relaxed">{localized(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            03 · {localized(definition.processTitle, lang)}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance">
            {localized(definition.processTitle, lang)}
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {definition.process.map((step, index) => (
              <li key={localized(step.title, lang)} className="bg-background p-7">
                <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-2xl">{localized(step.title, lang)}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {localized(step.text, lang)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              04 · {localized(definition.audienceTitle, lang)}
            </p>
            <h2 className="mt-4 text-balance">{localized(definition.audienceTitle, lang)}</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {definition.audiences.map((audience) => (
                <li key={localized(audience, lang)} className="flex gap-4 py-5">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                  <span className="text-lg">{localized(audience, lang)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3 rounded-md border border-border bg-background p-5 text-sm leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
              <p>{localized(definition.evidenceNote, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {definition.inquiryType && (
        <section id={isEnglish ? 'enquiry' : 'anfrage'} className="scroll-mt-24 py-16 md:py-24">
          <div className="container-section grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                05 · {isEnglish ? 'Enquiry' : 'Anfrage'}
              </p>
              <h2 className="mt-4 text-balance">
                {definition.inquiryType === 'partner'
                  ? (isEnglish ? 'Check partner fit.' : 'Partner-Fit prüfen.')
                  : (isEnglish ? 'Describe the question.' : 'Frage kurz einordnen.')}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <LeadInquiryForm type={definition.inquiryType} />
            </div>
          </div>
        </section>
      )}

      <section className={definition.inquiryType ? 'border-t border-border py-16 md:py-24' : 'py-16 md:py-24'}>
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {definition.inquiryType ? '06' : '05'} · FAQ
            </p>
            <h2 className="mt-4">{isEnglish ? 'Clear answers.' : 'Klare Antworten.'}</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {definition.faq.map((item) => (
                <li key={localized(item.question, lang)}>
                  <details className="group">
                    <summary className="flex min-h-16 cursor-pointer list-none items-start justify-between gap-4 py-5">
                      <span className="text-lg">{localized(item.question, lang)}</span>
                      <Plus className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">
                      {localized(item.answer, lang)}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <div className="container-section rounded-md border border-border bg-card p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
                {isEnglish ? 'Next step' : 'Nächster Schritt'}
              </p>
              <h2 className="mt-4 max-w-3xl text-balance">
                {isEnglish
                  ? 'Turn the current question into an evidence-backed next action.'
                  : 'Aus der aktuellen Frage eine belegte nächste Massnahme machen.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <CTAButton variant="primary" size="lg" href={primaryPath} location={`${page}-final`} className="min-h-12">
                {localized(definition.primaryCta, lang)}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
