import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, OrganizationSchema } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  EditorialHero,
  SectionMarker,
  SignalStream,
  ScoreCard,
  AIAnnotation,
  RevealText,
} from '@/components/neural';

/**
 * HomePage — Neural Editorial.
 * 6 numbered sections, AI-first manifesto, single funnel CTA throughout.
 * No fabricated proof, no aurora chrome.
 */
export default function HomePage() {
  const { t, isEnglish } = useLanguage();
  const auditPath = isEnglish ? '/en/free-audit' : '/gratis-audit';
  const ultimatePath = isEnglish ? '/en/ultimate-package' : '/ultimate-package';
  const callPath = isEnglish ? '/en/free-call' : '/gratis-call';
  const casesPath = isEnglish ? '/en/case-studies' : '/fallstudien';

  // ---- Section 02 — engine stages ----
  const stages = isEnglish
    ? ['Collect', 'Normalize', 'Score', 'Interpret']
    : ['Erfassen', 'Normalisieren', 'Bewerten', 'Interpretieren'];

  // ---- Section 03 — Ultimate Package teaser bullets ----
  const ultimateBullets = isEnglish
    ? [
        'Full AI scan of your digital presence',
        'A scoring model that grades 25+ signals — deterministic, not invented',
        'Top 3 opportunities, ranked by impact-over-effort',
        'A done-for-you implementation path',
      ]
    : [
        'Vollständiger KI-Scan Ihrer digitalen Präsenz',
        'Scoring-Modell mit 25+ Signalen — deterministisch, nicht erfunden',
        'Top 3 Chancen, geordnet nach Wirkung-pro-Aufwand',
        'Ein für Sie umgesetzter Pfad zur Implementierung',
      ];

  // ---- Section 04 — services list (editorial, not card grid) ----
  const services = isEnglish
    ? [
        { num: '01', name: 'AI Implementation', desc: 'Voice agents, scanners, autonomous funnels.', path: '/en/services/ai-implementation', anchor: true },
        { num: '02', name: 'SEO',                desc: 'Local rankings, evergreen organic traffic.',  path: '/en/services/seo' },
        { num: '03', name: 'SEA / PPC',          desc: 'Performance ads with measurable ROAS.',     path: '/en/services/sea' },
        { num: '04', name: 'Reputation',         desc: 'Reviews, response systems, trust capital.', path: '/en/services/reputation' },
        { num: '05', name: 'Design & Dev',       desc: 'Sites that convert by construction.',       path: '/en/services/design-development' },
        { num: '06', name: 'Brand Deployment',   desc: 'Identity systems shipped at speed.',        path: '/en/services/brand-deployment' },
        { num: '07', name: 'Social Media',       desc: 'Channels with editorial discipline.',       path: '/en/services/social-media' },
      ]
    : [
        { num: '01', name: 'KI-Implementierung', desc: 'Voice-Agents, Scanner, autonome Funnels.',     path: '/services/ki-implementierung', anchor: true },
        { num: '02', name: 'SEO',                desc: 'Lokale Rankings, nachhaltiger Traffic.',        path: '/services/seo' },
        { num: '03', name: 'SEA / PPC',          desc: 'Performance-Ads mit messbarem ROAS.',           path: '/services/sea' },
        { num: '04', name: 'Reputation',         desc: 'Bewertungen, Antwortsysteme, Vertrauen.',       path: '/services/reputation' },
        { num: '05', name: 'Design & Entwicklung', desc: 'Websites, die per Konstruktion konvertieren.', path: '/services/design-entwicklung' },
        { num: '06', name: 'Brand Deployment',   desc: 'Identitätssysteme, schnell ausgerollt.',         path: '/services/brand-deployment' },
        { num: '07', name: 'Social Media',       desc: 'Kanäle mit redaktioneller Disziplin.',           path: '/services/social-media' },
      ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'AI-First Digital Growth · itsFeierabend.ch' : 'KI-First Digital Growth · itsFeierabend.ch'}
        description={isEnglish
          ? 'A scoring engine for your digital presence — and a team that turns the score into growth. Free AI audit for Swiss service businesses.'
          : 'Eine Scoring-Engine für Ihre digitale Präsenz — und ein Team, das aus der Bewertung Wachstum macht. Gratis KI-Audit für Schweizer Dienstleister.'}
      />
      <OrganizationSchema description={t.siteDescription} />

      {/* ============================================================ */}
      {/* 01 — Manifesto Hero                                          */}
      {/* ============================================================ */}
      <EditorialHero
        eyebrow={isEnglish ? '01 / 06 · Manifesto' : '01 / 06 · Manifest'}
        title={
          isEnglish ? (
            <>
              Your website is <em className="font-editorial">already</em> talking.
              <br />
              We taught the AI how to <em className="font-editorial">listen</em>.
            </>
          ) : (
            <>
              Ihre Website <em className="font-editorial">spricht</em> bereits.
              <br />
              Wir haben der KI beigebracht, <em className="font-editorial">zuzuhören</em>.
            </>
          )
        }
        lede={
          isEnglish
            ? 'A scoring engine reads 25+ signals on your digital presence — visibility, trust, conversion, technical health, automation readiness — and tells you exactly what to fix first. No invented metrics. No fluff.'
            : 'Eine Scoring-Engine liest 25+ Signale Ihrer digitalen Präsenz — Sichtbarkeit, Vertrauen, Conversion, technische Gesundheit, Automatisierungsreife — und sagt Ihnen genau, was zuerst zu tun ist. Keine erfundenen Kennzahlen. Kein Bullshit.'
        }
        cta={
          <>
            <CTAButton variant="primary" size="lg" href={auditPath} location="hero">
              {isEnglish ? 'Run my free AI audit' : 'Gratis KI-Audit starten'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </CTAButton>
            <CTAButton variant="ghost" size="lg" href={ultimatePath} location="hero">
              {isEnglish ? 'See the Ultimate Package →' : 'Ultimate Package ansehen →'}
            </CTAButton>
          </>
        }
        annotation={
          isEnglish
            ? 'gemini-2.5-flash · interprets 25+ signals · deterministic scoring · partial-result aware'
            : 'gemini-2.5-flash · interpretiert 25+ Signale · deterministisches Scoring · liefert auch Teilergebnisse'
        }
        meta={
          <>
            <span>{isEnglish ? 'No commitment' : 'Keine Verpflichtung'}</span>
            <span aria-hidden>·</span>
            <span>{isEnglish ? 'Results in minutes' : 'Ergebnis in Minuten'}</span>
            <span aria-hidden>·</span>
            <span>{isEnglish ? 'Swiss-based' : 'In der Schweiz gemacht'}</span>
          </>
        }
      />

      {/* Hairline divider */}
      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ============================================================ */}
      {/* 02 — The Engine                                              */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <SectionMarker index={2} total={6} label={isEnglish ? 'The Engine' : 'Die Engine'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Four layers. <em className="font-editorial">One verdict.</em></>
                  ) : (
                    <>Vier Schichten. <em className="font-editorial">Ein Urteil.</em></>
                  )}
                </h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-md">
                  {isEnglish
                    ? 'Evidence is collected from public sources, normalized into typed signals, scored by deterministic rules, then interpreted by an AI that is not allowed to invent.'
                    : 'Evidenz wird aus öffentlichen Quellen gesammelt, in typisierte Signale normalisiert, von deterministischen Regeln bewertet und dann von einer KI interpretiert, die nichts erfinden darf.'}
                </p>
              </RevealText>

              <AIAnnotation className="mt-8 max-w-md">
                {isEnglish
                  ? 'AI may translate, prioritize and recommend. AI may not invent scores or cite data not in the input.'
                  : 'KI darf übersetzen, priorisieren, empfehlen. KI darf keine Scores erfinden oder Daten zitieren, die nicht im Input sind.'}
              </AIAnnotation>
            </div>

            <div className="col-span-12 lg:col-span-7 lg:pl-8">
              <RevealText delay={120}>
                <SignalStream stages={stages} />
              </RevealText>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 font-mono text-sm">
                <div>
                  <div className="text-foreground/55 text-xs uppercase tracking-[0.18em] mb-1.5">{isEnglish ? 'Signals' : 'Signale'}</div>
                  <div className="text-foreground">25+</div>
                </div>
                <div>
                  <div className="text-foreground/55 text-xs uppercase tracking-[0.18em] mb-1.5">{isEnglish ? 'Scoring' : 'Bewertung'}</div>
                  <div className="text-foreground">{isEnglish ? 'Deterministic' : 'Deterministisch'}</div>
                </div>
                <div>
                  <div className="text-foreground/55 text-xs uppercase tracking-[0.18em] mb-1.5">{isEnglish ? 'Confidence' : 'Konfidenz'}</div>
                  <div className="text-foreground">{isEnglish ? 'observed · inferred · estimated' : 'beobachtet · abgeleitet · geschätzt'}</div>
                </div>
                <div>
                  <div className="text-foreground/55 text-xs uppercase tracking-[0.18em] mb-1.5">{isEnglish ? 'Output' : 'Ergebnis'}</div>
                  <div className="text-foreground">{isEnglish ? 'Score · Top 3 fixes' : 'Score · Top 3 Fixes'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ============================================================ */}
      {/* 03 — The Ultimate Package                                    */}
      {/* ============================================================ */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
            <div className="col-span-12 lg:col-span-7">
              <SectionMarker index={3} total={6} label={isEnglish ? 'The Ultimate Package' : 'Das Ultimate Package'} />
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Everything the audit reveals — <em className="font-editorial">implemented</em> for you.</>
                  ) : (
                    <>Alles, was das Audit aufdeckt — <em className="font-editorial">für Sie umgesetzt</em>.</>
                  )}
                </h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-2xl">
                  {isEnglish
                    ? 'The Ultimate Package is our flagship offer: the AI scan, the prioritized roadmap, and a team that ships every fix. One contract, one timeline, one accountable partner.'
                    : 'Das Ultimate Package ist unser Flaggschiff: der KI-Scan, die priorisierte Roadmap und ein Team, das jeden Fix umsetzt. Ein Vertrag, eine Timeline, ein verantwortlicher Partner.'}
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
                <CTAButton variant="primary" size="lg" href={ultimatePath} location="ultimate-teaser">
                  {isEnglish ? 'Open the Ultimate Package' : 'Ultimate Package öffnen'}
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </CTAButton>
                <CTAButton variant="ghost" size="lg" href={auditPath} location="ultimate-teaser">
                  {isEnglish ? 'Or start with the free audit →' : 'Oder mit dem Gratis-Audit starten →'}
                </CTAButton>
              </div>
            </div>

            {/* Right — score teaser visual */}
            <div className="col-span-12 lg:col-span-5">
              <RevealText delay={120}>
                <div className="card-paper p-10 flex flex-col items-center">
                  <div className="section-marker mb-8">
                    {isEnglish ? 'Sample report · live engine' : 'Beispielreport · Live-Engine'}
                  </div>
                  <ScoreCard
                    score={62}
                    label={isEnglish ? 'Overall' : 'Gesamt'}
                    verdict={
                      isEnglish
                        ? 'Visibility solid. Conversion is the cheapest lever. Three fixes can move the score >75.'
                        : 'Sichtbarkeit solide. Conversion ist der günstigste Hebel. Drei Fixes bringen den Score >75.'
                    }
                  />
                </div>
              </RevealText>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ============================================================ */}
      {/* 04 — Services (editorial list, not card grid)               */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <SectionMarker index={4} total={6} label={isEnglish ? 'Services' : 'Services'} />
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
              {services.map((s, i) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="group block py-7 border-t border-border first:border-t-0 transition-colors hover:bg-foreground/[0.015] -mx-4 px-4 rounded-md"
                  >
                    <div className="grid grid-cols-12 items-baseline gap-4">
                      <div className="col-span-2 sm:col-span-1 font-mono text-xs text-foreground/55 pt-1">{s.num}</div>
                      <div className="col-span-10 sm:col-span-7">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-editorial text-3xl md:text-4xl font-light text-foreground">
                            {s.name}
                          </h3>
                          {s.anchor && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                              ★ Core
                            </span>
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

      {/* ============================================================ */}
      {/* 05 — Real portfolio (no fabricated metrics)                  */}
      {/* ============================================================ */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={5} total={6} label={isEnglish ? 'Selected Work' : 'Ausgewählte Arbeit'} />
          <RevealText>
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-end">
              <h2 className="col-span-12 lg:col-span-8 text-balance">
                {isEnglish ? (
                  <>We're new — and we'd rather <em className="font-editorial">show</em> than promise.</>
                ) : (
                  <>Wir sind neu — und zeigen lieber <em className="font-editorial">Arbeit</em>, statt zu versprechen.</>
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

          <p className="mt-6 max-w-2xl text-base text-foreground/65">
            {isEnglish
              ? 'Real Swiss service businesses we have analysed or worked with — referenced openly, no invented "+40% leads" claims.'
              : 'Echte Schweizer Dienstleister, die wir analysiert oder begleitet haben — offen genannt, ohne erfundene „+40 % Leads"-Behauptungen.'}
          </p>

          <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {[
              { name: 'umzugscheck.ch', tag: isEnglish ? 'Moving services · Switzerland' : 'Umzüge · Schweiz' },
              { name: 'zuegelhelden.ch', tag: isEnglish ? 'Moving services · Switzerland' : 'Umzüge · Schweiz' },
              { name: 'sbpictures.ch', tag: isEnglish ? 'Photography · Switzerland' : 'Fotografie · Schweiz' },
              { name: 'velolife.ch', tag: isEnglish ? 'Cycling · Switzerland' : 'Velo · Schweiz' },
            ].map((c) => (
              <li key={c.name} className="bg-background p-8 md:p-10">
                <div className="font-editorial text-3xl md:text-4xl font-light text-foreground">{c.name}</div>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">{c.tag}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* ============================================================ */}
      {/* 06 — Final CTA                                               */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={6} total={6} label={isEnglish ? 'Start' : 'Loslegen'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <RevealText className="col-span-12 lg:col-span-8">
              <h2 className="text-balance">
                {isEnglish ? (
                  <>Two ways in. <em className="font-editorial">Both free.</em></>
                ) : (
                  <>Zwei Einstiege. <em className="font-editorial">Beide gratis.</em></>
                )}
              </h2>
              <p className="mt-6 text-lg text-foreground/75 max-w-xl">
                {isEnglish
                  ? 'Run the AI audit yourself — or talk to a human first. Either way, you leave with a real number and a real next step.'
                  : 'Selbst das KI-Audit starten — oder zuerst mit einem Menschen sprechen. So oder so: Sie gehen mit einer echten Zahl und einem echten nächsten Schritt.'}
              </p>
            </RevealText>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <CTAButton variant="primary" size="lg" href={auditPath} location="footer-cta">
                {isEnglish ? 'Run free AI audit' : 'Gratis KI-Audit starten'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </CTAButton>
              <CTAButton variant="ghost" size="lg" href={callPath} location="footer-cta">
                {isEnglish ? 'Book a free call →' : 'Gratis-Call buchen →'}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
