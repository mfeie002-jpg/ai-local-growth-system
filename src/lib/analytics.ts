// Analytics tracking utility for itsFeierabend.ch
// GA4 Event Calls - Measurement ID to be configured

interface TrackingParams {
  language: 'de' | 'en';
  page_path: string;
  cta_text: string;
  cta_location: string;
}

// Placeholder for GA4 Measurement ID
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual Measurement ID

// Check if gtag is available
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
}

// Generic tracking function
export function track(eventName: string, params: Record<string, string | number | boolean | undefined> = {}): void {
  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, params);
  }

  // Send to GA4 if available
  if (isGtagAvailable()) {
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
