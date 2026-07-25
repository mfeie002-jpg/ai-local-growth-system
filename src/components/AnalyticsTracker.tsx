import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA4, track, trackPageView } from '@/lib/analytics';
import { useLanguage } from '@/i18n/LanguageContext';
import { hasAnalyticsConsent, type ConsentPreferences } from '@/lib/consent';

const SCROLL_THRESHOLDS = [25, 50, 75, 90];

function isTrackingExcluded(pathname: string): boolean {
  return /^\/admin(?:\/|$)/.test(pathname) ||
    /^\/\.lovable\/oauth(?:\/|$)/.test(pathname);
}

function pageType(pathname: string): string {
  if (/^\/(?:en\/)?audit\/r\//.test(pathname)) return 'audit_result';
  if (pathname === '/audit' || pathname === '/en/audit') return 'audit';
  if (pathname.includes('partner')) return 'partner';
  if (pathname.includes('kontakt') || pathname.includes('contact')) return 'contact';
  if (pathname.includes('insights')) return 'insights';
  if (pathname === '/' || pathname === '/en') return 'home';
  return 'landing_page';
}

export function AnalyticsTracker() {
  const location = useLocation();
  const { language } = useLanguage();
  const reached = useRef<Set<number>>(new Set());
  const pageViewSent = useRef<string | null>(null);

  useEffect(() => {
    reached.current = new Set();
    if (isTrackingExcluded(location.pathname)) return;
    const pageKey = `${location.pathname}|${language}`;
    const sendCurrentPageView = () => {
      if (!hasAnalyticsConsent() || pageViewSent.current === pageKey) return;
      initGA4();
      trackPageView(location.pathname, document.title, language);
      pageViewSent.current = pageKey;
    };
    sendCurrentPageView();

    const handleConsent = (event: Event) => {
      const detail = (event as CustomEvent<ConsentPreferences>).detail;
      if (detail?.analytics) sendCurrentPageView();
    };
    window.addEventListener('consentUpdate', handleConsent);
    return () => window.removeEventListener('consentUpdate', handleConsent);
  }, [language, location.pathname]);

  useEffect(() => {
    if (isTrackingExcluded(location.pathname)) return;
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of SCROLL_THRESHOLDS) {
        if (depth >= threshold && !reached.current.has(threshold)) {
          reached.current.add(threshold);
          track('scroll_depth', {
            depth_percentage: threshold,
            page_path: location.pathname,
            page_type: pageType(location.pathname),
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (isTrackingExcluded(location.pathname)) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      const base = {
        page_path: location.pathname,
        page_type: pageType(location.pathname),
      };

      if (href.startsWith('mailto:')) {
        track('email_click', base);
        track('contact_click', { ...base, contact_type: 'email' });
        return;
      }
      if (href.startsWith('tel:')) {
        track('phone_click', base);
        track('contact_click', { ...base, contact_type: 'phone' });
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          track('outbound_click', {
            ...base,
            outbound_host: url.hostname,
          });
        }
      } catch {
        // Ignore malformed hrefs. Navigation behaviour remains unchanged.
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname]);

  return null;
}
