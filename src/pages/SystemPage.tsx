import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Zap, Target, Bot, ArrowUpRight, Check } from 'lucide-react';

export default function SystemPage() {
  const { t, isEnglish } = useLanguage();

  const pillars = [
    { icon: Zap, key: 'traffic', title: t.system.traffic.title, description: t.system.traffic.description, outputs: t.system.traffic.outputs },
    { icon: Target, key: 'conversion', title: t.system.conversion.title, description: t.system.conversion.description, outputs: t.system.conversion.outputs },
    { icon: Bot, key: 'aiOps', title: t.system.aiOps.title, description: t.system.aiOps.description, outputs: t.system.aiOps.outputs },
  ];

  return (
    <Layout showDemoTeaser showPromo>
      <SEOHead title={t.system.heroTitle} description={t.system.heroSubtitle} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'System / 01' : 'System / 01'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {isEnglish
                  ? 'Three pillars. One operating system for growth.'
                  : 'Drei Säulen. Ein Betriebssystem für Wachstum.'}
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                  {t.system.heroTitle}
                </h1>
                <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {t.system.heroSubtitle}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Visualization */}
      <section className="border-b border-border/60 py-20 sm:py-24">
        <div className="container-section">
          <div className="mb-12 text-center">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              {isEnglish ? 'The flow' : 'Der Ablauf'}
            </span>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* Aurora connector */}
            <div className="absolute top-1/2 left-0 right-0 h-px hidden md:block" style={{ background: 'var(--gradient-aurora)', opacity: 0.4 }} />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {pillars.map((p, i) => (
                <div key={p.key} className="relative bg-background border border-border/60 backdrop-blur-sm p-6 text-center group hover:border-primary/60 transition-colors">
                  <div className="font-editorial text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="inline-flex h-14 w-14 items-center justify-center border border-border/60 bg-card/40 mb-3 group-hover:border-primary/60 transition-colors">
                    <p.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-editorial text-lg font-semibold">
                    {p.key === 'traffic' ? 'Traffic' : p.key === 'conversion' ? 'Conversion' : 'AI Ops'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Detail */}
      {pillars.map((pillar, index) => {
        const num = String(index + 1).padStart(2, '0');
        const reversed = index % 2 === 1;
        return (
          <section key={index} className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
            {reversed && <div className="absolute inset-0 noise-overlay opacity-[0.03]" />}
            <div className="container-section relative">
              <div className="grid grid-cols-12 gap-6 lg:gap-12 items-start">
                <div className={`col-span-12 lg:col-span-5 ${reversed ? 'lg:order-2' : ''}`}>
                  <ScrollReveal>
                    <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase block mb-4">
                      Pillar {num}
                    </span>
                    <div className="inline-flex h-16 w-16 items-center justify-center border border-border/60 bg-card/40 mb-6">
                      <pillar.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
                      {pillar.title}
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </ScrollReveal>
                </div>

                <div className={`col-span-12 lg:col-span-7 ${reversed ? 'lg:order-1' : ''}`}>
                  <ScrollReveal>
                    <div className="border border-border/60 bg-card/40 backdrop-blur-sm p-8 sm:p-10">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                        <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                          {isEnglish ? 'Typical Outputs' : 'Typische Outputs'}
                        </span>
                        <span className="font-editorial text-xs text-muted-foreground tracking-wider">
                          {pillar.outputs.length} items
                        </span>
                      </div>
                      <ul className="space-y-4">
                        {pillar.outputs.map((output, idx) => (
                          <li key={idx} className="flex items-start gap-4 group">
                            <span className="font-editorial text-xs font-semibold tracking-[0.2em] text-muted-foreground/70 pt-1.5 flex-shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                            <span className="text-foreground/90 leading-relaxed group-hover:text-foreground transition-colors">
                              {output}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-sunset)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.05]" />
        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {isEnglish ? 'Implement' : 'Umsetzen'}
              </span>
              <h2 className="mt-4 font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                {isEnglish ? (
                  <>Ready to run <em className="italic text-aurora">the system?</em></>
                ) : (
                  <>Bereit, das <em className="italic text-aurora">System zu fahren?</em></>
                )}
              </h2>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                {isEnglish
                  ? 'Start with a free audit to see where you stand.'
                  : 'Starte mit einem Gratis Audit, um zu sehen, wo du stehst.'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <Link
                to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                className="group inline-flex items-center gap-3 border-aurora bg-background/40 backdrop-blur-md px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:bg-background/60 transition-all"
              >
                {t.cta.getAudit}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
