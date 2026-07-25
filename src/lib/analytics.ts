// Analytics tracking utility for itsFeierabend.ch
// GA4 Event Calls - Measurement ID to be configured

import { getConsent } from './consent';

interface TrackingParams {
  language: 'de' | 'en';
  page_path: string;
  cta_text: string;
  cta_location: string;
}

// GA4 Measurement ID from env
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export function sanitizeAnalyticsPath(path: string): string {
  return path
    .replace(/^\/audit\/r\/[^/]+/, '/audit/r/:token')
    .replace(/^\/en\/audit\/r\/[^/]+/, '/en/audit/r/:token')
    .replace(/^\/analyse\/progress\/[^/]+/, '/analyse/progress/:token')
    .replace(/^\/en\/analysis\/progress\/[^/]+/, '/en/analysis/progress/:token')
    .replace(/^\/analyse\/[^/]+/, '/analyse/:token')
    .replace(/^\/en\/analysis\/[^/]+/, '/en/analysis/:token');
}

// Check if gtag is available
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// Check if analytics consent is granted
function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics === true;
}

// Initialize GA4 (call after consent granted)
export function initGA4(): void {
  if (!GA4_MEASUREMENT_ID || typeof window === 'undefined') return;
  
  // Check if already loaded
  if (isGtagAvailable()) return;

  // Define consent defaults before loading the remote library.
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  const consent = getConsent();
  window.gtag('consent', 'default', {
    analytics_storage: consent?.analytics ? 'granted' : 'denied',
    ad_storage: consent?.marketing ? 'granted' : 'denied',
    ad_user_data: consent?.marketing ? 'granted' : 'denied',
    ad_personalization: consent?.marketing ? 'granted' : 'denied',
    wait_for_update: 500,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: getConsent()?.marketing === true,
  });
}

// Generic tracking function
export function track(eventName: string, params: Record<string, string | number | boolean | undefined> = {}): void {
  // Only track if analytics consent is granted
  if (!hasAnalyticsConsent()) {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Blocked (no consent): ${eventName}`, params);
    }
    return;
  }

  // Log for development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}`, params);
  }

  // Send to GA4 if available
  if (isGtagAvailable() && GA4_MEASUREMENT_ID) {
    const safePath = sanitizeAnalyticsPath(window.location.pathname);
    window.gtag?.('event', eventName, {
      ...params,
      page_path: typeof params.page_path === 'string'
        ? sanitizeAnalyticsPath(params.page_path)
        : safePath,
      page_location: `${window.location.origin}${safePath}`,
      send_to: GA4_MEASUREMENT_ID,
    });
  }
}

// Specific event tracking functions
export function trackAuditSubmit(params: TrackingParams): void {
  track('audit_submit', { ...params });
}

export function trackCallBook(params: TrackingParams): void {
  track('call_book', { ...params });
}

export function trackPhoneClick(params: TrackingParams): void {
  track('phone_click', { ...params });
}

export function trackWhatsAppClick(params: TrackingParams): void {
  track('whatsapp_click', { ...params });
}

// CTA click tracking
export function trackCTAClick(params: TrackingParams): void {
  track('cta_click', { ...params });
}

// Page view tracking
export function trackPageView(pagePath: string, pageTitle: string, language: 'de' | 'en'): void {
  const safePath = sanitizeAnalyticsPath(pagePath);
  track('page_view', {
    page_path: safePath,
    page_location: `${window.location.origin}${safePath}`,
    page_title: pageTitle,
    language,
  });
}

// Form interaction tracking
export function trackFormStart(formName: string, params: Partial<TrackingParams>): void {
  track('form_start', {
    form_name: formName,
    ...params,
  });
}

export function trackFormComplete(formName: string, params: Partial<TrackingParams>): void {
  track('form_complete', {
    form_name: formName,
    ...params,
  });
}

// Scroll depth tracking
export function trackScrollDepth(depth: number, pagePath: string): void {
  track('scroll_depth', {
    depth_percentage: depth,
    page_path: sanitizeAnalyticsPath(pagePath),
  });
}
