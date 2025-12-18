import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { trackCallBook, trackFormStart } from '@/lib/analytics';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Phone, Clock, CheckCircle } from 'lucide-react';

export default function CallPage() {
  const { t, language, isEnglish } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredTimes: '',
  });
  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (!formStarted) {
      setFormStarted(true);
      trackFormStart('call', {
        language,
        page_path: location.pathname,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    trackCallBook({
      language,
      page_path: location.pathname,
      cta_text: t.call.form.submit,
      cta_location: 'call-form',
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isEnglish ? 'Call requested!' : 'Call angefragt!',
      description: t.call.trustLine,
    });

    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      preferredTimes: '',
    });
  };

  return (
    <Layout>
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
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">{t.cta.requestCall}</h2>
            
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t.call.form.namePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t.call.form.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.call.form.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.company}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder={t.call.form.companyPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Preferred Times */}
              <div>
                <label htmlFor="preferredTimes" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.call.form.preferredTimes}
                </label>
                <input
                  type="text"
                  id="preferredTimes"
                  name="preferredTimes"
                  value={formData.preferredTimes}
                  onChange={handleInputChange}
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
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t.call.form.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <CTAButton
                variant="primary"
                size="lg"
                className="w-full"
                location="call-form-submit"
              >
                {isSubmitting ? (isEnglish ? 'Sending...' : 'Wird gesendet...') : t.call.form.submit}
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
