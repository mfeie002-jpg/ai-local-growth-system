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

      {/* ========== 01 — Hero (Instrument Panel Bento) ========== */}
      <section data-neural-zone className="pt-8 md:pt-12 pb-6">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Headline panel */}
            <div className="md:col-span-8 bg-card border border-border p-8 md:p-12 rounded-md flex flex-col justify-between min-h-[520px]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-border bg-background rounded-full">
                  <span className="w-2 h-2 rounded-full bg-signal shadow-[0_0_8px_hsl(var(--signal))] animate-pulse-glow" />
                  <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                    {isEnglish ? 'System Status · Active' : 'Systemstatus · Aktiv'}
                  </span>
                </div>
                <h1 className="uppercase text-balance">
                  {isEnglish ? (
                    <>We find the <span className="text-muted-foreground">growth</span><br />blockers.</>
                  ) : (
                    <>Wir finden die <span className="text-muted-foreground">Wachstums-</span><br />bremsen.</>
                  )}
                </h1>
                <p className="max-w-md text-muted-foreground text-lg leading-relaxed">
                  {isEnglish
                    ? 'A deterministic engine reads 25+ signals on your website, visibility and conversion path. Real number, top three fixes, clear next step. Free, in minutes.'
                    : '25+ Signale zu Website, Sichtbarkeit und Conversion — deterministisch bewertet. Echte Zahl, drei Fixes, klarer nächster Schritt. Gratis, in Minuten.'}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <CTAButton variant="primary" size="lg" href={auditPath} location="hero">
                  {isEnglish ? 'Start free audit' : 'Gratis Audit starten'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </CTAButton>
                <CTAButton variant="ghost" size="lg" href={callPath} location="hero">
                  {isEnglish ? 'Or talk to a human →' : 'Oder mit einem Menschen sprechen →'}
                </CTAButton>
              </div>
            </div>

            {/* Live audit score tile */}
            <div className="md:col-span-4 bg-card border border-border p-8 rounded-md flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[520px]">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-signal to-transparent opacity-40" />
              <div className="w-36 h-36 rounded-full border-2 border-border flex items-center justify-center relative mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-signal animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-mono text-4xl font-bold text-foreground">84<span className="text-lg text-muted-foreground">%</span></span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {isEnglish ? 'Efficiency Score' : 'Efficiency Score'}
              </span>
              <div className="mt-6 w-full h-px bg-border" />
              <div className="mt-4 grid grid-cols-2 w-full gap-4 text-left">
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Scanning</div>
                  <div className="font-mono text-xs font-bold text-foreground">FUNNEL_01</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Signals</div>
                  <div className="font-mono text-xs font-bold text-foreground">25+</div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== 02 — Trust chips + Live signals feed ========== */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3" data-cta-loc="trust-strip">
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { k: 'METRIC_01', v: trustClaims[0] },
                { k: 'METHOD',    v: trustClaims[1] },
                { k: 'STATUS',    v: trustClaims[2] },
                { k: 'ORIGIN',    v: trustClaims[3] },
              ].map((c) => (
                <div key={c.k} className="bg-card border border-border p-4 rounded-md flex flex-col justify-between min-h-[86px]">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{c.k}</span>
                  <span className="text-sm font-bold uppercase tracking-tight text-foreground">{c.v}</span>
                </div>
              ))}
            </div>

            <div className="md:col-span-4 bg-card border border-border p-4 rounded-md overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">LIVE_SIGNALS</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 border border-border text-signal">STREAMING</span>
              </div>
              <div className="space-y-2 font-mono text-[10px] leading-relaxed">
                <div className="flex justify-between text-muted-foreground"><span>[OK] CONVERSION_ANALYSIS</span><span>14:02:11</span></div>
                <div className="flex justify-between text-muted-foreground"><span>[OK] TECH_STACK_AUDIT</span><span>14:02:08</span></div>
                <div className="flex justify-between text-signal"><span>[..] SEO_SEM_LINKAGE</span><span>LIVE</span></div>
                <div className="flex justify-between text-muted-foreground"><span>[OK] TRUST_SIGNAL_INDEX</span><span>14:01:55</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 03 — Diagnose strip ========== */}
      <section data-neural-zone className="py-16 md:py-24">
        <div className="container-section">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground !text-[10px]" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', lineHeight: 1.5 }}>
              {isEnglish ? '03 / 11 · Diagnostic Zones' : '03 / 11 · Diagnosebereiche'}
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mb-10 max-w-2xl">
            <RevealText>
              <h2 className="uppercase text-balance">
                {isEnglish ? <>Growth rarely fails <span className="text-muted-foreground">everywhere</span>.</> : <>Wachstum scheitert selten <span className="text-muted-foreground">überall</span>.</>}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {isEnglish
                  ? 'It fails at one or two points you cannot see. The audit isolates the constraint before you spend a franc on more traffic.'
                  : 'Es scheitert an ein bis zwei Stellen, die Sie nicht sehen. Das Audit isoliert die Bremse, bevor Sie einen Franken in mehr Traffic stecken.'}
              </p>
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 border border-border divide-y md:divide-y-0 md:divide-x divide-border rounded-md overflow-hidden">
            {diagnostics.map((d, i) => (
              <div key={d.num} className="p-6 group hover:bg-card transition-colors">
                <span className="font-mono text-[10px] text-muted-foreground block mb-3 tracking-wider">{d.num}.</span>
                <h3 className="text-xl font-bold uppercase text-foreground mb-4">{d.k}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[3.5rem]">{d.v}</p>
                <div className="h-1 w-full bg-border overflow-hidden rounded-full">
                  <div
                    className="h-full bg-signal transition-all duration-700"
                    style={{ width: `${[50, 75, 66, 100, 33][i]}%`, boxShadow: i === 3 ? '0 0 8px hsl(var(--signal))' : undefined }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ========== 04 — The Audit as a product (Midnight) ========== */}
      <section data-neural-zone className="section-padding bg-card text-foreground border-y border-border">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
            <div className="col-span-12 lg:col-span-6">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
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
                <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                  {isEnglish
                    ? 'Signals are collected, normalized, scored by rules, then interpreted. AI translates — never invents.'
                    : 'Signale werden gesammelt, normalisiert, per Regeln bewertet, dann interpretiert. KI übersetzt — sie erfindet nicht.'}
                </p>
              </RevealText>

              <div className="mt-10 [&_.text-foreground\\/55]:text-muted-foreground [&_.text-foreground]:text-background">
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
