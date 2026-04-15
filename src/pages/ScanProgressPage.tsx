import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Loader2, CheckCircle, AlertCircle, Radio, Sparkles, Search, BarChart3, Brain } from 'lucide-react';
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
  { key: 'collecting', icon: Search, de: 'Daten sammeln', en: 'Collecting Evidence' },
  { key: 'normalizing', icon: Radio, de: 'Signale normalisieren', en: 'Normalizing Signals' },
  { key: 'scoring', icon: BarChart3, de: 'Score berechnen', en: 'Calculating Scores' },
  { key: 'interpreting', icon: Brain, de: 'KI-Analyse erstellen', en: 'AI Interpretation' },
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
      const { data, error: fnError } = await supabase.functions.invoke('scan-status', {
        body: { token },
      });
      if (fnError) throw fnError;
      if (data) setStatus(data);
      if (data?.scan_status === 'complete' || data?.scan_status === 'complete_no_ai') {
        const prefix = isEnglish ? '/en/analysis' : '/analyse';
        navigate(`${prefix}/${token}`, { replace: true });
      }
      if (data?.scan_status === 'failed' || data?.scan_status === 'error') {
        setError(isEnglish ? 'Analysis could not be completed. We\'ll email you the results.' : 'Analyse konnte nicht abgeschlossen werden. Wir senden dir die Resultate per E-Mail.');
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
    ? { title: 'Analyzing Your Website', subtitle: 'Our AI scanner is examining your digital presence.', emailFallback: 'We\'ll send you the results by email as soon as they\'re ready.' }
    : { title: 'Deine Website wird analysiert', subtitle: 'Unser KI-Scanner untersucht deine digitale Präsenz.', emailFallback: 'Wir senden dir die Resultate per E-Mail, sobald sie bereit sind.' };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-ai/10 border border-ai/20">
              <Sparkles className="w-3.5 h-3.5 text-ai" />
              <span className="text-xs font-medium text-ai">Business Scanner</span>
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">{content.title}</h1>
            <p className="text-muted-foreground">{content.subtitle}</p>
          </div>

          <div className="space-y-4 text-left">
            {STEPS.map((step) => {
              const state = error ? 'pending' : getStepState(step.key, status.scan_status);
              return (
                <motion.div
                  key={step.key}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-all duration-500',
                    state === 'active' && 'bg-ai/5 border-ai/30 shadow-lg shadow-ai/5',
                    state === 'done' && 'bg-primary/5 border-primary/20',
                    state === 'pending' && 'bg-card/50 border-border/50 opacity-50',
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: state === 'pending' ? 0.5 : 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    state === 'active' && 'bg-ai/20 text-ai',
                    state === 'done' && 'bg-primary/20 text-primary',
                    state === 'pending' && 'bg-muted text-muted-foreground',
                  )}>
                    {state === 'done' ? <CheckCircle className="w-5 h-5" /> : state === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="font-medium">{isEnglish ? step.en : step.de}</span>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">{error}</p>
                  <p className="text-muted-foreground mt-1">{content.emailFallback}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status.checks_total > 0 && !error && (
            <p className="text-xs text-muted-foreground">
              {status.checks_passed}/{status.checks_total} checks
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
