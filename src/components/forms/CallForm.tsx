import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { callFormSchema, type CallFormData, getErrorMessage } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CallForm() {
  const { t, isEnglish } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { submitLead, isSubmitting } = useLeadSubmit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<CallFormData>({
    resolver: zodResolver(callFormSchema),
    mode: 'onBlur',
  });

  const industry = watch('industry');
  const isDE = !isEnglish;

  const getFieldError = (field: keyof CallFormData): string | undefined => {
    const error = errors[field];
    if (!error?.message) return undefined;
    return getErrorMessage(error.message, isDE);
  };

  const onSubmit = async (data: CallFormData) => {
    setServerError(null);

    const result = await submitLead({
      lead_type: 'free_call',
      industry: data.industry || 'Not specified',
      service_area: data.service_area || 'Not specified',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      preferred_times: data.preferred_times,
      honeypot: data.honeypot,
    });

    if (result.success) {
      setIsSuccess(true);
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof CallFormData, { message });
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
        <p className="text-muted-foreground max-w-md mx-auto">
          {isDE
            ? 'Wir melden uns in Kürze mit Terminvorschlägen bei dir.'
            : "We'll get back to you shortly with time slot suggestions."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-lg mx-auto">
      {/* Honeypot field */}
      <input
        type="text"
        {...register('honeypot')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-2">
        <Label htmlFor="name">{t.call.form.name} *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={t.call.form.namePlaceholder}
          className={cn(errors.name && 'border-destructive')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{getFieldError('name')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.call.form.email} *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder={t.call.form.emailPlaceholder}
          className={cn(errors.email && 'border-destructive')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{getFieldError('email')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t.call.form.phone}</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder={t.call.form.phonePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">{t.call.form.company}</Label>
        <Select
          value={industry}
          onValueChange={(value) => setValue('industry', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.call.form.companyPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {t.industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.call.form.message}</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder={t.call.form.messagePlaceholder}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_times">{t.call.form.preferredTimes}</Label>
        <Input
          id="preferred_times"
          {...register('preferred_times')}
          placeholder={t.call.form.preferredTimesPlaceholder}
        />
      </div>

      {serverError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{serverError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isDE ? 'Wird gesendet...' : 'Submitting...'}
          </>
        ) : (
          t.call.form.submit
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        {t.call.trustLine}
      </p>
    </form>
  );
}
