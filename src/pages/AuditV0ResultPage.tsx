import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { NoIndex } from "@/components/NoIndex";

type Lang = "de" | "en";

interface Signal {
  id: string;
  category: string;
  name: string;
  value: string | number | boolean | null;
  evidence: string;
  score: number;
  max_score: number;
  recommendation: string;
  passed: boolean;
}
interface TopAction {
  rank: number;
  signal_id: string;
  category: string;
  title: string;
  recommendation: string;
  impact: number;
}
interface CategoryScore { score: number; max: number; percent: number; }
interface Report {
  token: string;
  website_url: string;
  normalized_domain: string;
  first_name: string;
  language: Lang;
  status: "pending" | "fetching" | "scoring" | "ready" | "partial" | "failed";
  overall_score: number | null;
  category_scores: Record<string, CategoryScore> | null;
  signals: Signal[] | null;
  top_actions: TopAction[] | null;
  score_version: string | null;
  completed_at: string | null;
  created_at: string;
  fetch_meta: Record<string, unknown> | null;
  error: string | null;
}

const CATEGORIES: Array<{ key: string; de: string; en: string }> = [
  { key: "technical", de: "Technische Gesundheit", en: "Technical health" },
  { key: "content", de: "Inhalt & Suchintention", en: "Content & search intent" },
  { key: "trust", de: "Vertrauen", en: "Trust" },
  { key: "conversion", de: "Conversion", en: "Conversion" },
  { key: "automation", de: "Automatisierung", en: "Automation readiness" },
];

const TIMEOUT_MS = 90_000;

interface Props { lang: Lang; }

export default function AuditV0ResultPage({ lang }: Props) {
  const { token } = useParams<{ token: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const viewTracked = useRef(false);
  const startedAt = useRef(Date.now());

  const isPending = report && ["pending", "fetching", "scoring"].includes(report.status);

  const fetchReport = useCallback(async (event?: "view" | "cta_click") => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke("get-audit-report-v0", {
        body: { token, event },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data as Report);
      return data as Report;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    let interval: number | undefined;

    const tick = async () => {
      const r = await fetchReport();
      if (cancelled) return;
      if (!r) return;
      const pending = ["pending", "fetching", "scoring"].includes(r.status);
      if (!pending) {
        if (interval) clearInterval(interval);
        if ((r.status === "ready" || r.status === "partial") && !viewTracked.current) {
          viewTracked.current = true;
          fetchReport("view");
          trackEvent("audit_report_viewed", { score: r.overall_score, status: r.status });
        }
      }
      if (Date.now() - startedAt.current > TIMEOUT_MS && pending) {
        if (interval) clearInterval(interval);
        setTimedOut(true);
      }
    };

    tick();
    interval = window.setInterval(tick, 3000);
    return () => { cancelled = true; if (interval) clearInterval(interval); };
  }, [token, fetchReport]);

  const handleCta = useCallback(() => {
    trackEvent("audit_cta_click", { token });
    fetchReport("cta_click");
  }, [fetchReport, token]);

  const strings = {
    de: {
      loading: "Wir analysieren deine Seite. Das dauert 30–60 Sekunden…",
      timeout: "Das dauert länger als erwartet. Wir arbeiten im Hintergrund weiter — lade die Seite in ein paar Minuten neu.",
      failed: "Der Audit konnte nicht abgeschlossen werden.",
      partial: "Wir konnten die Seite nur teilweise analysieren.",
      score: "Gesamt-Score",
      version: "Score-Version",
      top: "Top 3 Handlungen",
      allSignals: "Alle Signale",
      pass: "OK",
      fail: "Handlung nötig",
      cta: "Kostenloses Beratungsgespräch buchen",
      ctaSub: "20 Minuten. Kein Sales-Pitch. Konkret zu diesen drei Punkten.",
      openSite: "Analysierte URL öffnen",
      evidence: "Evidenz",
      recommendation: "Empfehlung",
      backHome: "Zur Startseite",
    },
    en: {
      loading: "We're analyzing your site. This takes 30–60 seconds…",
      timeout: "This is taking longer than expected. We're still working — reload in a few minutes.",
      failed: "The audit could not be completed.",
      partial: "We were only able to analyze the site partially.",
      score: "Overall score",
      version: "Score version",
      top: "Top 3 actions",
      allSignals: "All signals",
      pass: "OK",
      fail: "Action needed",
      cta: "Book a free consultation",
      ctaSub: "20 minutes. No sales pitch. Focused on these three points.",
      openSite: "Open analyzed URL",
      evidence: "Evidence",
      recommendation: "Recommendation",
      backHome: "Back to home",
    },
  }[lang];

  if (error) {
    return (
      <FullState icon={<XCircle className="w-8 h-8 text-destructive" />} title={strings.failed} detail={error} />
    );
  }
  if (!report) {
    return <FullState icon={<Loader2 className="w-8 h-8 animate-spin text-primary" />} title={strings.loading} />;
  }
  if (isPending && timedOut) {
    return <FullState icon={<AlertTriangle className="w-8 h-8 text-amber-600" />} title={strings.timeout} />;
  }
  if (isPending) {
    return <FullState icon={<Loader2 className="w-8 h-8 animate-spin text-primary" />} title={strings.loading} detail={report.website_url} />;
  }
  if (report.status === "failed") {
    return (
      <FullState
        icon={<XCircle className="w-8 h-8 text-destructive" />}
        title={strings.failed}
        detail={report.error ?? undefined}
      />
    );
  }

  const scoreColor =
    (report.overall_score ?? 0) >= 75 ? "text-green-600" :
    (report.overall_score ?? 0) >= 50 ? "text-amber-600" : "text-destructive";

  return (
    <>
      <NoIndex />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Hero */}
          <header className="border-b border-border pb-10">
            {report.status === "partial" && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{strings.partial}</span>
              </div>
            )}
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {lang === "de" ? "Website-Audit" : "Website audit"} · {report.score_version}
            </p>
            <h1 className="text-3xl md:text-5xl font-serif leading-tight text-foreground">
              {report.normalized_domain}
            </h1>
            <a
              href={report.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              {strings.openSite} <ExternalLink className="w-3 h-3" />
            </a>

            <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-end">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{strings.score}</p>
                <div className={`text-7xl md:text-8xl font-serif font-light ${scoreColor}`}>
                  {report.overall_score ?? "—"}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => {
                  const cs = report.category_scores?.[cat.key];
                  return (
                    <div key={cat.key} className="p-3 border border-border rounded-lg bg-card">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground truncate">
                        {lang === "de" ? cat.de : cat.en}
                      </p>
                      <p className="text-2xl font-serif mt-1">{cs?.percent ?? 0}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </header>

          {/* Top actions */}
          {report.top_actions && report.top_actions.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-6">{strings.top}</h2>
              <ol className="space-y-4">
                {report.top_actions.map((a) => (
                  <li key={a.signal_id} className="flex gap-5 p-5 border border-border rounded-xl bg-card">
                    <span className="text-4xl font-serif text-muted-foreground">{a.rank}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-foreground">{a.title}</p>
                      <p className="text-muted-foreground mt-1">{a.recommendation}</p>
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-2">
                        {a.category}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* CTA */}
          <section className="p-8 md:p-10 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-2">
              {lang === "de" ? "Bereit für den nächsten Schritt?" : "Ready for the next step?"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{strings.ctaSub}</p>
            <Button asChild size="lg" onClick={handleCta}>
              <Link to={lang === "en" ? "/en/gratis-call" : "/gratis-call"}>
                {strings.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </section>

          {/* All signals */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif mb-6">{strings.allSignals}</h2>
            <div className="space-y-8">
              {CATEGORIES.map((cat) => {
                const catSignals = report.signals?.filter((s) => s.category === cat.key) ?? [];
                if (catSignals.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <h3 className="text-lg font-semibold mb-3">
                      {lang === "de" ? cat.de : cat.en}
                    </h3>
                    <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-card">
                      {catSignals.map((s) => (
                        <div key={s.id} className="p-4 md:p-5 grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-start">
                          {s.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{s.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-mono text-xs uppercase tracking-widest mr-2">{strings.evidence}:</span>
                              {s.evidence}
                            </p>
                            {!s.passed && (
                              <p className="text-sm mt-1">
                                <span className="font-mono text-xs uppercase tracking-widest mr-2 text-muted-foreground">{strings.recommendation}:</span>
                                {s.recommendation}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm font-mono text-muted-foreground whitespace-nowrap">
                            {s.score}/{s.max_score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="pt-8 border-t border-border text-center">
            <Link to={lang === "en" ? "/en" : "/"} className="text-sm text-muted-foreground hover:text-primary">
              {strings.backHome}
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}

function FullState({ icon, title, detail }: { icon: React.ReactNode; title: string; detail?: string }) {
  return (
    <>
      <NoIndex />
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="flex justify-center">{icon}</div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {detail && <p className="text-sm text-muted-foreground break-all">{detail}</p>}
        </div>
      </main>
    </>
  );
}
