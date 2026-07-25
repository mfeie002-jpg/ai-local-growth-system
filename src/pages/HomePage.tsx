import { ArrowRight, ArrowUpRight, Check, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CTAButton } from '@/components/CTAButton';
import {
  FAQSchema,
  OrganizationSchema,
  SEOHead,
  WebsiteSchema,
} from '@/components/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';

const auditAreas = {
  de: [
    ['Website & Technik', 'öffentlich messbar'],
    ['SEO & lokale Sichtbarkeit', 'teilweise messbar'],
    ['AI Search Visibility', 'beobachtbar'],
    ['Conversion & Vertrauen', 'messbar + Kontext'],
    ['Tracking, CRM & Automation', 'Kontext + Prüfung'],
  ],
  en: [
    ['Website & technical health', 'publicly measurable'],
    ['SEO & local visibility', 'partly measurable'],
    ['AI Search Visibility', 'observable'],
    ['Conversion & trust', 'measurement + context'],
    ['Tracking, CRM & automation', 'context + review'],
  ],
};

const businessQuestions = {
  de: [
    'Warum entstehen aus bestehendem Traffic zu wenige qualifizierte Anfragen?',
    'Welche SEO- oder AI-Visibility-Lücke hat tatsächlich Geschäftswert?',
    'Wo gehen Leads zwischen Formular, CRM und Follow-up verloren?',
    'Welcher Hebel sollte zuerst umgesetzt werden – und welcher kann warten?',
  ],
  en: [
    'Why does existing traffic produce too few qualified enquiries?',
    'Which SEO or AI visibility gap has real commercial value?',
    'Where are leads lost between form, CRM and follow-up?',
    'Which action should be implemented first—and which can wait?',
  ],
};

const method = {
  de: [
    ['Erfassen', 'Öffentliche Signale und freiwillige Geschäftsdaten bleiben getrennt.'],
    ['Normalisieren', 'Jeder Befund erhält Quelle, Konfidenz und einen definierten Wertebereich.'],
    ['Bewerten', 'Deterministische Regeln berechnen Kategorien und Gesamtscore.'],
    ['Priorisieren', 'Der Quick Audit priorisiert regelbasiert nach gewichteten Lücken. KI- und Experteneinordnung folgt nur im vertieften Audit.'],
  ],
  en: [
    ['Collect', 'Public signals and voluntary business inputs remain separate.'],
    ['Normalize', 'Every finding receives a source, confidence and defined range.'],
    ['Score', 'Deterministic rules calculate category and overall scores.'],
    ['Prioritize', 'The Quick Audit ranks weighted gaps by deterministic rules. AI and expert interpretation are reserved for a deeper audit.'],
  ],
};

const offerLadder = {
  de: [
    ['01', 'Kostenloser Quick Audit', 'Vorläufiger Befund, Reifegrad und drei bis fünf priorisierte Massnahmen.'],
    ['02', 'Vertiefter Audit', 'Website, SEO, AI Visibility oder digitale Geschäftslage mit freigegebenen Datenzugängen.'],
    ['03', 'Growth Sprint', 'Klar abgegrenzte Umsetzung der wichtigsten Hebel mit Abnahmekriterien.'],
    ['04', 'Laufende Optimierung', 'SEO, AI Visibility, Conversion, Analytics und Reporting nach vereinbartem Umfang.'],
    ['05', 'Partner-Modell', 'Referral und Co-Delivery; White Label erst nach erfolgreichem Pilot.'],
  ],
  en: [
    ['01', 'Free Quick Audit', 'Preliminary findings, maturity level and three to five prioritized actions.'],
    ['02', 'Deep Audit', 'Website, SEO, AI visibility or digital business analysis with approved data access.'],
    ['03', 'Growth Sprint', 'Tightly scoped implementation of the most important actions with acceptance criteria.'],
    ['04', 'Ongoing optimization', 'SEO, AI visibility, conversion, analytics and reporting within an agreed scope.'],
    ['05', 'Partner model', 'Referral and co-delivery; white label only after a successful pilot.'],
  ],
};

const faqs = {
  de: [
    {
      question: 'Was ist itsFeierabend.ch?',
      answer: 'itsFeierabend.ch ist eine eigenständige Schweizer Plattform für AI Business Audits und digitale Wachstumsdiagnose. Sie analysiert Sichtbarkeit, Website, Conversion, Tracking, CRM und Automatisierung – nicht Räumung, Reinigung oder Umzug.',
    },
    {
      question: 'Ist der kostenlose Audit eine Fake-AI-Demo?',
      answer: 'Nein. Öffentlich messbare Signale werden regelbasiert bewertet. Selbstangaben, Schätzungen und manuell zu prüfende Punkte werden sichtbar getrennt. Wenn ein Scan technisch nicht möglich ist, wird der Report als vorläufig und teilweise gekennzeichnet.',
    },
    {
      question: 'Wer ist die primäre Zielgruppe?',
      answer: 'Etablierte, inhabergeführte Schweizer Dienstleistungs- und B2B-KMU mit wertvollen Leads, aber schwacher Messung, lokaler Sichtbarkeit oder Nachbearbeitung. Agenturen und IT-Dienstleister sind ein sekundärer Partnerkanal.',
    },
    {
      question: 'Gibt es feste Preise?',
      answer: 'Für den kostenlosen Quick Audit nicht. Vertiefte Audits, Sprints und Betreuung werden nach bestätigtem Umfang offeriert. Ohne Freigabe werden keine konkreten Preise veröffentlicht.',
    },
    {
      question: 'Garantiert AI Visibility eine Nennung in ChatGPT?',
      answer: 'Nein. Keine Agentur kann Nennungen oder Rankings in ChatGPT, Google AI Overviews oder anderen Antwortsystemen garantieren. Optimiert werden nachvollziehbare Grundlagen wie Entity-Klarheit, Zugänglichkeit, Fakten, Quellen und semantische Abdeckung.',
    },
  ],
  en: [
    {
      question: 'What is itsFeierabend.ch?',
      answer: 'itsFeierabend.ch is an independent Swiss platform for AI business audits and digital growth diagnostics. It analyses visibility, websites, conversion, tracking, CRM and automation—not clearance, cleaning or moving services.',
    },
    {
      question: 'Is the free audit a fake AI demo?',
      answer: 'No. Publicly measurable signals are scored by rules. User inputs, estimates and items requiring expert review are clearly separated. If a technical scan is not possible, the report is labelled preliminary and partial.',
    },
    {
      question: 'Who is the primary audience?',
      answer: 'Established, owner-led Swiss service and B2B SMEs with valuable leads but weak measurement, local visibility or follow-up. Agencies and IT providers are a secondary partner channel.',
    },
    {
      question: 'Are there fixed prices?',
      answer: 'The Quick Audit is free. Deep audits, sprints and ongoing support are proposed after scope is confirmed. No specific prices are published without approval.',
    },
    {
      question: 'Does AI visibility guarantee a mention in ChatGPT?',
      answer: 'No. No agency can guarantee mentions or rankings in ChatGPT, Google AI Overviews or other answer systems. We optimize explainable foundations such as entity clarity, accessibility, facts, sources and semantic coverage.',
    },
  ],
};

export default function HomePage() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? 'en' : 'de';
  const auditPath = isEnglish ? '/en/audit' : '/audit';
  const auditLandingPath = isEnglish ? '/en/ai-business-audit' : '/ai-business-audit';
  const servicesPath = isEnglish ? '/en/services' : '/leistungen';
  const casesPath = isEnglish ? '/en/case-studies' : '/fallstudien';
  const partnerPath = isEnglish ? '/en/partners' : '/partner';
  const faqItems = faqs[lang];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'AI Business Audit for Swiss SMEs' : 'AI Business Audit für Schweizer KMU'}
        description={isEnglish
          ? 'Evidence-based digital business audits for visibility, leads, conversion, tracking, CRM and automation. Start with a free Quick Audit.'
          : 'Evidenzbasierte digitale Standortbestimmung für Sichtbarkeit, Leads, Conversion, Tracking, CRM und Automatisierung. Start mit kostenlosem Quick Audit.'}
        canonical={isEnglish ? 'https://itsfeierabend.ch/en' : 'https://itsfeierabend.ch/'}
      />
      <OrganizationSchema
        description={isEnglish
          ? 'Swiss platform for AI business audits and digital growth diagnostics.'
          : 'Schweizer Plattform für AI Business Audits und digitale Wachstumsdiagnose.'}
      />
      <WebsiteSchema />
      <FAQSchema items={faqItems} />

      <section className="border-b border-border pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="container-section">
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="rounded-md border border-border bg-card p-7 sm:p-10 lg:col-span-8 lg:min-h-[560px] lg:p-12">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-background px-3">
                    <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {isEnglish ? 'Swiss digital business diagnostic' : 'Schweizer digitale Geschäftsdiagnose'}
                    </span>
                  </div>
                  <h1 className="mt-8 max-w-5xl text-balance">
                    {isEnglish
                      ? 'See where your digital business is losing potential.'
                      : 'Sehen, wo Ihr digitales Geschäft Potenzial verliert.'}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {isEnglish
                      ? 'itsFeierabend.ch analyses visibility, websites, conversion, tracking, CRM and automation—and turns the evidence into a prioritized next step.'
                      : 'itsFeierabend.ch analysiert Sichtbarkeit, Website, Conversion, Tracking, CRM und Automatisierung – und macht aus den Befunden einen priorisierten nächsten Schritt.'}
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <CTAButton variant="primary" size="lg" href={auditPath} location="hero" className="min-h-12">
                    {isEnglish ? 'Start the free Business Audit' : 'Kostenlosen Business Audit starten'}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <a
                    href="#methodik"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground/40 px-8 py-4 text-base font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {isEnglish ? 'How it works' : 'So funktioniert’s'}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-6 sm:p-8 lg:col-span-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {isEnglish ? 'Audit map' : 'Audit-Landkarte'}
                </p>
                <span className="rounded-full border border-signal/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-signal">
                  {isEnglish ? 'Evidence first' : 'Evidenz zuerst'}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {auditAreas[lang].map(([area, evidence], index) => (
                  <li key={area} className="rounded-sm border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="font-medium">{area}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{evidence}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                {isEnglish
                  ? 'No sample score is presented as a real measurement.'
                  : 'Kein Beispiel-Score wird als echte Messung dargestellt.'}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(isEnglish
              ? ['Rule-based scores', 'Visible evidence', 'No purchase obligation', 'Built in Switzerland']
              : ['Regelbasierte Scores', 'Sichtbare Evidenz', 'Keine Kaufpflicht', 'In der Schweiz gebaut']
            ).map((claim) => (
              <div key={claim} className="flex min-h-20 items-end rounded-md border border-border bg-card p-4">
                <span className="text-sm font-medium">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              01 · {isEnglish ? 'Business questions' : 'Geschäftsfragen'}
            </p>
            <h2 className="mt-4 text-balance">
              {isEnglish ? 'More traffic is not always the answer.' : 'Mehr Traffic ist nicht immer die Antwort.'}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {businessQuestions[lang].map((question) => (
                <li key={question} className="flex gap-4 py-6">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                  <span className="text-lg leading-relaxed md:text-xl">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="methodik" className="scroll-mt-24 border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                02 · {isEnglish ? 'Methodology' : 'Methodik'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish
                  ? 'The Quick Audit scores evidence by rule—not by AI guesswork.'
                  : 'Der Quick Audit bewertet Evidenz regelbasiert – nicht per KI-Schätzung.'}
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {isEnglish
                  ? 'The free result covers static, publicly accessible homepage signals. Business inputs are captured separately; AI and expert interpretation begin only in a deeper, agreed audit.'
                  : 'Das kostenlose Resultat deckt statische, öffentlich erreichbare Homepage-Signale ab. Geschäftsangaben bleiben separat; KI- und Experteneinordnung beginnt erst in einem vereinbarten vertieften Audit.'}
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={auditLandingPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'Full audit methodology' : 'Vollständige Audit-Methodik'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {method[lang].map(([title, text], index) => (
              <li key={title} className="bg-background p-7">
                <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              03 · {isEnglish ? 'Example output' : 'Beispiel-Ausgabe'}
            </p>
            <h2 className="mt-4 text-balance">
              {isEnglish ? 'A result you can act on.' : 'Ein Resultat, mit dem Sie arbeiten können.'}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {isEnglish
                ? 'This illustration shows the structure of a report, not findings for a real company.'
                : 'Diese Darstellung zeigt die Struktur eines Reports – keine Befunde eines realen Unternehmens.'}
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-md border border-border bg-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isEnglish ? 'Report structure' : 'Reportstruktur'}
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {isEnglish ? 'Illustration · no measured score' : 'Illustration · kein Messwert'}
                </span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(isEnglish
                  ? [
                      ['Strength', 'Clear service pages'],
                      ['Risk', 'Attribution gap'],
                      ['Opportunity', 'Faster lead routing'],
                    ]
                  : [
                      ['Stärke', 'Klare Leistungsseiten'],
                      ['Risiko', 'Lücke in der Attribution'],
                      ['Chance', 'Schnelleres Lead-Routing'],
                    ]
                ).map(([label, text]) => (
                  <div key={label} className="rounded-sm border border-border bg-background p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{label}</p>
                    <p className="mt-3 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {(isEnglish
                  ? [
                      ['High', 'Fix the measurable conversion break first.'],
                      ['Medium', 'Connect source, lead status and outcome.'],
                      ['Review', 'Validate CRM and analytics data with approved access.'],
                    ]
                  : [
                      ['Hoch', 'Zuerst den messbaren Conversion-Bruch beheben.'],
                      ['Mittel', 'Quelle, Lead-Status und Ergebnis verbinden.'],
                      ['Prüfen', 'CRM- und Analytics-Daten mit freigegebenem Zugriff validieren.'],
                    ]
                ).map(([priority, action]) => (
                  <li key={action} className="flex gap-4 py-4">
                    <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wider text-signal">{priority}</span>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                04 · {isEnglish ? 'Audience' : 'Zielgruppe'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish
                  ? 'Built for SMEs where one qualified lead matters.'
                  : 'Für KMU, bei denen eine qualifizierte Anfrage zählt.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={isEnglish ? '/en/for-smes' : '/fuer-kmu'}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'Audience criteria' : 'Zielgruppen-Kriterien'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(isEnglish
              ? [
                  ['Primary', 'Owner-led Swiss service and B2B SMEs with valuable leads and weak measurement or follow-up.'],
                  ['Secondary', 'Property, renovation, consulting and practice businesses with local or complex demand.'],
                  ['Partner', 'Agencies, consultants and IT providers needing an independent diagnostic layer.'],
                ]
              : [
                  ['Primär', 'Inhabergeführte Schweizer Dienstleistungs- und B2B-KMU mit wertvollen Leads und schwacher Messung oder Nachbearbeitung.'],
                  ['Sekundär', 'Immobilien-, Renovations-, Beratungs- und Praxisbetriebe mit lokaler oder erklärungsbedürftiger Nachfrage.'],
                  ['Partner', 'Agenturen, Berater und IT-Dienstleister mit Bedarf an einer unabhängigen Diagnoseebene.'],
                ]
            ).map(([label, text]) => (
              <div key={label} className="rounded-md border border-border bg-background p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">{label}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                05 · {isEnglish ? 'Offer ladder' : 'Angebotsleiter'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish ? 'Start with evidence. Expand only when it makes sense.' : 'Mit Evidenz starten. Nur sinnvoll erweitern.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={servicesPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'All services' : 'Alle Leistungen'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {offerLadder[lang].map(([number, title, text]) => (
              <li key={number} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline">
                <span className="font-mono text-xs text-signal sm:col-span-1">{number}</span>
                <h3 className="text-2xl sm:col-span-4">{title}</h3>
                <p className="leading-relaxed text-muted-foreground sm:col-span-7">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
            {isEnglish
              ? 'Deep audits, projects and retainers are proposed only after scope is confirmed. No unapproved prices are published.'
              : 'Vertiefte Audits, Projekte und Betreuung werden erst nach bestätigtem Umfang offeriert. Es werden keine ungeprüften Preise veröffentlicht.'}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                06 · {isEnglish ? 'Method in practice' : 'Methodik in der Praxis'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish ? 'A real product case. No invented performance claims.' : 'Ein reales Produktbeispiel. Keine erfundenen Resultate.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={casesPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'View case notes' : 'Projektkontexte ansehen'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <article className="mt-10 rounded-md border border-border bg-background p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
              {isEnglish ? 'Product build' : 'Produktaufbau'}
            </p>
            <h3 className="mt-4 text-3xl">itsFeierabend Quick Audit</h3>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              {isEnglish
                ? 'The live product demonstrates deterministic scoring, explicit evidence states and a private result flow. Client and connected-project cases remain unpublished until facts, baselines and permission are documented.'
                : 'Das eigene Produkt zeigt deterministisches Scoring, sichtbare Evidenzzustände und einen privaten Resultat-Flow. Kunden- und verbundene Projekte bleiben unveröffentlicht, bis Fakten, Baseline und Freigabe dokumentiert sind.'}
            </p>
          </article>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              07 · FAQ
            </p>
            <h2 className="mt-4">{isEnglish ? 'Questions before the audit.' : 'Fragen vor dem Audit.'}</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {faqItems.map((item) => (
                <li key={item.question}>
                  <details className="group">
                    <summary className="flex min-h-16 cursor-pointer list-none items-start justify-between gap-4 py-5">
                      <span className="text-lg">{item.question}</span>
                      <Plus className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">{item.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <div className="container-section">
          <div className="rounded-md border border-border bg-card p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
                  {isEnglish ? 'Start with the current state' : 'Mit der Standortbestimmung starten'}
                </p>
                <h2 className="mt-4 max-w-4xl text-balance">
                  {isEnglish
                    ? 'Find the strongest digital lever before investing in more activity.'
                    : 'Den stärksten digitalen Hebel finden, bevor mehr Aktivität bezahlt wird.'}
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                  {isEnglish
                    ? 'The Quick Audit is free. It produces a preliminary, clearly labelled result and a practical next step.'
                    : 'Der Quick Audit ist kostenlos. Er liefert ein vorläufiges, klar gekennzeichnetes Ergebnis und einen praktischen nächsten Schritt.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                <CTAButton variant="primary" size="lg" href={auditPath} location="final" className="min-h-12">
                  {isEnglish ? 'Start the free Business Audit' : 'Kostenlosen Business Audit starten'}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <Link
                  to={partnerPath}
                  className="inline-flex min-h-12 items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  {isEnglish ? 'Partner enquiry' : 'Partneranfrage'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
