// Maps every public route to its DE/EN counterpart for hreflang emission.
// Keep in sync with App.tsx and public/sitemap.xml.

export interface RoutePair {
  de: string;
  en: string;
}

const PAIRS: RoutePair[] = [
  { de: '/', en: '/en' },
  { de: '/audit', en: '/en/audit' },
  // Sprint 2 SEO landings
  { de: '/website-audit', en: '/en/website-audit' },
  { de: '/seo-analyse', en: '/en/seo-analysis' },
  { de: '/ai-visibility', en: '/en/ai-visibility' },
  { de: '/fuer-kmu', en: '/en/for-smb' },
  { de: '/partner', en: '/en/partner' },
  // Existing
  { de: '/gratis-call', en: '/en/free-call' },
  { de: '/system', en: '/en/system' },
  { de: '/pakete', en: '/en/pricing' },
  { de: '/faq', en: '/en/faq' },
  { de: '/impressum', en: '/en/imprint' },
  { de: '/datenschutz', en: '/en/privacy' },
  { de: '/demo', en: '/en/demo' },
  { de: '/fallstudien', en: '/en/case-studies' },
  { de: '/ultimate-package', en: '/en/ultimate-package' },
  { de: '/scan', en: '/en/scan' },
  { de: '/blog', en: '/en/blog' },
  { de: '/services/ki-implementierung', en: '/en/services/ai-implementation' },
  { de: '/services/seo', en: '/en/services/seo' },
  { de: '/services/sea', en: '/en/services/sea' },
  { de: '/services/reputation', en: '/en/services/reputation' },
  { de: '/services/design-entwicklung', en: '/en/services/design-development' },
  { de: '/services/brand-deployment', en: '/en/services/brand-deployment' },
  { de: '/services/social-media', en: '/en/services/social-media' },
];

export const BASE_URL = 'https://itsfeierabend.ch';

/** Returns the DE/EN pair for a given pathname, or null if none. */
export function findRoutePair(pathname: string): RoutePair | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return PAIRS.find((p) => p.de === normalized || p.en === normalized) ?? null;
}
