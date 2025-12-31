import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { track } from '@/lib/analytics';
import { getUTMParams, getStoredUTMParams } from '@/hooks/useUTMTracking';

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

  const submitLead = async (data: LeadData): Promise<SubmitResult> => {
    setIsSubmitting(true);

    try {
      // Get UTM params from URL or storage
      const utmParams = getUTMParams();
      const storedParams = getStoredUTMParams();
      
      const payload = {
        ...data,
        language,
        // Prefer current URL params, fallback to stored
        utm_source: utmParams.utm_source || storedParams?.utm_source,
        utm_medium: utmParams.utm_medium || storedParams?.utm_medium,
        utm_campaign: utmParams.utm_campaign || storedParams?.utm_campaign,
        utm_term: utmParams.utm_term || storedParams?.utm_term,
        utm_content: utmParams.utm_content || storedParams?.utm_content,
        gclid: utmParams.gclid || storedParams?.gclid,
        referrer: storedParams?.referrer || document.referrer || undefined,
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

      // Track success event with UTM data
      const trackingParams = {
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
      };

      if (data.lead_type === 'free_audit') {
        track('audit_submit', {
          lead_type: 'free_audit',
          language,
          industry: data.industry,
          service_area: data.service_area,
          budget_range: data.budget_range,
          capacity_range: data.capacity_range,
          page_path: window.location.pathname,
          ...trackingParams,
        });
      } else {
        track('call_book', {
          lead_type: 'free_call',
          language,
          page_path: window.location.pathname,
          ...trackingParams,
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
