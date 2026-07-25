import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/analytics';
import { getConsent, type ConsentPreferences } from '@/lib/consent';

const UTM_STORAGE_KEY = 'itsfeierabend_utm_params';
const UTM_EXPIRY_DAYS = 30;

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  landing_timestamp?: number;
}

function canPersistAttribution(): boolean {
  const consent = getConsent();
  return consent?.analytics === true || consent?.marketing === true;
}

// Attribution is always available for the active form session. A 30-day
// browser-persistent copy is created only after analytics or marketing consent.
function saveUTMParams(params: UTMParams): void {
  const data = {
    ...params,
    expires: Date.now() + UTM_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };
  try {
    const serialized = JSON.stringify(data);
    sessionStorage.setItem(UTM_STORAGE_KEY, serialized);
    if (canPersistAttribution()) {
      localStorage.setItem(UTM_STORAGE_KEY, serialized);
    } else {
      localStorage.removeItem(UTM_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Could not save UTM params', e);
  }
}

// Get stored UTM params (returns null if expired)
export function getStoredUTMParams(): UTMParams | null {
  try {
    if (!canPersistAttribution()) {
      localStorage.removeItem(UTM_STORAGE_KEY);
    }
    const stored =
      sessionStorage.getItem(UTM_STORAGE_KEY) ??
      (canPersistAttribution() ? localStorage.getItem(UTM_STORAGE_KEY) : null);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    if (data.expires && data.expires < Date.now()) {
      sessionStorage.removeItem(UTM_STORAGE_KEY);
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }
    
    const { expires: _expires, ...params } = data;
    return params;
  } catch (e) {
    return null;
  }
}

// Get UTM params from current URL
function getURLUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const utm_term = params.get('utm_term');
  const utm_content = params.get('utm_content');
  const gclid = params.get('gclid');
  
  if (utm_source) utmParams.utm_source = utm_source;
  if (utm_medium) utmParams.utm_medium = utm_medium;
  if (utm_campaign) utmParams.utm_campaign = utm_campaign;
  if (utm_term) utmParams.utm_term = utm_term;
  if (utm_content) utmParams.utm_content = utm_content;
  if (gclid) utmParams.gclid = gclid;
  
  return utmParams;
}

// Hook to capture and persist UTM params
export function useUTMTracking(): void {
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = getURLUTMParams();
    const hasNewUTM = Object.keys(urlParams).length > 0;
    
    if (hasNewUTM) {
      // New UTM params in URL - save them
      const params: UTMParams = {
        ...urlParams,
        referrer: document.referrer || undefined,
        landing_page: location.pathname,
        landing_timestamp: Date.now(),
      };
      saveUTMParams(params);
      
      // Track the landing
      track('utm_landing', {
        ...urlParams,
        landing_page: location.pathname,
      });
    } else if (!getStoredUTMParams()) {
      // No UTM in URL and nothing stored - save organic visit info
      let referralSource = 'direct';
      if (document.referrer) {
        try {
          referralSource = new URL(document.referrer).hostname;
        } catch {
          referralSource = 'referral';
        }
      }
      const params: UTMParams = {
        utm_source: referralSource,
        utm_medium: document.referrer ? 'referral' : 'none',
        referrer: document.referrer || undefined,
        landing_page: location.pathname,
        landing_timestamp: Date.now(),
      };
      saveUTMParams(params);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleConsent = (event: Event) => {
      const preferences = (event as CustomEvent<ConsentPreferences>).detail;
      if (!preferences.analytics && !preferences.marketing) {
        localStorage.removeItem(UTM_STORAGE_KEY);
        return;
      }
      const current = getStoredUTMParams();
      if (current) saveUTMParams(current);
    };
    window.addEventListener('consentUpdate', handleConsent);
    return () => window.removeEventListener('consentUpdate', handleConsent);
  }, []);
}

// Get all UTM params (from URL first, then storage)
export function getUTMParams(): UTMParams {
  const urlParams = getURLUTMParams();
  if (Object.keys(urlParams).length > 0) {
    return urlParams;
  }
  return getStoredUTMParams() || {};
}
