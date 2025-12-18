import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const callbackSchema = z.object({
  phone: z.string().min(8, 'Phone number is required').max(20),
  preferred_time: z.string().max(100).optional(),
  consent_ai_call: z.boolean().refine(val => val === true, 'AI call consent is required'),
  consent_recording: z.boolean().optional(),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

interface CallbackRequestFormProps {
  token: string;
  language: 'de' | 'en';
  onSuccess?: () => void;
}

export function CallbackRequestForm({ token, language, onSuccess }: CallbackRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDE = language === 'de';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      phone: '',
      preferred_time: '',
      consent_ai_call: false,
      consent_recording: false,
    },
  });

  const consentAiCall = watch('consent_ai_call');
  const consentRecording = watch('consent_recording');

  const onSubmit = async (data: CallbackFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke('voice-callback', {
        body: {
          phone: data.phone,
          language,
          consent_ai_call: data.consent_ai_call,
          consent_recording: data.consent_recording || false,
          preferred_time: data.preferred_time,
          report_token: token,
        },
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to request callback');
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error('Callback request error:', err);
      setError(
        isDE 
          ? 'Fehler beim Anfordern des Rückrufs. Bitte versuche es erneut.'
          : 'Error requesting callback. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!siteConfig.voiceCallbackEnabled) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isDE ? 'Rückruf angefordert!' : 'Callback requested!'}
        </h3>
        <p className="text-muted-foreground">
          {isDE 
            ? 'Wir melden uns so schnell wie möglich.'
            : 'We\'ll get back to you as soon as possible.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Phone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {isDE ? 'Rückruf anfragen' : 'Request a callback'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isDE 
              ? 'Unser AI-Assistent ruft dich zurück.'
              : 'Our AI assistant will call you back.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="callback-phone">
            {isDE ? 'Telefonnummer' : 'Phone number'} *
          </Label>
          <Input
            {...register('phone')}
            id="callback-phone"
            type="tel"
            placeholder={isDE ? '+41 79 123 45 67' : '+41 79 123 45 67'}
            className={cn(errors.phone && 'border-destructive')}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Preferred Time */}
        <div className="space-y-2">
          <Label htmlFor="callback-time">
            {isDE ? 'Bevorzugte Zeit (optional)' : 'Preferred time (optional)'}
          </Label>
          <Input
            {...register('preferred_time')}
            id="callback-time"
            type="text"
            placeholder={isDE ? 'z.B. Nachmittags, 14-17 Uhr' : 'e.g. Afternoon, 2-5 PM'}
          />
        </div>

        {/* Consent AI Call - Required */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent-ai-call"
            checked={consentAiCall}
            onCheckedChange={(checked) => setValue('consent_ai_call', checked === true)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="consent-ai-call" className="font-normal cursor-pointer">
              {isDE 
                ? 'Ich bin einverstanden, von einem AI-Assistenten angerufen zu werden. *'
                : 'I agree to be called by an AI assistant. *'}
            </Label>
            {errors.consent_ai_call && (
              <p className="text-sm text-destructive">{errors.consent_ai_call.message}</p>
            )}
          </div>
        </div>

        {/* Consent Recording - Optional */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent-recording"
            checked={consentRecording}
            onCheckedChange={(checked) => setValue('consent_recording', checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="consent-recording" className="font-normal cursor-pointer">
            {isDE 
              ? 'Der Anruf darf zur Qualitätssicherung aufgezeichnet werden.'
              : 'The call may be recorded for quality assurance.'}
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isDE ? 'Wird gesendet...' : 'Sending...'}
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              {isDE ? 'Rückruf anfragen' : 'Request callback'}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {isDE 
            ? 'Kein Zeitversprechen. Wir melden uns so schnell wie möglich.'
            : 'No time guarantee. We\'ll get back to you as soon as possible.'}
        </p>
      </form>
    </div>
  );
}
