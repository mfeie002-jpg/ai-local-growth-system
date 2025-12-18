import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { FAQAccordion } from '@/components/FAQAccordion';
import { trackAuditSubmit, trackFormStart } from '@/lib/analytics';
import { Check, Zap, Target, Settings, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AuditPage() {
  const { t, language, isEnglish } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    industry: '',
    location: '',
    website: '',
    budget: '',
    capacity: '',
    name: '',
    email: '',
    phone: '',
  });
  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (!formStarted) {
      setFormStarted(true);
      trackFormStart('audit', {
        language,
        page_path: location.pathname,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track the submission
    trackAuditSubmit({
      language,
      page_path: location.pathname,
      cta_text: t.audit.form.submit,
      cta_location: 'audit-form',
    });

    // Simulate form submission (backend will be added in Prompt 2)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isEnglish ? 'Audit requested!' : 'Audit angefordert!',
      description: isEnglish 
        ? 'We\'ll get back to you within 48 hours.' 
        : 'Wir melden uns innerhalb von 48 Stunden.',
    });

    setIsSubmitting(false);
    setFormData({
      industry: '',
      location: '',
      website: '',
      budget: '',
      capacity: '',
      name: '',
      email: '',
      phone: '',
    });
  };

  const industries = t.industries;

  return (
    <Layout>
      <SEOHead
        title={t.audit.heroTitle}
        description={t.audit.heroSubtitle}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{t.audit.heroTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {t.audit.heroSubtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8">{t.audit.trustLine}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                location="audit-hero"
              >
                {t.cta.startAudit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="audit-hero"
              >
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Audit Form */}
      <SectionContainer id="audit-form" background="muted">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6 text-center">{t.cta.startAudit}</h2>
            
            <div className="space-y-5">
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.industry} *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">{t.audit.form.industryPlaceholder}</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.location} *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.locationPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.website} *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.websitePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.budget} *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.budgetPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-sm text-muted-foreground">{t.audit.form.budgetHelper}</p>
              </div>

              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.capacity} *
                </label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.capacityPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-sm text-muted-foreground">{t.audit.form.capacityHelper}</p>
              </div>

              <hr className="border-border" />

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.namePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t.audit.form.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.audit.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.audit.form.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <CTAButton
                variant="primary"
                size="lg"
                className="w-full"
                location="audit-form-submit"
              >
                {isSubmitting ? (isEnglish ? 'Sending...' : 'Wird gesendet...') : t.audit.form.submit}
              </CTAButton>
            </div>
          </form>
        </div>
      </SectionContainer>

      {/* Deliverables */}
      <SectionContainer>
        <SectionHeader title={t.audit.deliverables.title} />
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-4">
            {t.audit.deliverables.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* What We Check */}
      <SectionContainer background="muted">
        <SectionHeader title={t.audit.whatWeCheck.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.traffic}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Target className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.conversion}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Settings className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.ops}</p>
          </div>
        </div>
      </SectionContainer>

      {/* Steps */}
      <SectionContainer>
        <SectionHeader title={t.audit.steps.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[t.audit.steps.step1, t.audit.steps.step2, t.audit.steps.step3].map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Pricing Teaser */}
      <SectionContainer background="accent">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            {isEnglish ? 'See our packages' : 'Unsere Pakete'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isEnglish
              ? 'From one-time sprints to ongoing retainers.'
              : 'Von einmaligen Sprints bis zu laufenden Retainern.'}
          </p>
          <CTAButton
            variant="secondary"
            href={isEnglish ? '/en/pricing' : '/pakete'}
            location="audit-pricing-teaser"
          >
            {isEnglish ? 'View pricing' : 'Pakete ansehen'}
          </CTAButton>
        </div>
      </SectionContainer>

      {/* Audit FAQ */}
      <SectionContainer>
        <SectionHeader title={t.faq.sectionTitle} />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={t.faq.auditItems} />
        </div>
      </SectionContainer>
    </Layout>
  );
}
