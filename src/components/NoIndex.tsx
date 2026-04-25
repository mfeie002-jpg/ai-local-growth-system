import { useEffect } from 'react';

/**
 * Sets <meta name="robots" content="noindex, nofollow"> on mount.
 * Use on admin / private pages that don't render <SEOHead>.
 */
export function NoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      // Restore default so other routes aren't poisoned
      if (meta) meta.setAttribute('content', previous || 'index, follow');
    };
  }, []);
  return null;
}
