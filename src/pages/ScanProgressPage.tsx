import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionMarker, AIAnnotation } from '@/components/neural';
import { Loader2, CheckCircle, AlertCircle, Radio, Search, BarChart3, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const c = isEnglish
    ? { title: 'Reading your', titleAccent: 'signals.', subtitle: 'Our scanner is evaluating how well your key digital levers are working.', emailFallback: "We'll send the results by email as soon as they're ready.", live: 'Live', checks: 'Checks', eyebrow: '00 / Live Scan' }
    : { title: 'Wir lesen deine', titleAccent: 'Signale.', subtitle: 'Unser Scanner prüft, wie weit deine wichtigsten digitalen Hebel ausgeschöpft sind.', emailFallback: 'Wir senden dir die Resultate per E-Mail, sobald sie bereit sind.', live: 'Live', checks: 'Prüfungen', eyebrow: '00 / Live Scan' };

  const progress = status.checks_total > 0 ? Math.round((status.checks_passed / status.checks_total) * 100) : 0;

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Scan in progress' : 'Scan läuft'}
        description={isEnglish ? 'Your business scan is being prepared.' : 'Dein Business-Scan wird vorbereitet.'}
        noIndex
      />

      <section className="pt-28 md:pt-36 lg:pt-44 pb-24 md:pb-32">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            {/* Left — main */}
            <div className="col-span-12 lg:col-span-8">
              <SectionMarker index={0} total={4} label={c.eyebrow} />
              <h1 className="text-balance">
                <span className="block">{c.title}</span>
                <span className="block font-editorial italic text-foreground/85">{c.titleAccent}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {c.subtitle}
              </p>

              {/* Steps */}
              <ul className="mt-14 border-t border-border/80">
                {STEPS.map((step, idx) => {
                  const state = error ? 'pending' : getStepState(step.key, status.scan_status);
                  const num = String(idx + 1).padStart(2, '0');
                  return (
                    <li
                      key={step.key}
                      className={cn(
                        'grid grid-cols-12 gap-4 items-center py-6 border-b border-border/80 transition-opacity',
                        state === 'pending' && 'opacity-45',
                      )}
                    >
                      <span className={cn(
                        'col-span-1 font-mono text-xs tracking-[0.2em]',
                        state === 'pending' ? 'text-muted-foreground' : 'text-foreground/70',
                      )}>
                        {num}
                      </span>
                      <div className="col-span-1 flex justify-center">
                        {state === 'done' ? (
                          <CheckCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                        ) : state === 'active' ? (
                          <Loader2 className="w-5 h-5 text-foreground animate-spin" strokeWidth={1.5} />
                        ) : (
                          <step.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                        )}
                      </div>
                      <span className={cn(
                        'col-span-8 sm:col-span-9 text-2xl sm:text-3xl',
                        state === 'active' && 'font-editorial italic',
                      )}>
                        {isEnglish ? step.en : step.de}
                      </span>
                      <span className="col-span-2 sm:col-span-1 text-right">
                        {state === 'active' && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--signal))]">
                            {c.live}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {error && (
                <div className="mt-12 card-paper p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-lg">{error}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.emailFallback}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right — annotation column */}
            <aside className="hidden lg:flex col-span-4 lg:col-start-9 flex-col gap-6 pt-2">
              <div className="rule-hairline w-12" />
              <AIAnnotation>
                {isEnglish
                  ? 'gemini-2.5-flash · scanning public signals · typically 30–90s'
                  : 'gemini-2.5-flash · prüft öffentliche Signale · meist 30–90s'}
              </AIAnnotation>

              {status.checks_total > 0 && !error && (
                <div className="card-paper p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {c.checks}
                    </span>
                    <span className="font-editorial text-3xl text-foreground">
                      {status.checks_passed}
                      <span className="text-base text-muted-foreground">/{status.checks_total}</span>
                    </span>
                  </div>
                  <div className="h-px bg-border relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-foreground transition-all duration-500"
                      style={{ width: `${progress}%`, height: '2px', top: '-0.5px' }}
                    />
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
