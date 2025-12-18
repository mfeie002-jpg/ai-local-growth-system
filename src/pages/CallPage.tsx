import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { trackFormStart } from '@/lib/analytics';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { Phone, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { callFormSchema, type CallFormData, getErrorMessage } from '@/lib/validation';

export default function CallPage() {
  const { t, language, isEnglish } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
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
      name: '',
      email: '',
      phone: '',
      industry: '',
      service_area: '',
      message: '',
      preferred_times: '',
      honeypot: '',
    },
  });

  const handleInputFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackFormStart('call', {
        language,
        page_path: location.pathname,
      });
    }
  };

  const onSubmit = async (data: CallFormData) => {
    setServerError(null);

    const result = await submitLead({
      lead_type: 'free_call',
      industry: data.industry || 'Nicht angegeben',
      service_area: data.service_area || 'Nicht angegeben',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      preferred_times: data.preferred_times,
      honeypot: data.honeypot,
    });

    if (result.success) {
      toast({
        title: isEnglish ? 'Call requested!' : 'Call angefragt!',
        description: t.call.trustLine,
      });
      // Could navigate to a thank you page if needed
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof CallFormData, { message });
      });
    } else if (result.error) {
      setServerError(result.error);
    }
  };

  const isDE = language === 'de';

  return (
    <Layout showDemoTeaser>
      <SEOHead
        title={t.call.heroTitle}
        description={t.call.heroSubtitle}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h1 className="mb-6">{t.call.heroTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {t.call.heroSubtitle}
            </p>
            <p className="text-sm text-muted-foreground">{t.call.trustLine}</p>
          </div>
        </SectionContainer>
      </section>

      {/* Call Form */}
      <SectionContainer background="muted">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">{t.cta.requestCall}</h2>
            
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {serverError}
              </div>
            )}
            
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.name} *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  onFocus={handleInputFocus}
                  placeholder={t.call.form.namePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{getErrorMessage(errors.name.message || '', isDE)}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.email} *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  onFocus={handleInputFocus}
                  placeholder={t.call.form.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{getErrorMessage(errors.email.message || '', isDE)}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.phone}
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  onFocus={handleInputFocus}
                  placeholder={t.call.form.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-1.5">
                  {isEnglish ? 'Industry' : 'Branche'}
                </label>
                <input
                  {...register('industry')}
                  type="text"
                  id="industry"
                  onFocus={handleInputFocus}
                  placeholder={isEnglish ? 'e.g. Painting, Plumbing, Cleaning...' : 'z.B. Maler, Sanitär, Reinigung...'}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Service Area */}
              <div>
                <label htmlFor="service_area" className="block text-sm font-medium text-foreground mb-1.5">
                  {isEnglish ? 'Service Area' : 'Einsatzgebiet'}
                </label>
                <input
                  {...register('service_area')}
                  type="text"
                  id="service_area"
                  onFocus={handleInputFocus}
                  placeholder={isEnglish ? 'e.g. Zurich, Aargau...' : 'z.B. Zürich, Aargau...'}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Preferred Times */}
              <div>
                <label htmlFor="preferred_times" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.preferredTimes}
                </label>
                <input
                  {...register('preferred_times')}
                  type="text"
                  id="preferred_times"
                  onFocus={handleInputFocus}
                  placeholder={t.call.form.preferredTimesPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.message}
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  onFocus={handleInputFocus}
                  rows={4}
                  placeholder={t.call.form.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Honeypot */}
              <input
                {...register('honeypot')}
                type="text"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <CTAButton
                variant="primary"
                size="lg"
                className="w-full"
                location="call-form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEnglish ? 'Sending...' : 'Wird gesendet...'}
                  </>
                ) : (
                  t.call.form.submit
                )}
              </CTAButton>
            </div>
          </form>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-6">
              {isEnglish ? 'What to expect' : 'Was dich erwartet'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">20 {isEnglish ? 'Minutes' : 'Minuten'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Focused conversation, no wasted time.' : 'Fokussiertes Gespräch, keine Zeitverschwendung.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{isEnglish ? 'Clear next steps' : 'Klare nächste Schritte'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'You\'ll know exactly what to do after the call.' : 'Du weisst genau, was nach dem Call zu tun ist.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{isEnglish ? 'No obligation' : 'Ohne Verpflichtung'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Just a conversation. No pressure.' : 'Nur ein Gespräch. Kein Druck.'}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Prefer to start with an audit first?'
                  : 'Lieber zuerst mit einem Audit starten?'}
              </p>
              <CTAButton
                variant="ghost"
                size="sm"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="call-page-audit-link"
                className="mt-2"
              >
                {t.cta.getAudit}
              </CTAButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
