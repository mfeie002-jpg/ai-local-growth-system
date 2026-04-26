import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { trackFormStart } from '@/lib/analytics';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { callFormSchema, type CallFormData, getErrorMessage } from '@/lib/validation';
import {
  EditorialHero,
  SectionMarker,
  RevealText,
  AIAnnotation,
  FunnelNav,
  getFunnelSteps,
} from '@/components/neural';

/**
 * CallPage — Funnel step 04 / 05 · Talk.
 * 20-minute focused call request form, paired with what-to-expect.
 * Previous: Pakete. Next: FAQ (clarify anything we missed).
 */
export default function CallPage() {
  const { t, language, isEnglish } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();
  const { submitLead, isSubmitting } = useLeadSubmit();
  const steps = getFunnelSteps(isEnglish);
  const me = steps[3];
  const prev = steps[2];
  const next = steps[4];

  const [formStarted, setFormStarted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CallFormData>({
    resolver: zodResolver(callFormSchema),
    defaultValues: {
      name: '', email: '', phone: '', industry: '', service_area: '',
      message: '', preferred_times: '', honeypot: '',
    },
  });

  const handleInputFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackFormStart('call', { language, page_path: location.pathname });
    }
  };

  const onSubmit = async (data: CallFormData) => {
    setServerError(null);
    const result = await submitLead({
      lead_type: 'free_call',
      industry: data.industry || 'Nicht angegeben',
      service_area: data.service_area || 'Nicht angegeben',
      name: data.name, email: data.email, phone: data.phone,
      message: data.message, preferred_times: data.preferred_times,
      honeypot: data.honeypot,
    });
    if (result.success) {
      toast({
        title: isEnglish ? 'Call requested!' : 'Call angefragt!',
        description: t.call.trustLine,
      });
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof CallFormData, { message });
      });
    } else if (result.error) {
      setServerError(result.error);
    }
  };

  const isDE = language === 'de';
  const inputClass = 'w-full px-4 py-3 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition';

  const expectations = isEnglish
    ? [
        { label: '20 minutes', desc: 'Focused conversation, no wasted time.' },
        { label: 'Clear next steps', desc: "You'll know exactly what to do after the call." },
        { label: 'No obligation', desc: 'Just a conversation. No pressure.' },
      ]
    : [
        { label: '20 Minuten', desc: 'Fokussiertes Gespräch, keine Zeitverschwendung.' },
        { label: 'Klare nächste Schritte', desc: 'Du weißt nach dem Call genau, was zu tun ist.' },
        { label: 'Unverbindlich', desc: 'Nur ein Gespräch. Kein Druck.' },
      ];

  return (
    <Layout>
      <SEOHead title={t.call.heroTitle} description={t.call.heroSubtitle} />

      {/* Hero */}
      <EditorialHero
        eyebrow={`${me.hint} · ${me.label}`}
        title={
          isEnglish ? (
            <>Twenty minutes. <em className="font-editorial">Two humans.</em></>
          ) : (
            <>Zwanzig Minuten. <em className="font-editorial">Zwei Menschen.</em></>
          )
        }
        lede={t.call.heroSubtitle}
        annotation={t.call.trustLine}
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Form + expectations */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={2} label={isEnglish ? 'Request the call' : 'Call anfragen'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            {/* Form */}
            <div className="col-span-12 lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="card-paper p-6 sm:p-10">
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Tell us when. <em className="font-editorial">We'll call you.</em></>
                  ) : (
                    <>Sag uns wann. <em className="font-editorial">Wir rufen an.</em></>
                  )}
                </h2>

                {serverError && (
                  <div className="mt-6 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {serverError}
                  </div>
                )}

                <div className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">{t.call.form.name} *</label>
                    <input {...register('name')} type="text" id="name" onFocus={handleInputFocus} placeholder={t.call.form.namePlaceholder} className={inputClass} />
                    {errors.name && <p className="text-destructive text-sm mt-1">{getErrorMessage(errors.name.message || '', isDE)}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">{t.call.form.email} *</label>
                    <input {...register('email')} type="email" id="email" onFocus={handleInputFocus} placeholder={t.call.form.emailPlaceholder} className={inputClass} />
                    {errors.email && <p className="text-destructive text-sm mt-1">{getErrorMessage(errors.email.message || '', isDE)}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">{t.call.form.phone}</label>
                    <input {...register('phone')} type="tel" id="phone" onFocus={handleInputFocus} placeholder={t.call.form.phonePlaceholder} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-1.5">{isEnglish ? 'Industry' : 'Branche'}</label>
                    <input {...register('industry')} type="text" id="industry" onFocus={handleInputFocus} placeholder={isEnglish ? 'e.g. Painting, Plumbing, Cleaning…' : 'z.B. Maler, Sanitär, Reinigung…'} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="service_area" className="block text-sm font-medium text-foreground mb-1.5">{isEnglish ? 'Service Area' : 'Einsatzgebiet'}</label>
                    <input {...register('service_area')} type="text" id="service_area" onFocus={handleInputFocus} placeholder={isEnglish ? 'e.g. Zurich, Aargau…' : 'z.B. Zürich, Aargau…'} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="preferred_times" className="block text-sm font-medium text-foreground mb-1.5">{t.call.form.preferredTimes}</label>
                    <input {...register('preferred_times')} type="text" id="preferred_times" onFocus={handleInputFocus} placeholder={t.call.form.preferredTimesPlaceholder} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">{t.call.form.message}</label>
                    <textarea {...register('message')} id="message" onFocus={handleInputFocus} rows={4} placeholder={t.call.form.messagePlaceholder} className={`${inputClass} resize-none`} />
                  </div>
                  <input {...register('honeypot')} type="text" className="hidden" tabIndex={-1} autoComplete="off" />
                  <CTAButton variant="primary" size="lg" className="w-full" location="call-form-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEnglish ? 'Sending…' : 'Wird gesendet…'}</>
                    ) : t.call.form.submit}
                  </CTAButton>
                </div>
              </form>
            </div>

            {/* Side */}
            <aside className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-10">
                <RevealText>
                  <h3 className="font-editorial text-3xl md:text-4xl font-light">
                    {isEnglish ? (
                      <>Honest, focused, <em className="font-editorial">no fluff.</em></>
                    ) : (
                      <>Ehrlich, fokussiert, <em className="font-editorial">ohne Fluff.</em></>
                    )}
                  </h3>
                </RevealText>

                <ul className="divide-y divide-border">
                  {expectations.map((e, i) => (
                    <li key={i} className="flex items-start gap-5 py-5 first:pt-0">
                      <span className="font-mono text-xs text-foreground/55 mt-2 w-6 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-editorial text-xl text-foreground">{e.label}</p>
                        <p className="mt-1 text-sm text-foreground/65">{e.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <AIAnnotation>
                  {isEnglish
                    ? 'Calls are with a human. If we ever pilot an AI receptionist, you will be told before it speaks.'
                    : 'Calls führen Menschen. Falls wir je eine KI-Rezeption testen, wirst du es vorher erfahren.'}
                </AIAnnotation>

                <div className="card-paper p-5">
                  <p className="text-sm text-foreground/70 mb-3">
                    {isEnglish ? 'Prefer to start with the audit first?' : 'Lieber zuerst mit dem Audit starten?'}
                  </p>
                  <CTAButton variant="ghost" size="sm" href={prev.href} location="call-back-audit">
                    ← {prev.label}
                  </CTAButton>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Funnel nav */}
      <FunnelNav
        current={{ index: 4, total: 5, label: me.label }}
        prev={prev}
        next={next}
        nextCtaLabel={isEnglish ? 'See FAQ →' : 'FAQ ansehen →'}
        copy={isEnglish
          ? 'Have a question you\'d like answered before booking? FAQ has the most-asked ones.'
          : 'Vor dem Buchen noch eine Frage? Im FAQ stehen die meistgestellten.'}
        location="call"
      />
    </Layout>
  );
}
