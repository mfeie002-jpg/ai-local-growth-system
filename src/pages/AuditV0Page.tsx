import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Globe2, Loader2, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Turnstile, TURNSTILE_ENABLED } from '@/components/Turnstile';
import { siteConfig } from '@/config/site';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { getUTMParams } from '@/hooks/useUTMTracking';
import { track } from '@/lib/analytics';

type Lang = 'de' | 'en';

interface AuditV0PageProps {
  lang: Lang;
}

type AuditValues = {
  website_url: string;
  company_name: string;
  industry: string;
  region: string;
  primary_goal: string;
  primary_lead_source: string;
  challenges: string[];
  systems: string;
  first_name: string;
  last_name: string;
  email: string;
  consent_processing: boolean;
  consent_marketing: boolean;
  honeypot: string;
};

const initialValues: AuditValues = {
  website_url: '',
  company_name: '',
  industry: '',
  region: '',
  primary_goal: '',
  primary_lead_source: '',
  challenges: [],
  systems: '',
  first_name: '',
  last_name: '',
  email: '',
  consent_processing: false,
  consent_marketing: false,
  honeypot: '',
};

const copy = {
  de: {
    title: 'Kostenloser AI Business Audit',
    description: 'Regelbasierter Homepage-Quick-Check mit transparenten Evidenzstufen. Geschäftskontext wird separat erfasst und nicht in den automatischen Score eingerechnet.',
    eyebrow: 'Kostenloser Quick Audit',
    headline: 'Zuerst die Website. Dann der Geschäftskontext.',
    intro: 'Drei kurze Schritte. Öffentlich messbare Signale, Ihre Angaben und spätere Expertenprüfung bleiben vom automatischen Score getrennt.',
    steps: ['Website', 'Geschäft', 'Report-Link'],
    previous: 'Zurück',
    next: 'Weiter',
    submit: 'Business Audit starten',
    submitting: 'Audit wird angelegt…',
    processingConsent: 'Ich willige ein, dass meine Angaben zur Erstellung und Bereitstellung des Audits verarbeitet werden.',
    marketingConsent: 'Optional: Ich möchte relevante Hinweise und Angebote per E-Mail erhalten.',
  },
  en: {
    title: 'Free AI Business Audit',
    description: 'A rule-based homepage Quick Check with transparent evidence states. Business context is captured separately and is not included in the automated score.',
    eyebrow: 'Free Quick Audit',
    headline: 'Start with the website. Then add business context.',
    intro: 'Three short steps. Public measurements, your inputs and later expert review are kept separate from the automated score.',
    steps: ['Website', 'Business', 'Report link'],
    previous: 'Back',
    next: 'Continue',
    submit: 'Start Business Audit',
    submitting: 'Creating audit…',
    processingConsent: 'I agree that my information may be processed to create and provide the audit.',
    marketingConsent: 'Optional: I would like to receive relevant updates and offers by email.',
  },
} as const;

const websiteSchema = z.object({
  website_url: z.string().trim().min(4).max(500),
  company_name: z.string().trim().min(2).max(160),
});

const businessSchema = z.object({
  industry: z.string().trim().min(2).max(120),
  region: z.string().trim().min(2).max(120),
  primary_goal: z.string().trim().min(2).max(160),
  primary_lead_source: z.string().trim().min(2).max(120),
  challenges: z.array(z.string()).max(8),
  systems: z.string().trim().max(500),
});

const contactSchema = z.object({
  first_name: z.string().trim().min(2).max(80),
  last_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  consent_processing: z.literal(true),
  consent_marketing: z.boolean(),
  honeypot: z.string().max(0),
});

function normalizePreviewUrl(value: string): { url: string; host: string } | null {
  try {
    const withProtocol = /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`;
    const url = new URL(withProtocol);
    if (!url.hostname.includes('.')) return null;
    return { url: url.toString(), host: url.hostname };
  } catch {
    return null;
  }
}

function mapServerError(code: string | undefined, fallback: string | undefined, lang: Lang): string {
  const messages: Record<string, { de: string; en: string }> = {
    bot_check_failed: {
      de: 'Bot-Check fehlgeschlagen. Bitte laden Sie die Seite neu.',
      en: 'Bot check failed. Please reload the page.',
    },
    per_ip_daily_exceeded: {
      de: 'Das Tageslimit für diese Verbindung ist erreicht. Bitte versuchen Sie es später erneut.',
      en: 'The daily limit for this connection has been reached. Please try again later.',
    },
    global_daily_exceeded: {
      de: 'Der Audit ist vorübergehend ausgelastet. Bitte versuchen Sie es später erneut.',
      en: 'The audit is temporarily at capacity. Please try again later.',
    },
    url_malformed: { de: 'Bitte prüfen Sie die Website-URL.', en: 'Please check the website URL.' },
    url_blocked_host: { de: 'Diese Domain kann nicht geprüft werden.', en: 'This domain cannot be scanned.' },
    invalid_email: { de: 'Bitte prüfen Sie die E-Mail-Adresse.', en: 'Please check the email address.' },
  };
  return messages[code]?.[lang] || fallback || (lang === 'de' ? 'Bitte versuchen Sie es erneut.' : 'Please try again.');
}

export default function AuditV0Page({ lang }: AuditV0PageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const c = copy[lang];
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const submittingRef = useRef(false);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<AuditValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const preview = useMemo(() => normalizePreviewUrl(values.website_url), [values.website_url]);
  const auditType = useMemo(() => {
    const value = new URLSearchParams(location.search).get('type');
    return ['business', 'website', 'seo', 'ai-visibility', 'automation'].includes(value || '')
      ? value
      : 'business';
  }, [location.search]);

  useEffect(() => {
    track('audit_start', {
      audit_type: auditType,
      page_type: 'audit',
      page_path: location.pathname,
    });
  }, [auditType, location.pathname]);

  useEffect(() => {
    if (step > 1) headingRef.current?.focus();
  }, [step]);

  const setField = <K extends keyof AuditValues>(key: K, value: AuditValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }));
  };

  const setChallenge = (challenge: string, checked: boolean) => {
    setValues((current) => ({
      ...current,
      challenges: checked
        ? [...new Set([...current.challenges, challenge])]
        : current.challenges.filter((item) => item !== challenge),
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const result = currentStep === 1
      ? websiteSchema.safeParse(values)
      : currentStep === 2
        ? businessSchema.safeParse(values)
        : contactSchema.safeParse(values);
    if (result.success) {
      if (currentStep === 1 && !preview) {
        setErrors({ website_url: lang === 'de' ? 'Bitte geben Sie eine gültige Website-URL ein.' : 'Please enter a valid website URL.' });
        return false;
      }
      setErrors({});
      return true;
    }

    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      const labels: Record<string, { de: string; en: string }> = {
        website_url: { de: 'Bitte geben Sie eine gültige Website-URL ein.', en: 'Please enter a valid website URL.' },
        company_name: { de: 'Bitte geben Sie den Firmennamen ein.', en: 'Please enter the company name.' },
        industry: { de: 'Bitte geben Sie die Branche ein.', en: 'Please enter the industry.' },
        region: { de: 'Bitte geben Sie die Region ein.', en: 'Please enter the region.' },
        primary_goal: { de: 'Bitte wählen Sie das wichtigste Ziel.', en: 'Please choose the primary goal.' },
        primary_lead_source: { de: 'Bitte wählen Sie die wichtigste Lead-Quelle.', en: 'Please choose the primary lead source.' },
        first_name: { de: 'Bitte geben Sie den Vornamen ein.', en: 'Please enter the first name.' },
        last_name: { de: 'Bitte geben Sie den Nachnamen ein.', en: 'Please enter the last name.' },
        email: { de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', en: 'Please enter a valid email address.' },
        consent_processing: { de: 'Die Einwilligung zur Verarbeitung ist erforderlich.', en: 'Processing consent is required.' },
        honeypot: { de: 'Die Anfrage konnte nicht geprüft werden.', en: 'The request could not be validated.' },
      };
      next[key] = labels[key]?.[lang] || issue.message;
    }
    setErrors(next);
    return false;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    track('audit_step_complete', {
      audit_type: auditType,
      audit_step: step,
      page_type: 'audit',
    });
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!validateStep(3) || !preview) return;
    if (TURNSTILE_ENABLED && !turnstileToken) {
      toast.error(lang === 'de' ? 'Bitte schliessen Sie den Bot-Check ab.' : 'Please complete the bot check.');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    const utm = getUTMParams();
    try {
      const { data, error } = await supabase.functions.invoke('create-audit', {
        body: {
          ...values,
          website_url: preview.url,
          language: lang,
          audit_type: auditType,
          landing_page: utm.landing_page || location.pathname,
          referrer: utm.referrer || document.referrer || undefined,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_term: utm.utm_term,
          utm_content: utm.utm_content,
          gclid: utm.gclid,
          consent_version: '2026-07-25',
          turnstile_token: turnstileToken,
        },
      });

      const payload = (data || {}) as {
        success?: boolean;
        token?: string;
        redirect_path?: string;
        error?: string;
        code?: string;
      };
      if (
        error ||
        !payload.success ||
        typeof payload.token !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.token)
      ) {
        throw new Error(mapServerError(payload.code, payload.error || error?.message, lang));
      }

      track('audit_step_complete', { audit_type: auditType, audit_step: 3, page_type: 'audit' });
      track('audit_submit', {
        audit_type: auditType,
        page_type: 'audit',
        traffic_source: utm.utm_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });
      navigate(`${lang === 'en' ? '/en' : ''}/audit/r/${payload.token}`);
    } catch (error) {
      console.error('audit submit failed', error);
      toast.error(error instanceof Error ? error.message : mapServerError(undefined, undefined, lang));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const challenges = lang === 'de'
    ? ['Zu wenig Sichtbarkeit', 'Zu wenige qualifizierte Leads', 'Schwache Conversion', 'Unklares Tracking', 'CRM-/Follow-up-Lücken', 'Zu viel manuelle Arbeit']
    : ['Low visibility', 'Too few qualified leads', 'Weak conversion', 'Unclear tracking', 'CRM/follow-up gaps', 'Too much manual work'];

  return (
    <>
      <SEOHead
        title={c.title}
        description={c.description}
        canonical={lang === 'en'
          ? 'https://itsfeierabend.ch/en/ai-business-audit'
          : 'https://itsfeierabend.ch/ai-business-audit'}
        noIndex
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <header className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{c.eyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-balance outline-none">
              {lang === 'de'
                ? <>Zuerst die Website. Dann der Geschäfts<wbr />kontext.</>
                : c.headline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{c.intro}</p>
          </header>

          <ol className="mt-10 grid grid-cols-3 gap-2" aria-label={lang === 'de' ? 'Audit-Fortschritt' : 'Audit progress'}>
            {c.steps.map((label, index) => {
              const number = index + 1;
              const active = number === step;
              const complete = number < step;
              return (
                <li
                  key={label}
                  className={`rounded-md border p-3 ${active ? 'border-signal bg-signal/10' : 'border-border bg-card'}`}
                  aria-current={active ? 'step' : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${complete ? 'bg-signal text-background' : 'border border-border'}`}>
                      {complete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : number}
                    </span>
                    <span className="hidden text-sm sm:inline">{label}</span>
                  </div>
                </li>
              );
            })}
          </ol>

          <form method="post" onSubmit={handleSubmit} noValidate className="mt-5 rounded-md border border-border bg-card p-6 md:p-8">
            {step === 1 && (
              <section aria-labelledby="audit-step-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {lang === 'de' ? 'Schritt 1 von 3' : 'Step 1 of 3'}
                </p>
                <h2 id="audit-step-1" className="mt-3 text-2xl">
                  {lang === 'de' ? 'Welche Website soll geprüft werden?' : 'Which website should be assessed?'}
                </h2>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website_url">{lang === 'de' ? 'Website-URL' : 'Website URL'} *</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      type="url"
                      placeholder="https://unternehmen.ch"
                      value={values.website_url}
                      onChange={(event) => setField('website_url', event.target.value)}
                      autoComplete="url"
                      aria-invalid={!!errors.website_url}
                      aria-describedby={errors.website_url ? 'website-url-error' : undefined}
                    />
                    {errors.website_url && <p id="website-url-error" className="text-sm text-destructive">{errors.website_url}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">{lang === 'de' ? 'Firmenname' : 'Company name'} *</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={values.company_name}
                      onChange={(event) => setField('company_name', event.target.value)}
                      autoComplete="organization"
                      aria-invalid={!!errors.company_name}
                      aria-describedby={errors.company_name ? 'company-name-error' : undefined}
                    />
                    {errors.company_name && <p id="company-name-error" className="text-sm text-destructive">{errors.company_name}</p>}
                  </div>
                </div>

                {preview && (
                  <div className="mt-7 rounded-md border border-signal/30 bg-signal/10 p-5" aria-live="polite">
                    <div className="flex items-start gap-3">
                      <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{preview.host}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {lang === 'de'
                            ? 'Öffentlich prüfbar sind unter anderem Erreichbarkeit, HTML-Struktur, Metadaten, Indexierungshinweise, Trust- und Conversion-Signale. Analytics, CRM und interne Prozesse benötigen Ihre Angaben oder einen später freigegebenen Zugriff.'
                            : 'Public checks include availability, HTML structure, metadata, indexation hints, trust and conversion signals. Analytics, CRM and internal processes require your inputs or later approved access.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="audit-step-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {lang === 'de' ? 'Schritt 2 von 3' : 'Step 2 of 3'}
                </p>
                <h2 id="audit-step-2" className="mt-3 text-2xl">
                  {lang === 'de' ? 'Welcher Geschäftskontext zählt?' : 'Which business context matters?'}
                </h2>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">{lang === 'de' ? 'Branche' : 'Industry'} *</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={values.industry}
                      onChange={(event) => setField('industry', event.target.value)}
                      aria-invalid={!!errors.industry}
                    />
                    {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">{lang === 'de' ? 'Region / Markt' : 'Region / market'} *</Label>
                    <Input
                      id="region"
                      name="region"
                      placeholder={lang === 'de' ? 'z. B. Deutschschweiz' : 'e.g. German-speaking Switzerland'}
                      value={values.region}
                      onChange={(event) => setField('region', event.target.value)}
                      autoComplete="address-level1"
                      aria-invalid={!!errors.region}
                    />
                    {errors.region && <p className="text-sm text-destructive">{errors.region}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_goal">{lang === 'de' ? 'Wichtigstes Geschäftsziel' : 'Primary business goal'} *</Label>
                    <select
                      id="primary_goal"
                      name="primary_goal"
                      value={values.primary_goal}
                      onChange={(event) => setField('primary_goal', event.target.value)}
                      className="flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-invalid={!!errors.primary_goal}
                    >
                      <option value="">{lang === 'de' ? 'Bitte wählen' : 'Please choose'}</option>
                      <option value="qualified_leads">{lang === 'de' ? 'Mehr qualifizierte Leads' : 'More qualified leads'}</option>
                      <option value="visibility">{lang === 'de' ? 'Mehr relevante Sichtbarkeit' : 'More relevant visibility'}</option>
                      <option value="conversion">{lang === 'de' ? 'Conversion verbessern' : 'Improve conversion'}</option>
                      <option value="measurement">{lang === 'de' ? 'Messbarkeit herstellen' : 'Establish measurement'}</option>
                      <option value="automation">{lang === 'de' ? 'Prozesse automatisieren' : 'Automate processes'}</option>
                    </select>
                    {errors.primary_goal && <p className="text-sm text-destructive">{errors.primary_goal}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_lead_source">{lang === 'de' ? 'Wichtigste Lead-Quelle' : 'Primary lead source'} *</Label>
                    <select
                      id="primary_lead_source"
                      name="primary_lead_source"
                      value={values.primary_lead_source}
                      onChange={(event) => setField('primary_lead_source', event.target.value)}
                      className="flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-invalid={!!errors.primary_lead_source}
                    >
                      <option value="">{lang === 'de' ? 'Bitte wählen' : 'Please choose'}</option>
                      <option value="organic">{lang === 'de' ? 'Organische Suche' : 'Organic search'}</option>
                      <option value="paid">{lang === 'de' ? 'Bezahlte Anzeigen' : 'Paid advertising'}</option>
                      <option value="referrals">{lang === 'de' ? 'Empfehlungen / Partner' : 'Referrals / partners'}</option>
                      <option value="outbound">{lang === 'de' ? 'Vertrieb / Outbound' : 'Sales / outbound'}</option>
                      <option value="unknown">{lang === 'de' ? 'Unklar / nicht gemessen' : 'Unknown / not measured'}</option>
                    </select>
                    {errors.primary_lead_source && <p className="text-sm text-destructive">{errors.primary_lead_source}</p>}
                  </div>
                </div>

                <fieldset className="mt-7">
                  <legend className="text-sm font-medium">
                    {lang === 'de' ? 'Aktuelle Herausforderungen (optional)' : 'Current challenges (optional)'}
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {challenges.map((challenge) => (
                      <label key={challenge} className="flex min-h-12 min-w-0 cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                        <Checkbox
                          checked={values.challenges.includes(challenge)}
                          onCheckedChange={(checked) => setChallenge(challenge, checked === true)}
                        />
                        <span className="min-w-0 break-words text-sm">{challenge}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="systems">{lang === 'de' ? 'Vorhandene Tools / Systeme (optional)' : 'Current tools / systems (optional)'}</Label>
                  <Input
                    id="systems"
                    name="systems"
                    placeholder={lang === 'de' ? 'z. B. GA4, HubSpot, Excel' : 'e.g. GA4, HubSpot, Excel'}
                    value={values.systems}
                    onChange={(event) => setField('systems', event.target.value)}
                  />
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="audit-step-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {lang === 'de' ? 'Schritt 3 von 3' : 'Step 3 of 3'}
                </p>
                <h2 id="audit-step-3" className="mt-3 text-2xl">
                  {lang === 'de' ? 'Wohin darf der private Report-Link?' : 'Where should the private report link go?'}
                </h2>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">{lang === 'de' ? 'Vorname' : 'First name'} *</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={values.first_name}
                      onChange={(event) => setField('first_name', event.target.value)}
                      autoComplete="given-name"
                      aria-invalid={!!errors.first_name}
                    />
                    {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">{lang === 'de' ? 'Nachname' : 'Last name'} *</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={values.last_name}
                      onChange={(event) => setField('last_name', event.target.value)}
                      autoComplete="family-name"
                      aria-invalid={!!errors.last_name}
                    />
                    {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <Label htmlFor="email">{lang === 'de' ? 'E-Mail-Adresse' : 'Email address'} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => setField('email', event.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="sr-only" aria-hidden="true">
                  <Label htmlFor="audit-company-site">Company site</Label>
                  <Input
                    id="audit-company-site"
                    name="company_site"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.honeypot}
                    onChange={(event) => setField('honeypot', event.target.value)}
                  />
                </div>

                <div className="mt-6 space-y-4 border-t border-border pt-6">
                  <label className="flex min-h-12 cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={values.consent_processing}
                      onCheckedChange={(checked) => setField('consent_processing', checked === true)}
                      className="mt-1"
                      aria-invalid={!!errors.consent_processing}
                    />
                    <span className="text-sm leading-relaxed">{c.processingConsent} *</span>
                  </label>
                  {errors.consent_processing && <p className="text-sm text-destructive">{errors.consent_processing}</p>}

                  <label className="flex min-h-12 cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={values.consent_marketing}
                      onCheckedChange={(checked) => setField('consent_marketing', checked === true)}
                      className="mt-1"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">{c.marketingConsent}</span>
                  </label>
                </div>

                {TURNSTILE_ENABLED && (
                  <div className="mt-6 flex justify-center">
                    <Turnstile onToken={setTurnstileToken} />
                  </div>
                )}
              </section>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="min-h-12"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  {c.previous}
                </Button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <Button type="button" size="lg" className="min-h-12" onClick={nextStep}>
                  {c.next}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button type="submit" size="lg" className="min-h-12" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {submitting ? c.submitting : c.submit}
                </Button>
              )}
            </div>

            <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {lang === 'de'
                ? 'Privater Report-Link · separates itsFeierabend-Lead-System · Dauer abhängig von der erreichbaren Website'
                : 'Private report link · separate itsFeierabend lead system · timing depends on website availability'}
            </p>
            <noscript>
              <p className="mt-4 text-sm text-destructive">
                {lang === 'de'
                  ? `Für den automatischen Audit ist JavaScript erforderlich. Alternativ: ${siteConfig.email}.`
                  : `JavaScript is required for the automated audit. Alternatively: ${siteConfig.email}.`}
              </p>
            </noscript>
          </form>
        </div>
      </div>
    </>
  );
}
