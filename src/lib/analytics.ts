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

// Check if gtag is available
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
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

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag = function gtag() {
    (window as any).dataLayer.push(arguments);
  };
  (window as any).gtag('js', new Date());
  (window as any).gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: true,
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
    (window as any).gtag('event', eventName, {
      ...params,
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
  track('page_view', {
    page_path: pagePath,
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
    page_path: pagePath,
  });
}
