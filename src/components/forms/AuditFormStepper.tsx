import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { auditFormSchema, type AuditFormData, getErrorMessage } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CTAButton } from '@/components/CTAButton';

interface AuditFormStepperProps {
  onSuccess?: () => void;
}

export function AuditFormStepper({ onSuccess }: AuditFormStepperProps) {
  const { t, language, isEnglish } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { submitLead, isSubmitting } = useLeadSubmit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    setError,
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    mode: 'onBlur',
  });

  const industry = watch('industry');
  const isDE = !isEnglish;

  const getFieldError = (field: keyof AuditFormData): string | undefined => {
    const error = errors[field];
    if (!error?.message) return undefined;
    return getErrorMessage(error.message, isDE);
  };

  const validateStep = async (stepNum: number): Promise<boolean> => {
    let fields: (keyof AuditFormData)[] = [];
    
    if (stepNum === 1) {
      fields = ['industry', 'service_area'];
    } else if (stepNum === 2) {
      fields = ['website_url', 'budget_range', 'capacity_range'];
    } else if (stepNum === 3) {
      fields = ['name', 'email'];
    }

    const result = await trigger(fields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: AuditFormData) => {
    setServerError(null);

    const result = await submitLead({
      lead_type: 'free_audit',
      industry: data.industry,
      service_area: data.service_area,
      website_url: data.website_url,
      budget_range: data.budget_range,
      capacity_range: data.capacity_range,
      name: data.name,
      email: data.email,
      phone: data.phone,
      honeypot: data.honeypot,
    });

    if (result.success) {
      setIsSuccess(true);
      onSuccess?.();
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof AuditFormData, { message });
      });
    } else if (result.error) {
      setServerError(result.error);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {isDE ? 'Vielen Dank!' : 'Thank you!'}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {isDE
            ? 'Wir haben deine Anfrage erhalten und melden uns innerhalb von 48 Stunden mit deiner Scorecard.'
            : "We've received your request and will get back to you within 48 hours with your scorecard."}
        </p>
        <CTAButton
          variant="primary"
          href={isEnglish ? '/en/free-call' : '/gratis-call'}
          location="audit-success"
        >
          {t.cta.bookCall}
        </CTAButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              s === step
                ? 'bg-primary text-primary-foreground'
                : s < step
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {s < step ? <Check className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot field */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Step 1: Industry & Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {isDE ? 'Über dein Unternehmen' : 'About your business'}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="industry">{t.audit.form.industry} *</Label>
              <Select
                value={industry}
                onValueChange={(value) => setValue('industry', value, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(errors.industry && 'border-destructive')}>
                  <SelectValue placeholder={t.audit.form.industryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {t.industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive">{getFieldError('industry')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_area">{t.audit.form.location} *</Label>
              <Input
                id="service_area"
                {...register('service_area')}
                placeholder={t.audit.form.locationPlaceholder}
                className={cn(errors.service_area && 'border-destructive')}
              />
              {errors.service_area && (
                <p className="text-sm text-destructive">{getFieldError('service_area')}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Website & Budget */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {isDE ? 'Deine Situation' : 'Your situation'}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="website_url">{t.audit.form.website} *</Label>
              <Input
                id="website_url"
                {...register('website_url')}
                placeholder={t.audit.form.websitePlaceholder}
                className={cn(errors.website_url && 'border-destructive')}
              />
              {errors.website_url && (
                <p className="text-sm text-destructive">{getFieldError('website_url')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">{t.audit.form.budget} *</Label>
              <Input
                id="budget_range"
                {...register('budget_range')}
                placeholder={t.audit.form.budgetPlaceholder}
                className={cn(errors.budget_range && 'border-destructive')}
              />
              <p className="text-sm text-muted-foreground">{t.audit.form.budgetHelper}</p>
              {errors.budget_range && (
                <p className="text-sm text-destructive">{getFieldError('budget_range')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity_range">{t.audit.form.capacity} *</Label>
              <Input
                id="capacity_range"
                {...register('capacity_range')}
                placeholder={t.audit.form.capacityPlaceholder}
                className={cn(errors.capacity_range && 'border-destructive')}
              />
              <p className="text-sm text-muted-foreground">{t.audit.form.capacityHelper}</p>
              {errors.capacity_range && (
                <p className="text-sm text-destructive">{getFieldError('capacity_range')}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {isDE ? 'Deine Kontaktdaten' : 'Your contact details'}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">{t.audit.form.name} *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t.audit.form.namePlaceholder}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{getFieldError('name')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.audit.form.email} *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t.audit.form.emailPlaceholder}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t.audit.form.phone}</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder={t.audit.form.phonePlaceholder}
              />
            </div>
          </div>
        )}

        {serverError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{serverError}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isDE ? 'Zurück' : 'Back'}
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isDE ? 'Weiter' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isDE ? 'Wird gesendet...' : 'Submitting...'}
                </>
              ) : (
                t.audit.form.submit
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
