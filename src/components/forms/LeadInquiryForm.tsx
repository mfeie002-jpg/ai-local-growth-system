import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getUTMParams } from '@/hooks/useUTMTracking';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '@/config/site';

interface LeadInquiryFormProps {
  type: 'contact' | 'partner';
}

type FormValues = {
  name: string;
  company_name: string;
  email: string;
  website_url: string;
  industry: string;
  region: string;
  primary_goal: string;
  message: string;
  consent_processing: boolean;
  consent_marketing: boolean;
  honeypot: string;
};

const initialValues: FormValues = {
  name: '',
  company_name: '',
  email: '',
  website_url: '',
  industry: '',
  region: '',
  primary_goal: '',
  message: '',
  consent_processing: false,
  consent_marketing: false,
  honeypot: '',
};

export function LeadInquiryForm({ type }: LeadInquiryFormProps) {
  const { language, isEnglish } = useLanguage();
  const location = useLocation();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const started = useRef(false);
  const submittingRef = useRef(false);

  const copy = useMemo(() => ({
    heading: type === 'partner'
      ? (isEnglish ? 'Partner enquiry' : 'Partneranfrage')
      : (isEnglish ? 'Project enquiry' : 'Projektanfrage'),
    submit: type === 'partner'
      ? (isEnglish ? 'Send partner enquiry' : 'Partneranfrage senden')
      : (isEnglish ? 'Send enquiry' : 'Anfrage senden'),
    success: type === 'partner'
      ? (isEnglish ? 'Thank you. Your partner enquiry has been recorded.' : 'Danke. Ihre Partneranfrage wurde erfasst.')
      : (isEnglish ? 'Thank you. Your enquiry has been recorded.' : 'Danke. Ihre Anfrage wurde erfasst.'),
  }), [isEnglish, type]);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }));
  };

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track(type === 'partner' ? 'partner_application_start' : 'lead_form_start', {
      form_name: type,
      page_type: type,
      page_path: location.pathname,
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = isEnglish ? 'Please enter your name.' : 'Bitte geben Sie Ihren Namen ein.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = isEnglish ? 'Please enter a valid email address.' : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    if (values.company_name.trim().length < 2) {
      next.company_name = isEnglish ? 'Please enter the company name.' : 'Bitte geben Sie den Firmennamen ein.';
    }
    if (values.message.trim().length < 10) {
      next.message = isEnglish ? 'Please add a little more context.' : 'Bitte beschreiben Sie die Ausgangslage etwas genauer.';
    }
    if (!values.consent_processing) {
      next.consent_processing = isEnglish ? 'Processing consent is required.' : 'Die Einwilligung zur Verarbeitung ist erforderlich.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    markStarted();
    if (!validate()) return;
    submittingRef.current = true;
    setStatus('submitting');

    const utm = getUTMParams();
    const topic = new URLSearchParams(location.search).get('topic') || type;

    try {
      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          ...values,
          language,
          lead_type: type === 'partner' ? 'partner_application' : 'contact',
          service_area: topic,
          landing_page: location.pathname,
          referrer: utm.referrer || document.referrer || undefined,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_term: utm.utm_term,
          utm_content: utm.utm_content,
          gclid: utm.gclid,
          user_agent: navigator.userAgent,
        },
      });

      if (error || !data?.success) {
        const message = data?.error || error?.message;
        throw new Error(message || 'submission_failed');
      }

      setStatus('success');
      track('lead_form_submit', {
        form_name: type,
        page_type: type,
        page_path: location.pathname,
        traffic_source: utm.utm_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });
      if (type === 'partner') {
        track('partner_application_submit', {
          form_name: type,
          page_type: type,
          page_path: location.pathname,
        });
      }
      track('lead_form_success', {
        form_name: type,
        page_type: type,
        page_path: location.pathname,
      });
    } catch (error) {
      console.error('lead enquiry failed', error);
      submittingRef.current = false;
      setErrors({
        form: isEnglish
          ? `The enquiry could not be saved. Please try again or email ${siteConfig.email}.`
          : `Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder schreiben Sie an ${siteConfig.email}.`,
      });
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-md border border-signal/40 bg-signal/10 p-8" role="status">
        <CheckCircle2 className="mb-4 h-8 w-8 text-signal" aria-hidden="true" />
        <h2 className="text-2xl">{copy.success}</h2>
        <p className="mt-3 text-muted-foreground">
          {isEnglish
            ? 'We will review the information and reply with a clear next step.'
            : 'Wir prüfen die Angaben und melden uns mit einem klaren nächsten Schritt.'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={markStarted}
      className="rounded-md border border-border bg-card p-6 md:p-8"
      noValidate
    >
      <h2 className="text-2xl">{copy.heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isEnglish ? 'Required fields are marked with *.' : 'Pflichtfelder sind mit * gekennzeichnet.'}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${type}-name`}>{isEnglish ? 'Name' : 'Name'} *</Label>
          <Input
            id={`${type}-name`}
            name="name"
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${type}-name-error` : undefined}
          />
          {errors.name && <p id={`${type}-name-error`} className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}-company`}>{isEnglish ? 'Company' : 'Firma'} *</Label>
          <Input
            id={`${type}-company`}
            name="company_name"
            value={values.company_name}
            onChange={(event) => setField('company_name', event.target.value)}
            autoComplete="organization"
            aria-invalid={!!errors.company_name}
            aria-describedby={errors.company_name ? `${type}-company-error` : undefined}
          />
          {errors.company_name && <p id={`${type}-company-error`} className="text-sm text-destructive">{errors.company_name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}-email`}>{isEnglish ? 'Email' : 'E-Mail'} *</Label>
          <Input
            id={`${type}-email`}
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${type}-email-error` : undefined}
          />
          {errors.email && <p id={`${type}-email-error`} className="text-sm text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}-website`}>{isEnglish ? 'Website' : 'Website'}</Label>
          <Input
            id={`${type}-website`}
            name="website_url"
            type="url"
            placeholder="https://"
            value={values.website_url}
            onChange={(event) => setField('website_url', event.target.value)}
            autoComplete="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}-industry`}>{isEnglish ? 'Industry' : 'Branche'}</Label>
          <Input
            id={`${type}-industry`}
            name="industry"
            value={values.industry}
            onChange={(event) => setField('industry', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}-region`}>{isEnglish ? 'Region' : 'Region'}</Label>
          <Input
            id={`${type}-region`}
            name="region"
            value={values.region}
            onChange={(event) => setField('region', event.target.value)}
            autoComplete="address-level1"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor={`${type}-goal`}>{isEnglish ? 'Primary business goal' : 'Wichtigstes Geschäftsziel'}</Label>
        <Input
          id={`${type}-goal`}
          name="primary_goal"
          value={values.primary_goal}
          onChange={(event) => setField('primary_goal', event.target.value)}
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor={`${type}-message`}>{isEnglish ? 'Starting point and question' : 'Ausgangslage und Frage'} *</Label>
        <Textarea
          id={`${type}-message`}
          name="message"
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${type}-message-error` : undefined}
        />
        {errors.message && <p id={`${type}-message-error`} className="text-sm text-destructive">{errors.message}</p>}
      </div>

      <div className="sr-only" aria-hidden="true">
        <Label htmlFor={`${type}-company-site`}>Company site</Label>
        <Input
          id={`${type}-company-site`}
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
          <span className="text-sm leading-relaxed">
            {isEnglish
              ? 'I agree that my information may be processed to handle this enquiry. *'
              : 'Ich willige ein, dass meine Angaben zur Bearbeitung dieser Anfrage verarbeitet werden. *'}
          </span>
        </label>
        {errors.consent_processing && <p className="text-sm text-destructive">{errors.consent_processing}</p>}

        <label className="flex min-h-12 cursor-pointer items-start gap-3">
          <Checkbox
            checked={values.consent_marketing}
            onCheckedChange={(checked) => setField('consent_marketing', checked === true)}
            className="mt-1"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            {isEnglish
              ? 'Optional: I would like to receive relevant updates and offers by email.'
              : 'Optional: Ich möchte relevante Hinweise und Angebote per E-Mail erhalten.'}
          </span>
        </label>
      </div>

      {errors.form && <p className="mt-5 text-sm text-destructive" role="alert">{errors.form}</p>}

      <Button type="submit" size="lg" className="mt-6 min-h-12 w-full" disabled={status === 'submitting'}>
        {status === 'submitting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {copy.submit}
      </Button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        {isEnglish ? 'Separate lead storage for itsFeierabend.ch' : 'Separate Lead-Speicherung für itsFeierabend.ch'}
      </p>
    </form>
  );
}
