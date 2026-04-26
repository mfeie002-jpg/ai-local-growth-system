import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { CTAButton } from '@/components/CTAButton';
import { EditorialHero, FunnelNav, getFunnelSteps, ScoreCard, AIAnnotation } from '@/components/neural';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';

export default function UltimatePackagePage() {
  const { isEnglish } = useLanguage();
  const isDE = !isEnglish;

  // The Ultimate Package sits between the funnel proper (audit→pricing→call)
  // and the deeper system narrative. We anchor it as a sibling to the funnel
  // so users can drop in here and still see where they are.
  const steps = getFunnelSteps(isEnglish);
  const auditStep = steps.find((s) => s.id === 'audit')!;
  const callStep = steps.find((s) => s.id === 'call')!;

  const t = isDE
    ? {
        eyebrow: '§ Ultimate Package · Vollständige KI-Analyse',
        title: (
          <>
            Eine Analyse, die <em className="italic text-signal">jede Stellschraube</em> deiner
            Website sichtbar macht.
          </>
        ),
        lede:
          'Der Reifegrad-Check liefert dir den ersten Score — das Ultimate Package geht den ganzen Weg: jede Schwachstelle, jede Chance, jeder Hebel, dokumentiert und priorisiert.',
        ctaPrimary: 'Gratis Reifegrad-Check starten',
        ctaSecondary: 'Beispiel-Report öffnen',
        annotation:
          'Die KI durchleuchtet 50+ Faktoren und schreibt dir die Aktionsliste so, dass du sofort umsetzen oder uns übergeben kannst.',
        meta: ['Resultate in 24–48 h', '50+ Faktoren', 'Konkurrenzvergleich', '100 % gratis'],

        flow: {
          eyebrow: '— Ablauf',
          title: (
            <>
              Drei Schritte. Vom Score zur <em className="italic text-signal">Umsetzung</em>.
            </>
          ),
          steps: [
            {
              n: '01',
              tag: '100 % gratis',
              title: 'Gratis-Analyse',
              body:
                'URL eingeben — die KI scannt SEO, UX, Speed, Trust-Signale und Konkurrenz. Innerhalb von 24–48 h.',
              points: ['50+ Ranking-Faktoren', 'Konkurrenz-Benchmark', 'Quick-Wins identifiziert'],
            },
            {
              n: '02',
              tag: 'Überwältigend',
              title: 'Detaillierter Report',
              body:
                'Jeder Befund priorisiert nach Wirkung. Mit Begründung, Spec und KI-Prompt zur Umsetzung.',
              points: ['Prioritäts-Roadmap', 'Technische Specs', 'Sofort einsetzbare Prompts'],
              link: { href: '/demo', label: 'Beispiel-Report ansehen' },
            },
            {
              n: '03',
              tag: 'Für dich erledigt',
              title: 'Implementierung',
              body:
                'Wir bauen die Verbesserungen — sauber, dokumentiert, mit Qualitätssicherung. Optional und ohne Druck.',
              points: ['Experten-Umsetzung', 'QA inklusive', 'Laufende Optimierung'],
            },
          ],
        },

        scope: {
          eyebrow: '— Was geprüft wird',
          title: (
            <>
              Sechs Ebenen. <em className="italic text-signal">Eine Geschichte.</em>
            </>
          ),
          areas: [
            { id: 'SEO', label: 'Sichtbarkeit', items: ['Tech-SEO-Audit', 'Keyword-Chancen', 'Content-Lücken', 'Backlink-Profil', 'Local SEO'] },
            { id: 'UX', label: 'Erlebnis', items: ['User Experience', 'Mobile Responsiveness', 'Page Speed', 'Visuelle Hierarchie', 'Conversion-Pfade'] },
            { id: 'TEC', label: 'Technik', items: ['Performance-Metriken', 'Core Web Vitals', 'Sicherheit', 'Strukturierte Daten', 'Accessibility'] },
            { id: 'CVR', label: 'Conversion', items: ['CTA-Effektivität', 'Trust-Signale', 'Formulare', 'Sales-Funnel', 'A/B-Chancen'] },
            { id: 'CMP', label: 'Wettbewerb', items: ['Konkurrenz-Benchmark', 'Marktposition', 'Content-Vergleich', 'Feature-Lücken', 'Preis-Intel'] },
            { id: 'STR', label: 'Strategie', items: ['Wachstums-Roadmap', 'Quick Wins', 'Langzeit-Initiativen', 'Ressourcen-Prio', 'Timeline'] },
          ],
        },

        proof: {
          eyebrow: '— Ausgewählte Ergebnisse',
          title: (
            <>
              Reale Schweizer KMU. <em className="italic text-signal">Reale Verschiebungen.</em>
            </>
          ),
        },

        sample: {
          eyebrow: '— Score-Auszug',
          title: (
            <>
              So sieht dein <em className="italic text-signal">Reifegrad</em> aus.
            </>
          ),
          body:
            'Eine kompakte Zahl, sechs Bereiche, drei priorisierte Hebel. Genug, um in einem Atemzug zu erfassen, wo du stehst — und wo der nächste Sprint hingeht.',
        },

        cta: {
          eyebrow: '— Start',
          title: (
            <>
              Bereit, dein <em className="italic text-signal">Potenzial</em> zu sehen?
            </>
          ),
          body: 'Keine Kreditkarte. Keine Verpflichtung. Nur die Insights.',
        },
      }
    : {
        eyebrow: '§ Ultimate Package · Full AI Analysis',
        title: (
          <>
            One analysis that surfaces <em className="italic text-signal">every lever</em> on your
            website.
          </>
        ),
        lede:
          'The maturity check gives you the first score. The Ultimate Package goes the whole way — every gap, every opportunity, documented and prioritised.',
        ctaPrimary: 'Start the free maturity check',
        ctaSecondary: 'Open sample report',
        annotation:
          'The AI examines 50+ factors and writes the action list so you can ship it yourself or hand it to us.',
        meta: ['Results in 24–48 h', '50+ factors', 'Competitor benchmark', '100 % free'],

        flow: {
          eyebrow: '— Flow',
          title: (
            <>
              Three steps. From score to <em className="italic text-signal">shipped</em>.
            </>
          ),
          steps: [
            {
              n: '01',
              tag: '100% free',
              title: 'Free analysis',
              body:
                'Enter a URL — the AI scans SEO, UX, speed, trust signals and competitors. Within 24–48 h.',
              points: ['50+ ranking factors', 'Competitor benchmark', 'Quick wins surfaced'],
            },
            {
              n: '02',
              tag: 'Overwhelming',
              title: 'Detailed report',
              body:
                'Every finding prioritised by impact — with reasoning, spec and a ready-to-run AI prompt.',
              points: ['Priority roadmap', 'Technical specs', 'Drop-in prompts'],
              link: { href: '/en/demo', label: 'See sample report' },
            },
            {
              n: '03',
              tag: 'Done for you',
              title: 'Implementation',
              body:
                'We ship the improvements — cleanly, documented, with QA. Optional, no pressure.',
              points: ['Expert execution', 'QA included', 'Ongoing optimisation'],
            },
          ],
        },

        scope: {
          eyebrow: '— What gets checked',
          title: (
            <>
              Six layers. <em className="italic text-signal">One story.</em>
            </>
          ),
          areas: [
            { id: 'SEO', label: 'Visibility', items: ['Technical SEO audit', 'Keyword opportunities', 'Content gaps', 'Backlink profile', 'Local SEO'] },
            { id: 'UX', label: 'Experience', items: ['User experience', 'Mobile responsiveness', 'Page speed', 'Visual hierarchy', 'Conversion paths'] },
            { id: 'TEC', label: 'Technical', items: ['Performance', 'Core Web Vitals', 'Security', 'Structured data', 'Accessibility'] },
            { id: 'CVR', label: 'Conversion', items: ['CTA effectiveness', 'Trust signals', 'Forms', 'Sales funnel', 'A/B opportunities'] },
            { id: 'CMP', label: 'Competition', items: ['Competitor benchmark', 'Market position', 'Content comparison', 'Feature gaps', 'Pricing intel'] },
            { id: 'STR', label: 'Strategy', items: ['Growth roadmap', 'Quick wins', 'Long-term plays', 'Resource priorities', 'Timeline'] },
          ],
        },

        proof: {
          eyebrow: '— Selected outcomes',
          title: (
            <>
              Real Swiss SMBs. <em className="italic text-signal">Real shifts.</em>
            </>
          ),
        },

        sample: {
          eyebrow: '— Score sample',
          title: (
            <>
              This is what your <em className="italic text-signal">maturity</em> looks like.
            </>
          ),
          body:
            'One compact number, six areas, three prioritised levers. Enough to grasp where you stand — and where the next sprint goes.',
        },

        cta: {
          eyebrow: '— Start',
          title: (
            <>
              Ready to see your <em className="italic text-signal">potential</em>?
            </>
          ),
          body: 'No credit card. No obligation. Just the insights.',
        },
      };

  // Real Swiss case studies — referenced explicitly per brand memory.
  const cases = [
    { name: 'Umzugscheck.ch', url: 'https://umzugscheck.ch', industry: isDE ? 'Umzug' : 'Moving' },
    { name: 'Zügelhelden.ch', url: 'https://zuegelhelden.ch', industry: isDE ? 'Umzug' : 'Moving' },
    { name: 'SBPI.ch', url: 'https://sbpi.ch', industry: 'B2B Services' },
    { name: 'Feierabend-Umzug.ch', url: 'https://feierabend-umzug.ch', industry: isDE ? 'Umzug' : 'Moving' },
    { name: 'Reride.ch', url: 'https://reride.ch', industry: 'E-Commerce' },
    { name: 'Gentlehands.ch', url: 'https://gentlehands.ch', industry: isDE ? 'Wellness' : 'Wellness' },
  ];

  return (
    <Layout>
      <SEOHead
        title={isDE ? 'Ultimate Package — KI-Reifegrad-Analyse' : 'Ultimate Package — AI Maturity Analysis'}
        description={
          isDE
            ? 'Vollständige KI-gestützte Analyse deiner Website. Jede Schwachstelle, jede Chance, priorisiert und umsetzbar.'
            : 'Full AI-powered analysis of your website. Every gap and every opportunity, prioritised and ready to ship.'
        }
      />

      {/* HERO — editorial */}
      <EditorialHero
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        annotation={t.annotation}
        cta={
          <>
            <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-audit' : '/gratis-audit'} location="ultimate-hero-primary">
              {t.ctaPrimary}
              <ArrowRight className="ml-2 w-4 h-4" />
            </CTAButton>
            <CTAButton variant="ghost" size="lg" href={isEnglish ? '/en/demo' : '/demo'} location="ultimate-hero-secondary">
              {t.ctaSecondary}
            </CTAButton>
          </>
        }
        meta={t.meta.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      />

      {/* SCORE SAMPLE — visual anchor */}
      <section className="border-t border-border">
        <div className="container-section py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-center">
            <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-start">
              <ScoreCard score={74} label={isDE ? 'Reifegrad' : 'Maturity'} />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="signal-dot" aria-hidden />
                <span className="section-marker">{t.sample.eyebrow}</span>
              </div>
              <h2 className="text-balance text-4xl md:text-5xl font-editorial font-semibold leading-[1.05]">
                {t.sample.title}
              </h2>
              <p className="mt-6 max-w-xl text-lg text-foreground/75 leading-[1.55]">{t.sample.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FLOW — three editorial steps */}
      <section className="border-t border-border">
        <div className="container-section py-20 md:py-28">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="signal-dot" aria-hidden />
              <span className="section-marker">{t.flow.eyebrow}</span>
            </div>
            <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-editorial font-semibold leading-[1.05]">
              {t.flow.title}
            </h2>
          </div>

          <ol className="grid grid-cols-12 gap-x-6 gap-y-12">
            {t.flow.steps.map((step) => (
              <li key={step.n} className="col-span-12 md:col-span-4 group">
                <div className="border-t border-foreground pt-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/55">
                      {step.n}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="font-editorial text-2xl md:text-3xl leading-[1.15] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-foreground/75 leading-[1.55] mb-6">{step.body}</p>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {step.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="text-signal mt-1.5 inline-block w-1 h-1 rounded-full bg-signal" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {(step as any).link && (
                    <a
                      href={(step as any).link.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.16em] text-signal hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {(step as any).link.label}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SCOPE — six layers as editorial table */}
      <section className="border-t border-border bg-muted/20">
        <div className="container-section py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="signal-dot" aria-hidden />
                <span className="section-marker">{t.scope.eyebrow}</span>
              </div>
              <h2 className="text-balance text-4xl md:text-5xl font-editorial font-semibold leading-[1.05]">
                {t.scope.title}
              </h2>
              <div className="hidden lg:block mt-10">
                <AIAnnotation>
                  {isDE
                    ? 'Jede Ebene wird einzeln gescort und im Report mit Quelle und Vertrauensgrad dokumentiert.'
                    : 'Each layer is scored separately and documented with source and confidence in the report.'}
                </AIAnnotation>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <ul className="divide-y divide-border">
                {t.scope.areas.map((area) => (
                  <li key={area.id} className="grid grid-cols-12 gap-x-6 py-6">
                    <div className="col-span-12 md:col-span-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                        {area.id}
                      </div>
                      <div className="font-editorial text-xl mt-1">{area.label}</div>
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground/75">
                        {area.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF — Swiss case-study list */}
      <section className="border-t border-border">
        <div className="container-section py-20 md:py-28">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="signal-dot" aria-hidden />
              <span className="section-marker">{t.proof.eyebrow}</span>
            </div>
            <h2 className="text-balance text-4xl md:text-5xl font-editorial font-semibold leading-[1.05]">
              {t.proof.title}
            </h2>
          </div>

          <ul className="divide-y divide-border border-y border-border">
            {cases.map((c, i) => (
              <li key={c.name}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-12 gap-x-6 items-center py-6 group hover:bg-muted/30 transition-colors px-2 -mx-2"
                >
                  <span className="col-span-2 md:col-span-1 font-mono text-xs text-foreground/55">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="col-span-7 md:col-span-6 font-editorial text-xl md:text-2xl">
                    {c.name}
                  </span>
                  <span className="col-span-3 md:col-span-4 font-mono text-xs uppercase tracking-[0.16em] text-foreground/55">
                    {c.industry}
                  </span>
                  <ArrowUpRight className="col-span-12 md:col-span-1 w-4 h-4 text-foreground/55 group-hover:text-signal transition-colors justify-self-end" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="border-t border-border">
        <div className="container-section py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
            <div className="col-span-12 lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="signal-dot" aria-hidden />
                <span className="section-marker">{t.cta.eyebrow}</span>
              </div>
              <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-editorial font-semibold leading-[1.05]">
                {t.cta.title}
              </h2>
              <p className="mt-6 max-w-md text-lg text-foreground/75 leading-[1.55]">{t.cta.body}</p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <AnalysisRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* Funnel nav — push toward audit / call */}
      <FunnelNav
        current={{ index: 3, total: 5, label: isDE ? 'Ultimate Package' : 'Ultimate Package' }}
        prev={auditStep}
        next={callStep}
        nextCtaLabel={isDE ? 'Gespräch buchen' : 'Book a call'}
        copy={
          isDE
            ? 'Du hast den Score gesehen. Jetzt entscheidest du: selbst umsetzen oder gemeinsam.'
            : 'You have seen the score. Now you choose: ship it yourself or with us.'
        }
        location="ultimate-funnel"
      />
    </Layout>
  );
}
