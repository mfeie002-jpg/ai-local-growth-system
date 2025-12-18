import { z } from 'zod';

// Shared validation schemas
export const auditFormSchema = z.object({
  // Step 1
  industry: z.string().min(1, 'required'),
  service_area: z.string().min(1, 'required'),
  // Step 2
  website_url: z.string().min(1, 'required'),
  budget_range: z.string().min(1, 'required'),
  capacity_range: z.string().min(1, 'required'),
  // Step 3
  name: z.string().min(1, 'required').max(100),
  email: z.string().email('invalid_email').max(255),
  phone: z.string().optional(),
  // Hidden
  honeypot: z.string().optional(),
});

export const callFormSchema = z.object({
  name: z.string().min(1, 'required').max(100),
  email: z.string().email('invalid_email').max(255),
  phone: z.string().optional(),
  industry: z.string().optional(),
  service_area: z.string().optional(),
  message: z.string().max(1000).optional(),
  preferred_times: z.string().max(200).optional(),
  // Hidden
  honeypot: z.string().optional(),
});

export type AuditFormData = z.infer<typeof auditFormSchema>;
export type CallFormData = z.infer<typeof callFormSchema>;

// Error message mapping
export const getErrorMessage = (code: string, isDE: boolean): string => {
  const messages: Record<string, { de: string; en: string }> = {
    required: {
      de: 'Bitte ausfüllen.',
      en: 'Please fill this in.',
    },
    invalid_email: {
      de: 'Bitte prüfe deine E-Mail-Adresse.',
      en: 'Please check your email.',
    },
    invalid_url: {
      de: 'Bitte eine gültige URL eingeben.',
      en: 'Please enter a valid URL.',
    },
    server: {
      de: 'Das hat grad nicht geklappt. Bitte nochmals versuchen.',
      en: 'Something went wrong. Please try again.',
    },
    rate_limit: {
      de: 'Zu viele Versuche. Bitte warte kurz.',
      en: 'Too many attempts. Please wait a moment.',
    },
  };

  return messages[code]?.[isDE ? 'de' : 'en'] || messages.server[isDE ? 'de' : 'en'];
};
