// Cookie Consent Management
const CONSENT_COOKIE_NAME = 'consent_v1';
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60; // 180 days in seconds

export interface ConsentPreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

export function getConsent(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const consentCookie = cookies.find(c => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
  
  if (!consentCookie) return null;
  
  try {
    const value = consentCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

export function setConsent(preferences: Partial<ConsentPreferences>): void {
  if (typeof document === 'undefined') return;
  
  const consent: ConsentPreferences = {
    necessary: true, // Always true
    analytics: preferences.analytics ?? false,
    marketing: preferences.marketing ?? false,
    timestamp: Date.now(),
  };
  
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax; Secure`;
  
  // Update gtag consent if available
  updateGtagConsent(consent);

  if (!consent.analytics) {
    clearGoogleAnalyticsCookies();
  }
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('consentUpdate', { detail: consent }));
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  const consent = getConsent();
  return consent?.marketing === true;
}

export function acceptAll(): void {
  setConsent({ analytics: true, marketing: true });
}

export function acceptNecessaryOnly(): void {
  setConsent({ analytics: false, marketing: false });
}

// Consent Mode v2 integration
function updateGtagConsent(consent: ConsentPreferences): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  });
}

// Initialize consent defaults for gtag
export function initializeGtagConsentDefaults(): void {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  
  const consent = getConsent();
  
  window.gtag('consent', 'default', {
    analytics_storage: consent?.analytics ? 'granted' : 'denied',
    ad_storage: consent?.marketing ? 'granted' : 'denied',
    ad_user_data: consent?.marketing ? 'granted' : 'denied',
    ad_personalization: consent?.marketing ? 'granted' : 'denied',
    wait_for_update: 500,
  });
}

function clearGoogleAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;
  const hostnameParts = window.location.hostname.split('.');
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
    hostnameParts.length > 1 ? `.${hostnameParts.slice(-2).join('.')}` : window.location.hostname,
  ];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (!name || !(name === '_ga' || name.startsWith('_ga_'))) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax; Secure`;
    }
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax; Secure`;
  }
}
