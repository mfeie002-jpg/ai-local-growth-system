import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
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
  state?: "measured" | "user_provided" | "inferred" | "estimated" | "unavailable";
  source?: string;
  confidence?: "high" | "medium" | "low";
  unavailable?: boolean;
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
  language: Lang;
  audit_type: "business" | "website" | "seo" | "ai-visibility" | "automation";
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
  { key: "automation", de: "Technische Auffindbarkeit", en: "Machine-readable discovery" },
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
  const consecutiveFailures = useRef(0);

  const isPending = report && ["pending", "fetching", "scoring"].includes(report.status);

  const fetchReport = useCallback(async (event?: "view" | "cta_click") => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke("get-audit-report-v0", {
        body: { token, event },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      consecutiveFailures.current = 0;
      setError(null);
      setReport(data as Report);
      return data as Report;
    } catch {
      consecutiveFailures.current += 1;
      if (consecutiveFailures.current >= 3) {
        setError(lang === "de"
          ? "Der Report ist vorübergehend nicht erreichbar. Bitte laden Sie die Seite in einigen Minuten erneut."
          : "The report is temporarily unavailable. Please reload this page in a few minutes.");
      }
      return null;
    }
  }, [lang, token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

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
          track("audit_result_view", {
            lead_score: r.overall_score ?? undefined,
            audit_type: r.audit_type,
            result_status: r.status,
            page_type: "audit_result",
          });
        }
      }
      if (Date.now() - startedAt.current > TIMEOUT_MS && pending) {
        if (interval) clearInterval(interval);
        setTimedOut(true);
      }
    };

    const interval = window.setInterval(tick, 3000);
    void tick();
    return () => { cancelled = true; if (interval) clearInterval(interval); };
  }, [token, fetchReport]);

  const handleCta = useCallback(() => {
    track("consultation_cta_click", {
      audit_type: report?.audit_type ?? "business",
      cta_location: "audit_result",
      page_type: "audit_result",
    });
    fetchReport("cta_click");
  }, [fetchReport, report?.audit_type]);

  const strings = {
    de: {
      loading: "Die öffentlich erreichbaren Signale werden geprüft…",
      timeout: "Die Analyse dauert länger als erwartet. Sie läuft im Hintergrund weiter; laden Sie diese Seite später erneut.",
      failed: "Der Audit konnte nicht abgeschlossen werden.",
      partial: "Wir konnten die Seite nur teilweise analysieren.",
      scope: "Der Quick Score basiert ausschliesslich auf automatisch messbaren, öffentlich erreichbaren Signalen der eingegebenen Startseite. Branche, Region, Ziel und Systeme werden nicht in den Score eingerechnet; sie dienen nur der Einordnung einer vertieften Analyse.",
      score: "Gesamt-Score",
      version: "Score-Version",
      strengths: "Belegte Stärken",
      top: "Grösste Risiken und priorisierte Massnahmen",
      allSignals: "Alle Signale",
      pass: "OK",
      fail: "Handlung nötig",
      cta: "Vertiefte Analyse anfragen",
      ctaSub: "Befunde einordnen, fehlende Daten klären und den nächsten sinnvollen Umfang definieren.",
      openSite: "Analysierte URL öffnen",
      evidence: "Evidenz",
      recommendation: "Empfehlung",
      backHome: "Zur Startseite",
    },
    en: {
      loading: "We are checking the publicly available signals…",
      timeout: "This is taking longer than expected. We're still working — reload in a few minutes.",
      failed: "The audit could not be completed.",
      partial: "We were only able to analyze the site partially.",
      scope: "The Quick Score uses only automatically measurable, publicly accessible signals from the submitted homepage. Industry, region, goals and systems are not included in the score; they are used only to scope a deeper analysis.",
      score: "Overall score",
      version: "Score version",
      strengths: "Evidence-backed strengths",
      top: "Largest risks and prioritized actions",
      allSignals: "All signals",
      pass: "OK",
      fail: "Action needed",
      cta: "Request a deeper analysis",
      ctaSub: "Review the findings, identify missing data and define the next sensible scope.",
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
    return <PendingState lang={lang} url={undefined} phase="fetching" />;
  }
  if (isPending && timedOut) {
    return <FullState icon={<AlertTriangle className="w-8 h-8 text-amber-600" />} title={strings.timeout} />;
  }
  if (isPending) {
    return <PendingState lang={lang} url={report.website_url} phase={report.status as "pending" | "fetching" | "scoring"} />;
  }
  if (report.status === "failed") {
    return (
      <FullState
        icon={<XCircle className="w-8 h-8 text-destructive" />}
        title={strings.failed}
      />
    );
  }

  const scoreColor =
    report.overall_score == null ? "text-muted-foreground" :
    report.overall_score >= 75 ? "text-green-600" :
    (report.overall_score ?? 0) >= 50 ? "text-amber-600" : "text-destructive";
  const strengths = (report.signals ?? [])
    .filter((signal) =>
      signal.passed &&
      signal.score > 0 &&
      signal.state !== "unavailable" &&
      !signal.unavailable
    )
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 3);
  const auditLabels: Record<Report["audit_type"], { de: string; en: string }> = {
    business: { de: "AI Business Quick Audit", en: "AI Business Quick Audit" },
    website: { de: "Website Quick Audit", en: "Website Quick Audit" },
    seo: { de: "SEO Quick Audit", en: "SEO Quick Audit" },
    "ai-visibility": { de: "AI Visibility Quick Audit", en: "AI Visibility Quick Audit" },
    automation: { de: "Automation Quick Audit", en: "Automation Quick Audit" },
  };
  const auditLabel = auditLabels[report.audit_type]?.[lang] ?? auditLabels.business[lang];

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-background">
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
              {report.status === "partial"
                ? (lang === "de" ? "Vorläufiger Audit" : "Preliminary audit")
                : auditLabel} · {report.score_version ?? "pending"}
            </p>
            <h1 className="break-all text-3xl md:text-5xl font-serif leading-tight text-foreground">
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
                      <p className="text-2xl font-serif mt-1">{cs ? `${cs.percent}%` : "—"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-6 max-w-4xl rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
              {strings.scope}
            </p>
          </header>

          {/* Evidence-backed strengths */}
          {strengths.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-serif mb-6">{strings.strengths}</h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {strengths.map((signal) => (
                  <li key={signal.id} className="p-5 border border-border rounded-xl bg-card">
                    <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                    <p className="mt-3 font-semibold text-foreground">{signal.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{signal.evidence}</p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground">
                      {signal.score}/{signal.max_score}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
                        {CATEGORIES.find((category) => category.key === a.category)?.[lang] ?? a.category}
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
              <Link to={lang === "en" ? "/en/contact?topic=deep-audit" : "/kontakt?topic=deep-audit"}>
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
                          {s.state === "unavailable" || s.unavailable ? (
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          ) : s.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{s.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                {s.state ?? "measured"}
                              </span>
                              {s.source && (
                                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                  {s.source}
                                </span>
                              )}
                              {s.confidence && (
                                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                  {lang === "de" ? "Konfidenz" : "Confidence"}: {s.confidence}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-mono text-xs uppercase tracking-widest mr-2">{strings.evidence}:</span>
                              {s.evidence}
                            </p>
                            {!s.passed && s.state !== "unavailable" && !s.unavailable && (
                              <p className="text-sm mt-1">
                                <span className="font-mono text-xs uppercase tracking-widest mr-2 text-muted-foreground">{strings.recommendation}:</span>
                                {s.recommendation}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm font-mono text-muted-foreground whitespace-nowrap">
                            {s.state === "unavailable" || s.unavailable ? "—" : `${s.score}/${s.max_score}`}
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
      </div>
    </>
  );
}

function FullState({ icon, title, detail }: { icon: React.ReactNode; title: string; detail?: string }) {
  return (
    <>
      <NoIndex />
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="flex justify-center">{icon}</div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {detail && <p className="text-sm text-muted-foreground break-all">{detail}</p>}
        </div>
      </div>
    </>
  );
}

function PendingState({
  lang,
  url,
  phase,
}: {
  lang: Lang;
  url: string | undefined;
  phase: "pending" | "fetching" | "scoring";
}) {
  const copy = lang === "de"
    ? {
        kicker: "Audit läuft",
        title: "Wir erstellen Ihren vorläufigen Report.",
        sub: "Der Report öffnet sich automatisch. Die Dauer hängt davon ab, wie die Website erreichbar ist.",
        steps: [
          { key: "fetch", label: "Website laden & Signale sammeln" },
          { key: "score", label: "Deterministisches Scoring (25+ Signale)" },
          { key: "render", label: "Report zusammenstellen" },
        ],
        note: "Diese Adresse ist bereits Ihr privater Report-Link. Falls der E-Mail-Versand konfiguriert ist, wird er zusätzlich zugestellt.",
      }
    : {
        kicker: "Audit running",
        title: "We're building your preliminary report.",
        sub: "The report opens automatically. Timing depends on how the website responds.",
        steps: [
          { key: "fetch", label: "Load site & collect signals" },
          { key: "score", label: "Deterministic scoring (25+ signals)" },
          { key: "render", label: "Assemble report" },
        ],
        note: "This address is already your private report link. If email delivery is configured, it will also be sent to you.",
      };

  const activeIdx = phase === "scoring" ? 1 : phase === "pending" ? 0 : 0;

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-background" data-neural-zone>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">{copy.kicker}</p>
          <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-4 text-foreground">{copy.title}</h1>
          <p className="text-lg text-muted-foreground mb-10">{copy.sub}</p>

          {url && (
            <p className="font-mono text-sm text-muted-foreground mb-8 break-all">{url}</p>
          )}

          <ol className="space-y-3 mb-8">
            {copy.steps.map((s, i) => {
              const isDone = i < activeIdx;
              const isActive = i === activeIdx;
              return (
                <li
                  key={s.key}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/60 backdrop-blur"
                >
                  <span className="flex-shrink-0 w-8 h-8 grid place-items-center rounded-full border border-border">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">{i + 1}</span>
                    )}
                  </span>
                  <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
                </li>
              );
            })}
          </ol>

          <p className="text-sm text-muted-foreground">{copy.note}</p>
        </div>
      </div>
    </>
  );
}
