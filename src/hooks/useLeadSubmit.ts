import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { track } from '@/lib/analytics';

interface LeadData {
  lead_type: 'free_audit' | 'free_call';
  industry: string;
  service_area: string;
  website_url?: string;
  budget_range?: string;
  capacity_range?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferred_times?: string;
  honeypot?: string;
}

interface SubmitResult {
  success: boolean;
  errors?: Record<string, string>;
  error?: string;
  leadId?: string;
}

export function useLeadSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const getUTMParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
      gclid: params.get('gclid') || undefined,
    };
  };

  const submitLead = async (data: LeadData): Promise<SubmitResult> => {
    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();
      
      const payload = {
        ...data,
        language,
        ...utmParams,
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent || undefined,
      };

      const { data: result, error } = await supabase.functions.invoke('submit-lead', {
        body: payload,
      });

      if (error) {
        console.error('Submit error:', error);
        return {
          success: false,
          error: language === 'de' 
            ? 'Das hat grad nicht geklappt. Bitte nochmals versuchen.'
            : 'Something went wrong. Please try again.',
        };
      }

      if (result.errors) {
        return { success: false, errors: result.errors };
      }

      if (result.error) {
        return { success: false, error: result.error };
      }

      // Track success event
      if (data.lead_type === 'free_audit') {
        track('audit_submit', {
          lead_type: 'free_audit',
          language,
          industry: data.industry,
          service_area: data.service_area,
          budget_range: data.budget_range,
          capacity_range: data.capacity_range,
          page_path: window.location.pathname,
        });
      } else {
        track('call_book', {
          lead_type: 'free_call',
          language,
          page_path: window.location.pathname,
        });
      }

      return { success: true, leadId: result.lead_id };
    } catch (err) {
      console.error('Unexpected error:', err);
      return {
        success: false,
        error: language === 'de'
          ? 'Das hat grad nicht geklappt. Bitte nochmals versuchen.'
          : 'Something went wrong. Please try again.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitLead, isSubmitting };
}
