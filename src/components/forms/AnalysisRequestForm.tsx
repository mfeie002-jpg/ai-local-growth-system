import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Globe, ArrowRight, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisRequestFormProps {
  onSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'hero' | 'compact';
  autoGenerate?: boolean;
}

export function AnalysisRequestForm({ onSuccess, className, variant = 'default', autoGenerate = true }: AnalysisRequestFormProps) {
  const { isEnglish, language } = useLanguage();
  const { submitLead, isSubmitting } = useLeadSubmit();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    website_url: '',
    email: '',
    name: '',
    consent: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const content = isEnglish ? {
    title: 'Start Your Free Analysis',
    subtitle: 'Enter your website URL and get a comprehensive AI-powered analysis.',
    websiteLabel: 'Your Website URL',
    websitePlaceholder: 'https://your-website.com',
    emailLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    nameLabel: 'Your Name',
    namePlaceholder: 'Max Mustermann',
    consentText: 'I agree to receive the analysis results and occasional updates.',
    submitButton: 'Get Free Analysis',
    submittingButton: 'Submitting...',
    generatingButton: 'Generating Analysis...',
    successTitle: 'Analysis Request Received!',
    successMessage: 'We\'ll analyze your website and send you the results within 24-48 hours.',
    instantSuccess: 'Your analysis is ready!',
    errors: {
      website_url: 'Please enter a valid website URL',
      email: 'Please enter a valid email address',
      name: 'Please enter your name',
      consent: 'Please agree to receive the analysis',
    },
  } : {
    title: 'Starte deine Gratis-Analyse',
    subtitle: 'Gib deine Website-URL ein und erhalte eine umfassende KI-gestützte Analyse.',
    websiteLabel: 'Deine Website-URL',
    websitePlaceholder: 'https://deine-website.ch',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'deine@email.ch',
    nameLabel: 'Dein Name',
    namePlaceholder: 'Max Mustermann',
    consentText: 'Ich stimme zu, die Analyse-Ergebnisse und gelegentliche Updates zu erhalten.',
    submitButton: 'Gratis-Analyse starten',
    submittingButton: 'Wird gesendet...',
    generatingButton: 'Analyse wird generiert...',
    successTitle: 'Analyse-Anfrage erhalten!',
    successMessage: 'Wir analysieren deine Website und senden dir die Resultate innerhalb von 24-48 Stunden.',
    instantSuccess: 'Deine Analyse ist bereit!',
    errors: {
      website_url: 'Bitte gib eine gültige Website-URL ein',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein',
      name: 'Bitte gib deinen Namen ein',
      consent: 'Bitte stimme dem Erhalt der Analyse zu',
    },
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    if (!formData.website_url || !urlPattern.test(formData.website_url)) {
      newErrors.website_url = content.errors.website_url;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = content.errors.email;
    }
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = content.errors.name;
    }
    
    // Consent validation
    if (!formData.consent) {
      newErrors.consent = content.errors.consent;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Format URL if needed
    let websiteUrl = formData.website_url.trim();
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = `https://${websiteUrl}`;
    }
    
    const result = await submitLead({
      lead_type: 'free_audit',
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      website_url: websiteUrl,
      industry: 'analysis_request',
      service_area: 'ultimate_package',
      budget_range: 'not_specified',
      capacity_range: 'not_specified',
      message: `Free website analysis requested for: ${websiteUrl}`,
    });
    
    if (result.success) {
      // Call async business-scanner instead of synchronous generate
      if (autoGenerate) {
        setIsGenerating(true);
        try {
          const { data, error } = await supabase.functions.invoke('business-scanner', {
            body: { 
              websiteUrl,
              leadId: result.leadId,
              language,
            }
          });
          
          if (error) throw error;
          
          if (data?.success && data?.token) {
            const prefix = isEnglish ? '/en/analysis/progress' : '/analyse/progress';
            navigate(`${prefix}/${data.token}`);
            onSuccess?.();
            return;
          }
        } catch (genError) {
          console.error('Scanner init failed:', genError);
        } finally {
          setIsGenerating(false);
        }
      }
      
      // Fallback: show success message
      setSubmitted(true);
      toast.success(content.successTitle, {
        description: content.successMessage,
      });
      onSuccess?.();
    } else if (result.errors) {
      setErrors(result.errors);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  if (submitted) {
    return (
      <div className={cn(
        "text-center p-8 rounded-2xl bg-gradient-to-br from-ai/10 to-primary/10 border border-ai/30",
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-ai/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-ai" />
        </div>
        <h3 className="text-2xl font-bold font-display mb-2">{content.successTitle}</h3>
        <p className="text-muted-foreground">{content.successMessage}</p>
      </div>
    );
  }

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';
  const isLoading = isSubmitting || isGenerating;

  return (
    <div className={cn(
      "rounded-2xl",
      isHero && "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-ai/20 p-8 shadow-2xl shadow-ai/10",
      !isHero && !isCompact && "bg-card border border-border p-6",
      isCompact && "bg-transparent",
      className
    )}>
      {!isCompact && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-ai/10 border border-ai/20">
            <Sparkles className="w-3.5 h-3.5 text-ai" />
            <span className="text-xs font-medium text-ai">100% {isEnglish ? 'Free' : 'Kostenlos'}</span>
          </div>
          <h3 className={cn(
            "font-bold font-display mb-1",
            isHero ? "text-2xl" : "text-xl"
          )}>{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.subtitle}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="website_url" className="text-sm font-medium">
            {content.websiteLabel}
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="website_url"
              type="text"
              placeholder={content.websitePlaceholder}
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className={cn(
                "pl-10",
                errors.website_url && "border-destructive"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.website_url && (
            <p className="text-xs text-destructive">{errors.website_url}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {content.emailLabel}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={content.emailPlaceholder}
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={cn(
              errors.email && "border-destructive"
            )}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {content.nameLabel}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={content.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={cn(
              errors.name && "border-destructive"
            )}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Consent */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
            className={cn(
              errors.consent && "border-destructive"
            )}
            disabled={isLoading}
          />
          <Label 
            htmlFor="consent" 
            className={cn(
              "text-xs text-muted-foreground cursor-pointer leading-relaxed",
              errors.consent && "text-destructive"
            )}
          >
            {content.consentText}
          </Label>
        </div>
        {errors.consent && (
          <p className="text-xs text-destructive">{errors.consent}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full font-semibold",
            isHero && "bg-ai hover:bg-ai/90 text-ai-foreground glow-ai py-6 text-lg"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {isGenerating ? content.generatingButton : content.submittingButton}
            </>
          ) : (
            <>
              {content.submitButton}
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
