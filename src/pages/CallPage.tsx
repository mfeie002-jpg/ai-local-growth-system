import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { trackFormStart } from '@/lib/analytics';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { Phone, Clock, CheckCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { callFormSchema, type CallFormData, getErrorMessage } from '@/lib/validation';

export default function CallPage() {
  const { t, language, isEnglish } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();
  const { submitLead, isSubmitting } = useLeadSubmit();

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

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border/60 bg-background/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition";

  const expectations = [
    { icon: Clock, title: `20 ${isEnglish ? 'Minutes' : 'Minuten'}`, desc: isEnglish ? 'Focused conversation, no wasted time.' : 'Fokussiertes Gespräch, keine Zeitverschwendung.' },
    { icon: CheckCircle, title: isEnglish ? 'Clear next steps' : 'Klare nächste Schritte', desc: isEnglish ? "You'll know exactly what to do after the call." : 'Du weisst genau, was nach dem Call zu tun ist.' },
    { icon: Phone, title: isEnglish ? 'No obligation' : 'Ohne Verpflichtung', desc: isEnglish ? 'Just a conversation. No pressure.' : 'Nur ein Gespräch. Kein Druck.' },
  ];

  return (
    <Layout showDemoTeaser>
      <SEOHead title={t.call.heroTitle} description={t.call.heroSubtitle} />

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
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <aside className="lg:col-span-3 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 02 / Free Call' : '§ 02 / Gratis Call'}
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-5 space-y-3">
                <Phone className="h-6 w-6 text-aurora" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.call.trustLine}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-9 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{isEnglish ? "Let's" : 'Lass uns'}</span>
                <span className="block italic text-aurora">{isEnglish ? 'talk.' : 'reden.'}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {t.call.heroSubtitle}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Form + Expectations */}
      <section className="relative">
        <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-2xl p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-editorial text-aurora text-sm tracking-widest">01</span>
                  <span className="h-px flex-1 bg-border/60" />
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold mb-8">
                  {t.cta.requestCall}
                </h2>

                {serverError && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {serverError}
                  </div>
                )}

                <div className="space-y-5">
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
                    <input {...register('industry')} type="text" id="industry" onFocus={handleInputFocus} placeholder={isEnglish ? 'e.g. Painting, Plumbing, Cleaning...' : 'z.B. Maler, Sanitär, Reinigung...'} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="service_area" className="block text-sm font-medium text-foreground mb-1.5">{isEnglish ? 'Service Area' : 'Einsatzgebiet'}</label>
                    <input {...register('service_area')} type="text" id="service_area" onFocus={handleInputFocus} placeholder={isEnglish ? 'e.g. Zurich, Aargau...' : 'z.B. Zürich, Aargau...'} className={inputClass} />
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
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEnglish ? 'Sending...' : 'Wird gesendet...'}</>
                    ) : t.call.form.submit}
                  </CTAButton>
                </div>
              </form>
            </div>

            {/* Expectations sidebar */}
            <aside className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div>
                  <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {isEnglish ? '— What to expect' : '— Was dich erwartet'}
                  </span>
                  <h3 className="mt-4 font-editorial text-3xl sm:text-4xl font-semibold leading-tight">
                    {isEnglish ? (
                      <>Honest, focused, <span className="italic text-aurora">no fluff.</span></>
                    ) : (
                      <>Ehrlich, fokussiert, <span className="italic text-aurora">ohne Fluff.</span></>
                    )}
                  </h3>
                </div>

                <ul className="divide-y divide-border/60">
                  {expectations.map(({ icon: Icon, title, desc }, i) => (
                    <li key={i} className="flex items-start gap-5 py-5">
                      <span className="font-editorial text-aurora text-sm tracking-widest pt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon className="w-5 h-5 text-aurora mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-editorial text-lg text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground mb-3">
                    {isEnglish ? 'Prefer to start with an audit first?' : 'Lieber zuerst mit einem Audit starten?'}
                  </p>
                  <CTAButton
                    variant="ghost"
                    size="sm"
                    href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                    location="call-page-audit-link"
                  >
                    {t.cta.getAudit}
                    <ArrowUpRight className="ml-1.5 w-4 h-4" />
                  </CTAButton>
                </div>
              </div>
            </aside>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
