import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import {
  EditorialHero,
  SectionMarker,
  RevealText,
  FunnelNav,
  getFunnelSteps,
} from '@/components/neural';
import { ArrowRight } from 'lucide-react';

/**
 * SystemPage — Funnel step 01 / 05 · Learn.
 * Explains the four-layer engine + three growth pillars in editorial form.
 * Always points to the Audit as the next step.
 */
export default function SystemPage() {
  const { t, isEnglish } = useLanguage();
  const steps = getFunnelSteps(isEnglish);
  const me = steps[0];
  const next = steps[1];

  const pillars = [
    {
      key: 'traffic',
      title: t.system.traffic.title,
      description: t.system.traffic.description,
      outputs: t.system.traffic.outputs,
    },
    {
      key: 'conversion',
      title: t.system.conversion.title,
      description: t.system.conversion.description,
      outputs: t.system.conversion.outputs,
    },
    {
      key: 'aiOps',
      title: t.system.aiOps.title,
      description: t.system.aiOps.description,
      outputs: t.system.aiOps.outputs,
    },
  ];

  const layers = isEnglish
    ? [
        { name: 'Evidence',     desc: 'Public signals collected from your site, listings, and analytics.' },
        { name: 'Normalization', desc: '25+ typed signals with confidence: observed · inferred · estimated.' },
        { name: 'Scoring',      desc: 'Deterministic rules in TypeScript. The AI never invents a number.' },
        { name: 'Interpretation', desc: 'AI translates the score into business language and ranks the top 3 fixes.' },
      ]
    : [
        { name: 'Evidenz',          desc: 'Öffentliche Signale aus Website, Listings und Analytics.' },
        { name: 'Normalisierung',   desc: '25+ typisierte Signale mit Konfidenz: beobachtet · abgeleitet · geschätzt.' },
        { name: 'Bewertung',        desc: 'Deterministische TypeScript-Regeln. Die KI erfindet keine Zahl.' },
        { name: 'Interpretation',   desc: 'KI übersetzt den Score in Business-Sprache und priorisiert die Top 3 Fixes.' },
      ];

  return (
    <Layout>
      <SEOHead title={t.system.heroTitle} description={t.system.heroSubtitle} />

      {/* Hero */}
      <EditorialHero
        eyebrow={`${me.hint} · ${me.label}`}
        title={
          isEnglish ? (
            <>The system that <em className="font-editorial">does the looking</em>, before we do the doing.</>
          ) : (
            <>Das System, das <em className="font-editorial">hinschaut</em>, bevor wir handeln.</>
          )
        }
        lede={t.system.heroSubtitle}
        cta={
          <CTAButton variant="primary" size="lg" href={next.href} location="system-hero">
            {isEnglish ? 'Run my free audit' : 'Mein Gratis-Audit starten'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </CTAButton>
        }
        annotation={
          isEnglish
            ? 'Four layers · Evidence → Normalize → Score → Interpret · deterministic, then AI'
            : 'Vier Schichten · Evidenz → Normalisieren → Bewerten → Interpretieren · erst deterministisch, dann KI'
        }
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Four layers */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={3} label={isEnglish ? 'The Engine · 4 Layers' : 'Die Engine · 4 Schichten'} />
          <RevealText>
            <h2 className="text-balance max-w-3xl">
              {isEnglish ? (
                <>Deterministic where it matters. <em className="font-editorial">AI where it helps.</em></>
              ) : (
                <>Deterministisch, wo es zählt. <em className="font-editorial">KI, wo sie hilft.</em></>
              )}
            </h2>
          </RevealText>

          <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {layers.map((l, i) => (
              <li key={l.name} className="bg-background p-8 md:p-10">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55 mb-4">
                  Layer {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-editorial text-3xl md:text-4xl font-light text-foreground">
                  {l.name}
                </h3>
                <p className="mt-4 text-base text-foreground/70 max-w-md">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Three pillars */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={2} total={3} label={isEnglish ? 'Three Growth Pillars' : 'Drei Wachstums-Säulen'} />
          <RevealText>
            <h2 className="text-balance max-w-3xl">
              {isEnglish ? (
                <>Three pillars. <em className="font-editorial">One operating system.</em></>
              ) : (
                <>Drei Säulen. <em className="font-editorial">Ein Betriebssystem.</em></>
              )}
            </h2>
          </RevealText>

          <div className="mt-14 space-y-px bg-border">
            {pillars.map((p, i) => (
              <article key={p.key} className="bg-background p-8 md:p-12">
                <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                  <div className="col-span-12 md:col-span-5">
                    <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55 mb-3">
                      Pillar {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-editorial text-3xl md:text-4xl font-light text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-4 text-base text-foreground/70 max-w-sm">{p.description}</p>
                  </div>
                  <ul className="col-span-12 md:col-span-7 md:border-l md:border-border md:pl-10 space-y-3">
                    {p.outputs.map((o, j) => (
                      <li key={j} className="flex items-start gap-4">
                        <span className="font-mono text-[10px] text-foreground/55 mt-2 w-6 shrink-0">
                          {String(j + 1).padStart(2, '0')}
                        </span>
                        <span className="text-base text-foreground/85">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Section 3 — Why now */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={3} total={3} label={isEnglish ? 'Why this approach' : 'Warum dieser Weg'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-6">
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Most agencies sell a tactic. <em className="font-editorial">We sell a feedback loop.</em></>
                  ) : (
                    <>Die meisten Agenturen verkaufen eine Taktik. <em className="font-editorial">Wir verkaufen einen Feedback-Loop.</em></>
                  )}
                </h2>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:pl-8">
              <p className="text-lg text-foreground/75 leading-relaxed">
                {isEnglish
                  ? 'Every action feeds the score. The score tells us what to fix next. The next fix moves the score. That loop — not heroics — is what compounds.'
                  : 'Jede Aktion fließt in den Score. Der Score sagt, was als Nächstes zu fixen ist. Der nächste Fix bewegt den Score. Dieser Loop — nicht Heldentum — ist es, was sich summiert.'}
              </p>
              <p className="mt-6 text-base text-foreground/65">
                {isEnglish
                  ? 'The first turn of the loop is free. We call it the AI Audit.'
                  : 'Die erste Drehung des Loops ist gratis. Wir nennen sie KI-Audit.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel nav */}
      <FunnelNav
        current={{ index: 1, total: 5, label: me.label }}
        next={next}
        nextCtaLabel={isEnglish ? 'Start free audit →' : 'Gratis-Audit starten →'}
        copy={isEnglish
          ? 'You understand the system. Now see what it says about your business.'
          : 'Du kennst das System. Jetzt sieh, was es zu deinem Geschäft sagt.'}
        location="system"
      />
    </Layout>
  );
}
