import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, OrganizationSchema, WebsiteSchema } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowUpRight, ArrowRight, Check, Plus } from 'lucide-react';
import {
  EditorialHero,
  SectionMarker,
  SignalStream,
  ScoreCard,
  AIAnnotation,
  RevealText,
} from '@/components/neural';

/**
 * HomePage — Audit-first Lead Generation.
 * 11 sections: hero → trust → problem → audit-engine → ultimate →
 * services → process → cases → pricing → faq → final CTA.
 * Sie-Ansprache DE, no fabricated metrics.
 */
export default function HomePage() {
  const { t, isEnglish } = useLanguage();
  const auditPath = isEnglish ? '/en/audit' : '/audit';
  const callPath = isEnglish ? '/en/free-call' : '/gratis-call';
  const ultimatePath = isEnglish ? '/en/ultimate-package' : '/ultimate-package';
  const casesPath = isEnglish ? '/en/case-studies' : '/fallstudien';
  const pricingPath = isEnglish ? '/en/pricing' : '/pakete';

  // ---- 03 Diagnose fields ----
  const diagnostics = isEnglish
    ? [
        { num: '01', k: 'Technical', v: 'Speed, Core Web Vitals, indexability, mobile fitness — the invisible ceiling.' },
        { num: '02', k: 'Content',   v: 'Positioning, clarity, keyword-to-page fit, information architecture.' },
        { num: '03', k: 'Trust',     v: 'Reviews, imprint, real people, verifiable proof — Swiss standards.' },
        { num: '04', k: 'Conversion', v: 'Forms, CTAs, friction, response times — the leaks between visit and lead.' },
        { num: '05', k: 'Automation', v: 'Lead routing, follow-up, AI-readiness — leverage you don\'t have yet.' },
      ]
    : [
        { num: '01', k: 'Technik',      v: 'Speed, Core Web Vitals, Indexierbarkeit, Mobile-Fitness — die unsichtbare Decke.' },
        { num: '02', k: 'Content',      v: 'Positionierung, Klarheit, Keyword-zu-Seite-Passung, Informationsarchitektur.' },
        { num: '03', k: 'Vertrauen',    v: 'Bewertungen, Impressum, echte Menschen, prüfbarer Proof — Schweizer Standard.' },
        { num: '04', k: 'Conversion',   v: 'Formulare, CTAs, Reibung, Reaktionszeiten — die Lecks zwischen Besuch und Lead.' },
        { num: '05', k: 'Automation',   v: 'Lead-Routing, Follow-up, KI-Reife — Hebel, den Sie noch nicht nutzen.' },
      ];

  // ---- 04 Audit engine stages ----
  const stages = isEnglish
    ? ['Collect', 'Normalize', 'Score', 'Interpret']
    : ['Erfassen', 'Normalisieren', 'Bewerten', 'Interpretieren'];

  // ---- 05 Ultimate bullets ----
  const ultimateBullets = isEnglish
    ? [
        'The full AI scan of your digital presence',
        'A prioritized roadmap — impact over effort, not opinions',
        'Implementation: our team ships every fix, on your accounts',
    ]
    : [
        'Der vollständige KI-Scan Ihrer digitalen Präsenz',
        'Priorisierte Roadmap — Wirkung vor Aufwand, nicht Meinungen',
        'Umsetzung: unser Team baut jeden Fix — auf Ihren Accounts',
    ];

  // ---- 06 Services ----
  const services = isEnglish
    ? [
        { num: '01', name: 'AI Implementation', desc: 'Voice agents, scanners, autonomous funnels.', path: '/en/services/ai-implementation', anchor: true },
        { num: '02', name: 'SEO',                desc: 'Local rankings, evergreen organic traffic.',  path: '/en/services/seo' },
        { num: '03', name: 'SEA / PPC',          desc: 'Performance ads with measurable ROAS.',       path: '/en/services/sea' },
        { num: '04', name: 'Reputation',         desc: 'Reviews, response systems, trust capital.',   path: '/en/services/reputation' },
        { num: '05', name: 'Design & Dev',       desc: 'Sites that convert by construction.',         path: '/en/services/design-development' },
        { num: '06', name: 'Brand Deployment',   desc: 'Identity systems shipped at speed.',          path: '/en/services/brand-deployment' },
        { num: '07', name: 'Social Media',       desc: 'Channels with editorial discipline.',         path: '/en/services/social-media' },
      ]
    : [
        { num: '01', name: 'KI-Implementierung', desc: 'Voice-Agents, Scanner, autonome Funnels.',       path: '/services/ki-implementierung', anchor: true },
        { num: '02', name: 'SEO',                desc: 'Lokale Rankings, nachhaltiger Traffic.',          path: '/services/seo' },
        { num: '03', name: 'SEA / PPC',          desc: 'Performance-Ads mit messbarem ROAS.',             path: '/services/sea' },
        { num: '04', name: 'Reputation',         desc: 'Bewertungen, Antwortsysteme, Vertrauen.',         path: '/services/reputation' },
        { num: '05', name: 'Design & Entwicklung', desc: 'Websites, die per Konstruktion konvertieren.',  path: '/services/design-entwicklung' },
        { num: '06', name: 'Brand Deployment',   desc: 'Identitätssysteme, schnell ausgerollt.',           path: '/services/brand-deployment' },
        { num: '07', name: 'Social Media',       desc: 'Kanäle mit redaktioneller Disziplin.',             path: '/services/social-media' },
      ];

  // ---- 07 Process steps ----
  const process = isEnglish
    ? [
        { num: '01', k: 'Analyse',    v: 'The audit runs and produces a real number with real evidence.' },
        { num: '02', k: 'Prioritize', v: 'We rank fixes by impact-per-effort — one page, no theatrics.' },
        { num: '03', k: 'Implement',  v: 'Our team ships on your domain, your ad accounts, your CRM.' },
        { num: '04', k: 'Optimize',   v: 'We re-measure monthly. The score is the receipt.' },
      ]
    : [
        { num: '01', k: 'Analysieren', v: 'Das Audit läuft und liefert eine echte Zahl mit echter Evidenz.' },
        { num: '02', k: 'Priorisieren', v: 'Wir ranken Fixes nach Wirkung-pro-Aufwand — eine Seite, kein Theater.' },
        { num: '03', k: 'Umsetzen',    v: 'Unser Team baut auf Ihrer Domain, Ihren Ad-Accounts, Ihrem CRM.' },
        { num: '04', k: 'Optimieren',  v: 'Wir messen monatlich nach. Der Score ist die Quittung.' },
      ];

  // ---- 09 Pricing ----
  const pricingPackages = [
    {
      key: 'launch',
      name: t.pricing.launch.name,
      price: t.pricing.launch.price,
      duration: t.pricing.launch.duration,
      billing: t.pricing.oneTime,
      features: t.pricing.launch.features,
    },
    {
      key: 'growth',
      name: t.pricing.growth.name,
      price: t.pricing.growth.price,
      duration: t.pricing.growth.duration,
      billing: t.pricing.perMonth,
      features: t.pricing.growth.features,
    },
    {
      key: 'scale',
      name: t.pricing.leader.name,
      price: t.pricing.leader.price,
      duration: t.pricing.leader.duration,
      billing: t.pricing.perMonth,
      priceNote: t.pricing.leader.priceNote,
      features: t.pricing.leader.features,
    },
  ];

  // ---- 10 FAQ ----
  const faq = isEnglish
    ? [
        { q: 'Is the audit really free?', a: 'Yes. No credit card, no follow-up call required. You get the report — what you do with it is your call.' },
        { q: 'What data do you use?',    a: 'Only public signals: your website, meta data, structured data, Google indexation and — if available — Semrush visibility. No scraping of protected areas.' },
        { q: 'What is the role of AI?',  a: 'AI translates observations into a prioritized recommendation. It never invents scores or cites data that is not in the input.' },
        { q: 'Can you implement the fixes?', a: 'Yes. Launch Sprint or Growth Retainer covers the roadmap. Everything ships on your accounts — you keep the keys.' },
      ]
    : [
        { q: 'Ist das Audit wirklich gratis?', a: 'Ja. Keine Kreditkarte, kein Pflicht-Call. Sie bekommen den Report — was Sie damit machen, entscheiden Sie.' },
        { q: 'Welche Daten werden verwendet?', a: 'Nur öffentliche Signale: Ihre Website, Meta-Daten, strukturierte Daten, Google-Indexierung und — sofern verfügbar — Semrush-Sichtbarkeit. Kein Scraping geschützter Bereiche.' },
        { q: 'Welche Rolle spielt die KI?',    a: 'Die KI übersetzt Beobachtungen in eine priorisierte Empfehlung. Sie erfindet keine Scores und zitiert keine Daten, die nicht im Input sind.' },
        { q: 'Setzen Sie die Fixes auch um?',  a: 'Ja. Launch Sprint oder Growth Retainer decken die Roadmap ab. Alles läuft auf Ihren Accounts — Sie behalten die Schlüssel.' },
      ];

  // FAQPage JSON-LD (only visible questions)
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    let script = document.querySelector('script[data-schema="home-faq"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'home-faq');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => { script?.remove(); };
  }, [isEnglish]); // eslint-disable-line react-hooks/exhaustive-deps

  const trustClaims = isEnglish
    ? ['25+ signals', 'Transparent scoring', 'No commitment', 'Built in Switzerland']
    : ['25+ Signale', 'Transparentes Scoring', 'Keine Verpflichtung', 'In der Schweiz gebaut'];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Free AI Audit · AI-First Marketing · itsFeierabend.ch' : 'Gratis KI-Audit · KI-First Marketing · itsFeierabend.ch'}
        description={isEnglish
          ? 'Find what is holding back your digital growth in minutes. 25+ deterministic signals, Swiss-based, no commitment.'
          : 'Finden Sie in Minuten, was Ihr digitales Wachstum bremst. 25+ deterministische Signale, aus der Schweiz, keine Verpflichtung.'}
      />
      <OrganizationSchema description={t.siteDescription} />
      <WebsiteSchema />

      {/* ========== 01 — Hero ========== */}
      <EditorialHero
        eyebrow={isEnglish ? 'AI-first digital marketing for Swiss service businesses' : 'AI-first Digital Marketing für Schweizer Dienstleister'}
        title={
          isEnglish ? (
            <>
              We find what is <em className="font-editorial">holding back</em>
              <br />your digital growth — and fix it.
            </>
          ) : (
            <>
              Wir finden, was Ihr digitales <em className="font-editorial">Wachstum bremst</em>
              <br />— und beheben es.
            </>
          )
        }
        lede={
          isEnglish
            ? 'A scoring engine reads 25+ signals on your website, visibility and conversion path. You get a real number, the top three fixes, and a clear next step. Free, in minutes.'
            : 'Eine Scoring-Engine liest 25+ Signale zu Website, Sichtbarkeit und Conversion-Pfad. Sie erhalten eine echte Zahl, die drei wichtigsten Fixes und einen klaren nächsten Schritt. Gratis, in Minuten.'
        }
        cta={
          <>
            <CTAButton variant="primary" size="lg" href={auditPath} location="hero">
              {isEnglish ? 'Start free audit' : 'Gratis Audit starten'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </CTAButton>
            <CTAButton variant="ghost" size="lg" href={callPath} location="hero">
              {isEnglish ? 'Or talk to a human →' : 'Oder mit einem Menschen sprechen →'}
            </CTAButton>
          </>
        }
        annotation={
          isEnglish
            ? '25+ signals · deterministic scoring · partial-result aware · never invents numbers'
            : '25+ Signale · deterministisches Scoring · Teilergebnisse zulässig · erfindet keine Zahlen'
        }
      />

      {/* ========== 02 — Trust strip ========== */}
      <div className="container-section">
        <div className="rule-hairline" />
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 py-6 font-mono text-xs uppercase tracking-[0.18em] text-foreground/65" data-cta-loc="trust-strip">
          {trustClaims.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-signal" />
              {c}
            </li>
          ))}
        </ul>
        <div className="rule-hairline" />
      </div>

      {/* ========== 03 — Problem / Diagnose ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-5">
              <SectionMarker index={3} total={11} label={isEnglish ? 'Where growth stalls' : 'Wo Wachstum stockt'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Growth rarely fails <em className="font-editorial">everywhere</em>. It fails in one or two places you can't see.</>
                  ) : (
                    <>Wachstum scheitert selten <em className="font-editorial">überall</em>. Es scheitert an ein bis zwei Stellen, die Sie nicht sehen.</>
                  )}
                </h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-md">
                  {isEnglish
                    ? 'The audit isolates the constraint before you spend a franc on more traffic. Five layers, one verdict.'
                    : 'Das Audit isoliert die Bremse, bevor Sie einen Franken in mehr Traffic stecken. Fünf Ebenen, ein Urteil.'}
                </p>
              </RevealText>
            </div>
            <ul className="col-span-12 lg:col-span-7 lg:border-l lg:border-border lg:pl-10">
              {diagnostics.map((d) => (
                <li key={d.num} className="border-t border-border first:border-t-0 py-6 grid grid-cols-12 gap-4">
                  <div className="col-span-2 sm:col-span-1 font-mono text-xs text-foreground/55 pt-1">{d.num}</div>
                  <div className="col-span-10 sm:col-span-3 font-editorial text-2xl md:text-3xl font-light text-foreground">{d.k}</div>
                  <div className="col-span-12 sm:col-span-8 text-base text-foreground/70">{d.v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 04 — The Audit as a product (Midnight) ========== */}
      <section data-neural-zone className="section-padding bg-foreground text-background">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
            <div className="col-span-12 lg:col-span-6">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-background/60 mb-6">
                {isEnglish ? '04 / 11 · The Audit' : '04 / 11 · Das Audit'}
              </div>
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>A deterministic engine. <em className="font-editorial">Not a chatbot guess.</em></>
                  ) : (
                    <>Eine deterministische Engine. <em className="font-editorial">Kein Chatbot-Rateversuch.</em></>
                  )}
                </h2>
                <p className="mt-6 text-lg text-background/80 max-w-lg">
                  {isEnglish
                    ? 'Signals are collected, normalized, scored by rules, then interpreted. AI translates — never invents.'
                    : 'Signale werden gesammelt, normalisiert, per Regeln bewertet, dann interpretiert. KI übersetzt — sie erfindet nicht.'}
                </p>
              </RevealText>

              <div className="mt-10 [&_.text-foreground\\/55]:text-background/55 [&_.text-foreground]:text-background">
                <SignalStream stages={stages} />
              </div>

              <div className="mt-10">
                <CTAButton variant="primary" size="lg" href={auditPath} location="audit-engine">
                  {isEnglish ? 'Run the free audit' : 'Gratis Audit starten'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </CTAButton>
              </div>
            </div>

            {/* Sample report mock */}
            <div className="col-span-12 lg:col-span-6">
              <RevealText delay={120}>
                <div className="rounded-2xl bg-background text-foreground p-8 md:p-10 border border-background/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                      {isEnglish ? 'Sample report' : 'Beispielreport'}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                      Live
                    </div>
                  </div>
                  <ScoreCard
                    score={62}
                    label={isEnglish ? 'Overall' : 'Gesamt'}
                    verdict={isEnglish
                      ? 'Visibility solid. Conversion is the cheapest lever. Three fixes can move the score >75.'
                      : 'Sichtbarkeit solide. Conversion ist der günstigste Hebel. Drei Fixes bringen den Score >75.'}
                  />
                  <ul className="mt-8 space-y-3 text-sm">
                    {(isEnglish
                      ? [
                          { p: 'Hi', t: 'Add primary CTA above the fold on 3 service pages' },
                          { p: 'Med', t: 'Fix missing meta descriptions on 12 URLs' },
                          { p: 'Med', t: 'Enable structured data for LocalBusiness' },
                        ]
                      : [
                          { p: 'Hoch', t: 'Primären CTA above the fold auf 3 Service-Seiten ergänzen' },
                          { p: 'Mittel', t: '12 fehlende Meta-Descriptions ergänzen' },
                          { p: 'Mittel', t: 'Strukturierte Daten für LocalBusiness aktivieren' },
                        ]
                    ).map((r) => (
                      <li key={r.t} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mt-1 shrink-0 w-12">{r.p}</span>
                        <span className="text-foreground/85">{r.t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealText>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 05 — Ultimate Package ========== */}
      <section data-neural-zone className="section-padding bg-secondary/40">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
            <div className="col-span-12 lg:col-span-7">
              <SectionMarker index={5} total={11} label={isEnglish ? 'The Ultimate Package' : 'Das Ultimate Package'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>The audit shows what's missing. <em className="font-editorial">We implement it.</em></>
                  ) : (
                    <>Der Audit zeigt, was fehlt. <em className="font-editorial">Wir setzen es um.</em></>
                  )}
                </h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-2xl">
                  {isEnglish
                    ? 'One contract. One timeline. One accountable partner — from diagnosis to shipped fix.'
                    : 'Ein Vertrag. Eine Timeline. Ein verantwortlicher Partner — von der Diagnose bis zum umgesetzten Fix.'}
                </p>
              </RevealText>

              <ul className="mt-10 space-y-4">
                {ultimateBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="font-mono text-xs text-foreground/55 mt-1.5 w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-base text-foreground/85">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <CTAButton variant="primary" size="lg" href={ultimatePath} location="ultimate">
                  {isEnglish ? 'Open the Ultimate Package' : 'Ultimate Package öffnen'}
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </CTAButton>
                <CTAButton variant="ghost" size="lg" href={callPath} location="ultimate">
                  {isEnglish ? 'Talk it through →' : 'Persönlich besprechen →'}
                </CTAButton>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <RevealText delay={120}>
                <div className="card-paper p-8">
                  <div className="section-marker mb-6">{isEnglish ? 'What you get' : 'Was Sie erhalten'}</div>
                  <ol className="space-y-6">
                    {(isEnglish
                      ? [
                          { k: 'Audit', v: 'Score + evidence per signal' },
                          { k: 'Roadmap', v: 'Prioritized by impact-per-effort' },
                          { k: 'Implementation', v: 'Our team ships. On your accounts.' },
                        ]
                      : [
                          { k: 'Audit', v: 'Score + Evidenz je Signal' },
                          { k: 'Roadmap', v: 'Priorisiert nach Wirkung-pro-Aufwand' },
                          { k: 'Umsetzung', v: 'Unser Team baut. Auf Ihren Accounts.' },
                        ]
                    ).map((row, i) => (
                      <li key={row.k} className="grid grid-cols-12 gap-3 items-baseline">
                        <span className="col-span-1 font-mono text-xs text-foreground/55">{String(i + 1).padStart(2, '0')}</span>
                        <span className="col-span-4 font-editorial text-xl md:text-2xl font-light">{row.k}</span>
                        <span className="col-span-7 text-sm text-foreground/70">{row.v}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </RevealText>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 06 — Services ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <SectionMarker index={6} total={11} label={isEnglish ? 'Delivery' : 'Umsetzung'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Seven disciplines. <em className="font-editorial">One operating system.</em></>
                  ) : (
                    <>Sieben Disziplinen. <em className="font-editorial">Ein Operating System.</em></>
                  )}
                </h2>
                <p className="mt-6 text-base text-foreground/70 max-w-sm">
                  {isEnglish
                    ? 'AI implementation is the spine. The other six wrap around it so every tactic feeds the same growth model.'
                    : 'KI-Implementierung ist das Rückgrat. Die anderen sechs ordnen sich darum an, damit jede Taktik dasselbe Wachstumsmodell nährt.'}
                </p>
              </RevealText>
            </div>

            <ul className="col-span-12 lg:col-span-8 lg:border-l lg:border-border lg:pl-10">
              {services.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="group block py-7 border-t border-border first:border-t-0 transition-colors hover:bg-foreground/[0.015] -mx-4 px-4 rounded-md"
                  >
                    <div className="grid grid-cols-12 items-baseline gap-4">
                      <div className="col-span-2 sm:col-span-1 font-mono text-xs text-foreground/55 pt-1">{s.num}</div>
                      <div className="col-span-10 sm:col-span-7">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-editorial text-3xl md:text-4xl font-light text-foreground">{s.name}</h3>
                          {s.anchor && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">★ Core</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-4 text-sm text-foreground/65 group-hover:text-foreground transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <span>{s.desc}</span>
                          <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 07 — Process + Anti-Knebel ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <SectionMarker index={7} total={11} label={isEnglish ? 'How we work' : 'Wie wir arbeiten'} />
          <RevealText>
            <h2 className="text-balance max-w-3xl">
              {isEnglish ? (
                <>Four steps. <em className="font-editorial">No lock-in.</em></>
              ) : (
                <>Vier Schritte. <em className="font-editorial">Keine Knebelverträge.</em></>
              )}
            </h2>
          </RevealText>

          <ol className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-border">
            {process.map((p) => (
              <li key={p.num} className="bg-background p-8">
                <div className="font-mono text-xs text-foreground/55 mb-4">{p.num}</div>
                <div className="font-editorial text-2xl md:text-3xl font-light text-foreground mb-3">{p.k}</div>
                <p className="text-sm text-foreground/70 leading-relaxed">{p.v}</p>
              </li>
            ))}
          </ol>

          <AIAnnotation className="mt-10 max-w-2xl">
            {isEnglish
              ? 'Anti-Knebel: your domain, ad accounts and customer data stay yours. We build on your accounts — you keep the keys.'
              : 'Anti-Knebel: Domain, Ad-Accounts und Kundendaten bleiben bei Ihnen. Wir bauen auf Ihren Accounts — Sie behalten die Schlüssel.'}
          </AIAnnotation>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 08 — Selected Work ========== */}
      <section data-neural-zone className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={8} total={11} label={isEnglish ? 'Selected Work' : 'Ausgewählte Arbeit'} />
          <RevealText>
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-end">
              <h2 className="col-span-12 lg:col-span-8 text-balance">
                {isEnglish ? (
                  <>Real Swiss projects — <em className="font-editorial">shown, not promised.</em></>
                ) : (
                  <>Echte Schweizer Projekte — <em className="font-editorial">gezeigt, nicht versprochen.</em></>
                )}
              </h2>
              <div className="col-span-12 lg:col-span-4 lg:text-right">
                <Link
                  to={casesPath}
                  className="font-mono text-sm uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground inline-flex items-center gap-2 link-underline"
                >
                  {isEnglish ? 'All case studies' : 'Alle Fallstudien'}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </RevealText>

          <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {[
              { name: 'umzugscheck.ch', tag: isEnglish ? 'Moving services · Switzerland' : 'Umzüge · Schweiz', scope: isEnglish ? 'Website, Lead-System, Local SEO' : 'Website, Lead-System, Local SEO' },
              { name: 'zuegelhelden.ch', tag: isEnglish ? 'Moving services · Switzerland' : 'Umzüge · Schweiz', scope: isEnglish ? 'Website, Ads, Automation' : 'Website, Ads, Automation' },
              { name: 'sbpictures.ch', tag: isEnglish ? 'Photography · Switzerland' : 'Fotografie · Schweiz', scope: isEnglish ? 'Website, Booking flow' : 'Website, Buchungsstrecke' },
              { name: 'velolife.ch', tag: isEnglish ? 'Cycling · Switzerland' : 'Velo · Schweiz', scope: isEnglish ? 'Brand, Website, Shop' : 'Brand, Website, Shop' },
            ].map((c) => (
              <li key={c.name} className="bg-background p-8 md:p-10">
                <div className="font-editorial text-3xl md:text-4xl font-light text-foreground">{c.name}</div>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">{c.tag}</div>
                <div className="mt-4 text-sm text-foreground/70">{c.scope}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 09 — Packages & Pricing ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <SectionMarker index={9} total={11} label={t.pricing.sectionTitle} />
          <RevealText>
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-end">
              <h2 className="col-span-12 lg:col-span-8 text-balance">
                {isEnglish ? (
                  <>Three ways to grow. <em className="font-editorial">Transparent prices.</em></>
                ) : (
                  <>Drei Wege zum Wachstum. <em className="font-editorial">Transparente Preise.</em></>
                )}
              </h2>
              <div className="col-span-12 lg:col-span-4 lg:text-right">
                <Link
                  to={pricingPath}
                  className="font-mono text-sm uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground inline-flex items-center gap-2 link-underline"
                >
                  {isEnglish ? 'Compare all packages' : 'Alle Pakete vergleichen'}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </RevealText>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPackages.map((pkg) => (
              <div key={pkg.key} className="card-paper p-8 flex flex-col h-full">
                <div className="section-marker mb-4">{pkg.duration}</div>
                <h3 className="font-editorial text-2xl md:text-3xl font-light text-foreground">{pkg.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">{pkg.price}</span>
                  <span className="text-sm text-foreground/60">{pkg.billing}</span>
                </div>
                {'priceNote' in pkg && pkg.priceNote && (
                  <div className="mt-1 font-mono text-xs text-foreground/55">{pkg.priceNote}</div>
                )}
                <ul className="mt-6 space-y-3 flex-1">
                  {pkg.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton
                  variant="ghost"
                  size="sm"
                  href={pricingPath}
                  location="pricing"
                  className="mt-8 w-full justify-center"
                >
                  {isEnglish ? 'See details →' : 'Details ansehen →'}
                </CTAButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 10 — FAQ ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <SectionMarker index={10} total={11} label={isEnglish ? 'Questions' : 'Fragen'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Honest answers, <em className="font-editorial">up front.</em></>
                  ) : (
                    <>Ehrliche Antworten, <em className="font-editorial">gleich vorweg.</em></>
                  )}
                </h2>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <ul className="divide-y divide-border border-y border-border">
                {faq.map((f) => (
                  <li key={f.q}>
                    <details className="group">
                      <summary className="cursor-pointer list-none py-6 flex items-start justify-between gap-6">
                        <span className="text-lg md:text-xl font-editorial font-light text-foreground pr-4">{f.q}</span>
                        <Plus className="w-5 h-5 mt-1.5 shrink-0 text-foreground/55 transition-transform duration-200 group-open:rotate-45" />
                      </summary>
                      <p className="pb-6 -mt-2 text-base text-foreground/75 max-w-2xl leading-relaxed">{f.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ========== 11 — Final CTA ========== */}
      <section data-neural-zone className="section-padding">
        <div className="container-section">
          <SectionMarker index={11} total={11} label={isEnglish ? 'Start' : 'Loslegen'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <RevealText className="col-span-12 lg:col-span-8">
              <h2 className="text-balance">
                {isEnglish ? (
                  <>Want to know where your <em className="font-editorial">biggest lever</em> is?</>
                ) : (
                  <>Sie möchten wissen, wo Ihr <em className="font-editorial">grösster Hebel</em> liegt?</>
                )}
              </h2>
              <p className="mt-6 text-lg text-foreground/75 max-w-xl">
                {isEnglish
                  ? 'Run the free audit — or talk to a human first. Either way, you leave with a real number and a real next step.'
                  : 'Starten Sie das Gratis-Audit — oder sprechen Sie zuerst mit einem Menschen. So oder so: Sie gehen mit einer echten Zahl und einem echten nächsten Schritt.'}
              </p>
            </RevealText>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <CTAButton variant="primary" size="lg" href={auditPath} location="final">
                {isEnglish ? 'Start free audit' : 'Gratis Audit starten'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </CTAButton>
              <CTAButton variant="ghost" size="lg" href={callPath} location="final">
                {isEnglish ? 'Book a free call →' : 'Gratis-Call buchen →'}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
