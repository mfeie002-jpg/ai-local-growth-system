import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { Loader2, CheckCircle, AlertCircle, Radio, Search, BarChart3, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ScanStatus = 'queued' | 'collecting' | 'normalizing' | 'scoring' | 'interpreting' | 'complete' | 'complete_no_ai' | 'evidence_collected' | 'scored' | 'partial' | 'failed' | 'error' | 'legacy';

interface StatusData {
  scan_status: ScanStatus;
  checks_passed: number;
  checks_total: number;
}

const POLL_INTERVAL = 3000;

const STEPS = [
  { key: 'collecting', icon: Search, de: 'Daten sammeln', en: 'Collecting data' },
  { key: 'normalizing', icon: Radio, de: 'Bereiche auswerten', en: 'Evaluating areas' },
  { key: 'scoring', icon: BarChart3, de: 'Reifegrad berechnen', en: 'Calculating maturity' },
  { key: 'interpreting', icon: Brain, de: 'Potenziale identifizieren', en: 'Identifying opportunities' },
] as const;

const STATUS_ORDER: ScanStatus[] = ['queued', 'collecting', 'evidence_collected', 'normalizing', 'scoring', 'scored', 'interpreting', 'complete'];

function getStepState(stepKey: string, currentStatus: ScanStatus): 'pending' | 'active' | 'done' {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const stepIdx = STATUS_ORDER.indexOf(stepKey as ScanStatus);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

export default function ScanProgressPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();
  const [status, setStatus] = useState<StatusData>({ scan_status: 'queued', checks_passed: 0, checks_total: 0 });
  const [error, setError] = useState<string | null>(null);

  const pollStatus = useCallback(async () => {
    if (!token) return;
    try {
      const { data, error: fnError } = await supabase.functions.invoke('scan-status', { body: { token } });
      if (fnError) throw fnError;
      if (data) setStatus(data);
      if (data?.scan_status === 'complete' || data?.scan_status === 'complete_no_ai') {
        const prefix = isEnglish ? '/en/analysis' : '/analyse';
        navigate(`${prefix}/${token}`, { replace: true });
      }
      if (data?.scan_status === 'failed' || data?.scan_status === 'error') {
        setError(isEnglish ? "Analysis could not be completed. We'll email you the results." : 'Analyse konnte nicht abgeschlossen werden. Wir senden dir die Resultate per E-Mail.');
      }
    } catch (e) {
      console.error('Poll error:', e);
    }
  }, [token, navigate, isEnglish]);

  useEffect(() => {
    pollStatus();
    const interval = setInterval(pollStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [pollStatus]);

  const content = isEnglish
    ? { title: 'Analysing your', titleAccent: 'potential.', subtitle: 'Our scanner is evaluating how well your key digital levers are utilised.', emailFallback: "We'll send you the results by email as soon as they're ready." }
    : { title: 'Dein Potenzial', titleAccent: 'wird sichtbar.', subtitle: 'Unser Scanner prüft, wie weit deine wichtigsten digitalen Hebel ausgeschöpft sind.', emailFallback: 'Wir senden dir die Resultate per E-Mail, sobald sie bereit sind.' };

  const progress = status.checks_total > 0 ? Math.round((status.checks_passed / status.checks_total) * 100) : 0;

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Scan in progress' : 'Scan läuft'}
        description={isEnglish ? 'Your business scan is being prepared.' : 'Dein Business-Scan wird vorbereitet.'}
        noIndex
      />

      <section className="relative overflow-hidden min-h-[80vh] flex items-center py-20 sm:py-28">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)', animationDelay: '1.5s' }}
          aria-hidden
        />

        <SectionContainer>
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Meta sidebar */}
            <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 00 / Live Scan' : '§ 00 / Live Scan'}
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <Sparkles className="h-6 w-6 text-aurora" />
                <p className="font-editorial text-lg leading-snug">
                  {isEnglish ? 'Hold tight — this typically takes 30–90 seconds.' : 'Einen Moment — das dauert üblicherweise 30–90 Sekunden.'}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {content.subtitle}
                </p>
              </div>

              {status.checks_total > 0 && !error && (
                <div className="glass-panel rounded-2xl p-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                      {isEnglish ? 'Checks' : 'Prüfungen'}
                    </span>
                    <span className="font-editorial text-2xl text-aurora italic">
                      {status.checks_passed}<span className="text-muted-foreground text-sm">/{status.checks_total}</span>
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: 'var(--gradient-aurora)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </aside>

            {/* Main */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-12">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{content.title}</span>
                <span className="block italic text-aurora">{content.titleAccent}</span>
              </h1>

              {/* Steps */}
              <div className="border-t border-border/60">
                {STEPS.map((step, idx) => {
                  const state = error ? 'pending' : getStepState(step.key, status.scan_status);
                  const num = String(idx + 1).padStart(2, '0');
                  return (
                    <motion.div
                      key={step.key}
                      className={cn(
                        'flex items-center gap-6 py-6 border-b border-border/60 transition-all duration-500',
                        state === 'pending' && 'opacity-40',
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: state === 'pending' ? 0.4 : 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <span className={cn(
                        'font-editorial text-sm tracking-widest w-8',
                        state === 'done' || state === 'active' ? 'text-aurora' : 'text-muted-foreground',
                      )}>
                        {num}
                      </span>

                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all',
                        state === 'active' && 'border-transparent shadow-lg',
                        state === 'done' && 'border-aurora/30 bg-aurora/5',
                        state === 'pending' && 'border-border/60 bg-muted/30',
                      )}
                        style={state === 'active' ? { background: 'var(--gradient-aurora)' } : undefined}
                      >
                        {state === 'done' ? (
                          <CheckCircle className="w-5 h-5 text-aurora" />
                        ) : state === 'active' ? (
                          <Loader2 className="w-5 h-5 text-background animate-spin" />
                        ) : (
                          <step.icon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>

                      <span className={cn(
                        'font-editorial text-2xl sm:text-3xl flex-1',
                        state === 'done' && 'text-foreground',
                        state === 'active' && 'text-foreground italic',
                        state === 'pending' && 'text-muted-foreground',
                      )}>
                        {isEnglish ? step.en : step.de}
                      </span>

                      {state === 'active' && (
                        <span className="hidden sm:inline-flex font-editorial text-xs tracking-[0.25em] uppercase text-aurora">
                          {isEnglish ? 'Live' : 'Live'}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-2xl p-6 flex items-start gap-4"
                  >
                    <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-editorial text-lg text-foreground">{error}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{content.emailFallback}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
