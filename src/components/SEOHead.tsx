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

// JSON-LD Schema component for Organization
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
      '@id': `${url}#organization`,
      name,
      url,
      description,
      logo: `${url}/favicon.png`,
      image: `${url}/favicon.png`,
      email: 'info@itsfeierabend.ch',
      areaServed: {
        '@type': 'Country',
        name: 'Switzerland',
      },
      serviceType: [
        'Digital Marketing',
        'SEO',
        'Google Ads',
        'Marketing Automation',
        'AI Implementation',
        'Brand Management',
        'Web Design',
        'Social Media Marketing'
      ],
      priceRange: '$$',
      knowsLanguage: ['de', 'en'],
      sameAs: [],
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

// JSON-LD Schema for Service pages
interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
}

export function ServiceSchema({
  name,
  description,
  provider = 'itsFeierabend.ch',
  areaServed = 'Switzerland',
}: ServiceSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description,
      provider: {
        '@type': 'ProfessionalService',
        name: provider,
        url: 'https://itsfeierabend.ch',
      },
      areaServed: {
        '@type': 'Country',
        name: areaServed,
      },
    };

    let script = document.querySelector(`script[data-schema="service-${name.toLowerCase().replace(/\s+/g, '-')}"]`);
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', `service-${name.toLowerCase().replace(/\s+/g, '-')}`);
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, [name, description, provider, areaServed]);

  return null;
}

// JSON-LD Schema for FAQ pages
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    let script = document.querySelector('script[data-schema="faq"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'faq');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, [items]);

  return null;
}

// JSON-LD Schema for Blog/Article pages
interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  author = 'itsFeierabend.ch',
  image,
}: ArticleSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Organization',
        name: author,
        url: 'https://itsfeierabend.ch',
      },
      publisher: {
        '@type': 'Organization',
        name: 'itsFeierabend.ch',
        url: 'https://itsfeierabend.ch',
        logo: {
          '@type': 'ImageObject',
          url: 'https://itsfeierabend.ch/favicon.png',
        },
      },
      image: image || 'https://itsfeierabend.ch/favicon.png',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': typeof window !== 'undefined' ? window.location.href : '',
      },
    };

    let script = document.querySelector('script[data-schema="article"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'article');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, [headline, description, datePublished, dateModified, author, image]);

  return null;
}

// JSON-LD Schema for Breadcrumbs
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    let script = document.querySelector('script[data-schema="breadcrumb"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'breadcrumb');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, [items]);

  return null;
}
