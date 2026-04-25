import { Layout } from '@/components/Layout';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { Radar, Sparkles, Gauge, Search } from 'lucide-react';

export default function ScanPage() {
  const { isEnglish } = useLanguage();

  const highlights = [
    { icon: Search, label: isEnglish ? 'Visibility scan' : 'Sichtbarkeits-Scan' },
    { icon: Gauge, label: isEnglish ? 'Performance check' : 'Performance-Check' },
    { icon: Sparkles, label: isEnglish ? 'AI-powered insights' : 'KI-gestützte Insights' },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Free Business Scanner | itsFeierabend' : 'Gratis Business Scanner | itsFeierabend'}
        description={isEnglish ? 'Get a free AI-powered analysis of your website.' : 'Erhalte eine kostenlose KI-gestützte Analyse deiner Website.'}
      />

      {/* Hero — Editorial */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)' }}
          aria-hidden
        />

        <SectionContainer padding="large">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: editorial copy */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 00 / Free Scan' : '§ 00 / Gratis Scan'}
                </span>
              </div>

              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{isEnglish ? 'Scan your' : 'Scanne deine'}</span>
                <span className="block italic text-aurora">{isEnglish ? 'potential.' : 'Potenziale.'}</span>
              </h1>

              <p className="max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {isEnglish
                  ? 'A free AI-powered look at where your website can grow. No signup, no spam — just the insights.'
                  : 'Ein gratis KI-gestützter Blick auf das Wachstumspotenzial deiner Website. Kein Signup, kein Spam — nur die Insights.'}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {highlights.map(({ icon: Icon, label }, i) => (
                  <li key={i} className="glass-panel rounded-xl p-4 flex items-center gap-3">
                    <Icon className="w-5 h-5 text-aurora flex-shrink-0" />
                    <span className="text-sm text-foreground font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <div className="glass-panel rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Radar className="w-5 h-5 text-aurora" />
                    <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                      {isEnglish ? 'Start scan' : 'Scan starten'}
                    </span>
                  </div>
                  <AnalysisRequestForm variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
