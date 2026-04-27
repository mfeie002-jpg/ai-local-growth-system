import { Layout } from '@/components/Layout';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { SEOHead } from '@/components/SEOHead';
import { AIAnnotation } from '@/components/neural';
import { Radar, Sparkles, Gauge, Search } from 'lucide-react';

export default function ScanPage() {
  const { isEnglish } = useLanguage();
  const isDE = !isEnglish;

  const highlights = [
    { icon: Search, label: isDE ? 'Sichtbarkeits-Scan' : 'Visibility scan' },
    { icon: Gauge, label: isDE ? 'Performance-Check' : 'Performance check' },
    { icon: Sparkles, label: isDE ? 'KI-gestützte Insights' : 'AI-powered insights' },
  ];

  return (
    <Layout>
      <SEOHead
        title={isDE ? 'Gratis Business Scanner | itsFeierabend' : 'Free Business Scanner | itsFeierabend'}
        description={
          isDE
            ? 'Erhalte eine kostenlose KI-gestützte Analyse deiner Website.'
            : 'Get a free AI-powered analysis of your website.'
        }
      />

      <section data-neural-zone className="pt-28 md:pt-36 lg:pt-44 pb-24 md:pb-32 border-b border-border">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            {/* Left: editorial copy */}
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-10">
                <span className="signal-dot" aria-hidden />
                <span className="section-marker">
                  {isDE ? '§ 00 · Gratis Scan' : '§ 00 · Free Scan'}
                </span>
              </div>

              <h1 className="text-balance text-5xl md:text-7xl lg:text-8xl font-editorial font-semibold leading-[0.95]">
                {isDE ? (
                  <>
                    Scanne dein <em className="italic text-signal">Potenzial</em>.
                  </>
                ) : (
                  <>
                    Scan your <em className="italic text-signal">potential</em>.
                  </>
                )}
              </h1>

              <p className="mt-8 max-w-xl text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {isDE
                  ? 'Ein gratis KI-gestützter Blick auf das Wachstumspotenzial deiner Website. Kein Signup, kein Spam — nur die Insights.'
                  : 'A free AI-powered look at where your website can grow. No signup, no spam — just the insights.'}
              </p>

              <ul className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                {highlights.map(({ icon: Icon, label }, i) => (
                  <li key={i} className="border-t border-foreground pt-4 flex items-start gap-3">
                    <Icon className="w-4 h-4 text-signal flex-shrink-0 mt-1" />
                    <span className="font-editorial text-base leading-snug">{label}</span>
                  </li>
                ))}
              </ul>

              <div className="hidden lg:block mt-16 max-w-md">
                <AIAnnotation>
                  {isDE
                    ? 'Der Scanner liefert in 30–90 Sekunden einen ersten Reifegrad — ohne Daten zu speichern, die du nicht freigibst.'
                    : 'The scanner returns a first maturity score in 30–90 seconds — without storing data you have not released.'}
                </AIAnnotation>
              </div>
            </div>

            {/* Right: form */}
            <div className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <div className="border border-border bg-background p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                    <Radar className="w-4 h-4 text-signal" />
                    <span className="section-marker">
                      {isDE ? 'Scan starten' : 'Start scan'}
                    </span>
                  </div>
                  <AnalysisRequestForm variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
