import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function SEOHead({ title, description, canonical, ogImage, noIndex = false }: SEOHeadProps) {
  const location = useLocation();
  const baseUrl = 'https://itsfeierabend.ch';
  const fullCanonical = canonical || `${baseUrl}${location.pathname}`;
  const fullTitle = `${title} | itsFeierabend.ch`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta
    updateMeta('description', description);
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    }

    // OpenGraph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', fullCanonical, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:site_name', 'itsFeierabend.ch', true);
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
    }

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    if (ogImage) {
      updateMeta('twitter:image', ogImage);
    }

    // Update canonical link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullCanonical);

    return () => {
      // Cleanup is handled by next page update
    };
  }, [fullTitle, description, fullCanonical, ogImage, noIndex]);

  return null;
}

// JSON-LD Schema component
interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function OrganizationSchema({
  name = 'itsFeierabend.ch',
  url = 'https://itsfeierabend.ch',
  description,
}: OrganizationSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name,
      url,
      description,
      areaServed: {
        '@type': 'Country',
        name: 'Switzerland',
      },
      serviceType: ['Digital Marketing', 'SEO', 'Google Ads', 'Marketing Automation'],
    };

    let script = document.querySelector('script[data-schema="organization"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'organization');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, [name, url, description]);

  return null;
}
