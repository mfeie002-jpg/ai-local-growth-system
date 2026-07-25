// Maps every public route to its DE/EN counterpart for hreflang emission.
// Keep in sync with App.tsx and public/sitemap.xml.

export interface RoutePair {
  de: string;
  en: string;
}

const PAIRS: RoutePair[] = [
  { de: '/', en: '/en' },
  { de: '/ai-business-audit', en: '/en/ai-business-audit' },
  { de: '/website-audit', en: '/en/website-audit' },
  { de: '/seo-analyse', en: '/en/seo-analysis' },
  { de: '/ai-visibility', en: '/en/ai-visibility' },
  { de: '/automation', en: '/en/automation' },
  { de: '/leistungen', en: '/en/services' },
  { de: '/fuer-kmu', en: '/en/for-smes' },
  { de: '/partner', en: '/en/partners' },
  { de: '/fallstudien', en: '/en/case-studies' },
  { de: '/insights', en: '/en/insights' },
  { de: '/ueber-uns', en: '/en/about' },
  { de: '/kontakt', en: '/en/contact' },
  { de: '/audit', en: '/en/audit' },
  { de: '/impressum', en: '/en/imprint' },
  { de: '/datenschutz', en: '/en/privacy' },
];

export const BASE_URL = 'https://itsfeierabend.ch';

/** Returns the DE/EN pair for a given pathname, or null if none. */
export function findRoutePair(pathname: string): RoutePair | null {
  // Normalize trailing slashes (except root)
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return (
    PAIRS.find((p) => p.de === normalized || p.en === normalized) ?? null
  );
}
