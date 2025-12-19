export interface BlogPost {
  slug: string;
  slugEn: string;
  title: {
    de: string;
    en: string;
  };
  excerpt: {
    de: string;
    en: string;
  };
  content: {
    de: string;
    en: string;
  };
  category: {
    de: string;
    en: string;
  };
  author: string;
  date: string;
  readTime: number;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'local-seo-grundlagen-schweiz',
    slugEn: 'local-seo-basics-switzerland',
    title: {
      de: 'Local SEO Grundlagen: So wirst du in deiner Region gefunden',
      en: 'Local SEO Basics: How to Get Found in Your Region',
    },
    excerpt: {
      de: 'Die wichtigsten Faktoren für lokale Sichtbarkeit in der Schweiz: Google Business Profil, lokale Keywords und Bewertungen.',
      en: 'The key factors for local visibility in Switzerland: Google Business Profile, local keywords, and reviews.',
    },
    content: {
      de: `
## Warum Local SEO entscheidend ist

Für lokale Dienstleister in der Schweiz ist Local SEO der Schlüssel zu mehr Kundenanfragen. Wenn jemand "Reinigungsfirma Zürich" oder "Elektriker in meiner Nähe" sucht, willst du in den Top-Resultaten erscheinen.

### Die 3 Säulen von Local SEO

1. **Google Business Profil optimieren**
   - Vollständige Unternehmensinformationen
   - Hochwertige Fotos
   - Regelmässige Posts und Updates
   - Schnelle Reaktion auf Bewertungen

2. **Lokale Keywords einsetzen**
   - Ortsnamen in Titeln und Texten
   - Service-spezifische Begriffe
   - Long-Tail Keywords wie "günstiger Maler Winterthur"

3. **Bewertungen aktiv sammeln**
   - Zufriedene Kunden um Bewertung bitten
   - Auf alle Bewertungen antworten
   - Negative Bewertungen professionell behandeln

### Quick Wins für sofortige Verbesserung

- Öffnungszeiten aktualisieren
- Alle Services auflisten
- Fotos von Arbeiten hochladen
- FAQ auf der Website einbauen

### Fazit

Local SEO ist kein Hexenwerk. Mit den richtigen Grundlagen und Konsistenz kannst du deine lokale Sichtbarkeit massiv verbessern.
      `,
      en: `
## Why Local SEO Matters

For local service providers in Switzerland, Local SEO is the key to more customer inquiries. When someone searches for "cleaning company Zurich" or "electrician near me," you want to appear in the top results.

### The 3 Pillars of Local SEO

1. **Optimize Google Business Profile**
   - Complete business information
   - High-quality photos
   - Regular posts and updates
   - Quick response to reviews

2. **Use Local Keywords**
   - Location names in titles and content
   - Service-specific terms
   - Long-tail keywords like "affordable painter Winterthur"

3. **Actively Collect Reviews**
   - Ask satisfied customers for reviews
   - Respond to all reviews
   - Handle negative reviews professionally

### Quick Wins for Immediate Improvement

- Update business hours
- List all services
- Upload photos of your work
- Add FAQ to your website

### Conclusion

Local SEO isn't rocket science. With the right fundamentals and consistency, you can massively improve your local visibility.
      `,
    },
    category: { de: 'SEO', en: 'SEO' },
    author: 'itsFeierabend Team',
    date: '2024-12-15',
    readTime: 5,
    featured: true,
  },
  {
    slug: 'google-ads-fuer-handwerker',
    slugEn: 'google-ads-for-tradespeople',
    title: {
      de: 'Google Ads für Handwerker: Kampagnen, die wirklich Leads bringen',
      en: 'Google Ads for Tradespeople: Campaigns That Actually Generate Leads',
    },
    excerpt: {
      de: 'Wie du mit Google Ads qualifizierte Anfragen generierst, ohne Budget zu verschwenden.',
      en: 'How to generate qualified inquiries with Google Ads without wasting budget.',
    },
    content: {
      de: `
## Google Ads richtig aufsetzen

Viele Handwerker verbrennen Geld mit Google Ads. Das Problem? Falsche Keywords, schlechte Landingpages und fehlendes Tracking.

### Die richtige Keyword-Strategie

Fokussiere dich auf High-Intent Keywords:
- "Sanitär Notfall Zürich" ✅
- "Sanitär" ❌ (zu breit)
- "Maler Offerte Bern" ✅
- "Farben" ❌ (irrelevant)

### Landingpage-Tipps

1. Klare Überschrift mit Service + Ort
2. Telefonnummer prominent platzieren
3. Bewertungen zeigen
4. Einfaches Kontaktformular
5. Mobile-optimiert

### Conversion Tracking einrichten

Ohne Tracking weisst du nicht, was funktioniert:
- Anrufe tracken
- Formular-Einreichungen messen
- Return on Ad Spend berechnen

### Budget-Empfehlung

Starte mit CHF 50-100/Tag und optimiere basierend auf Daten.
      `,
      en: `
## Setting Up Google Ads Correctly

Many tradespeople waste money on Google Ads. The problem? Wrong keywords, poor landing pages, and missing tracking.

### The Right Keyword Strategy

Focus on high-intent keywords:
- "Plumbing emergency Zurich" ✅
- "Plumbing" ❌ (too broad)
- "Painter quote Bern" ✅
- "Colors" ❌ (irrelevant)

### Landing Page Tips

1. Clear headline with service + location
2. Phone number prominently placed
3. Show reviews
4. Simple contact form
5. Mobile-optimized

### Set Up Conversion Tracking

Without tracking, you don't know what works:
- Track calls
- Measure form submissions
- Calculate Return on Ad Spend

### Budget Recommendation

Start with CHF 50-100/day and optimize based on data.
      `,
    },
    category: { de: 'Google Ads', en: 'Google Ads' },
    author: 'itsFeierabend Team',
    date: '2024-12-10',
    readTime: 6,
    featured: true,
  },
  {
    slug: 'ki-automatisierung-lokale-unternehmen',
    slugEn: 'ai-automation-local-businesses',
    title: {
      de: 'KI-Automatisierung für lokale Unternehmen: Ein Praxisguide',
      en: 'AI Automation for Local Businesses: A Practical Guide',
    },
    excerpt: {
      de: 'Wie du mit KI-Tools Zeit sparst und mehr Leads in Kunden verwandelst.',
      en: 'How to save time and convert more leads into customers with AI tools.',
    },
    content: {
      de: `
## KI ist kein Zukunftsthema mehr

Lokale Unternehmen können heute schon von KI profitieren — ohne Programmierkenntnisse.

### Praktische Anwendungen

**1. Automatische Lead-Antworten**
Wenn ein Lead reinkommt, antwortet ein KI-Agent sofort:
- Qualifiziert den Lead
- Sammelt wichtige Infos
- Bucht Termine

**2. Follow-up Sequenzen**
Automatische Erinnerungen via SMS/Email:
- Nach Angebotsversand
- Vor dem Termin
- Nach Abschluss (für Bewertung)

**3. Bewertungs-Management**
Nach jedem Job automatisch Bewertung anfragen und an die richtige Plattform weiterleiten.

### Konkrete Zeitersparnis

| Aufgabe | Manuell | Mit KI |
|---------|---------|--------|
| Lead-Antwort | 5-30 Min | Sofort |
| Follow-up | 15 Min/Lead | 0 Min |
| Bewertung anfragen | 5 Min | 0 Min |

### Fazit

KI-Automatisierung ist keine Raketenwissenschaft. Starte mit einem Use Case und baue aus.
      `,
      en: `
## AI Is No Longer Just Future Talk

Local businesses can benefit from AI today — without programming knowledge.

### Practical Applications

**1. Automatic Lead Responses**
When a lead comes in, an AI agent responds immediately:
- Qualifies the lead
- Collects important info
- Books appointments

**2. Follow-up Sequences**
Automatic reminders via SMS/Email:
- After sending quotes
- Before the appointment
- After completion (for reviews)

**3. Review Management**
Automatically request reviews after each job and route to the right platform.

### Concrete Time Savings

| Task | Manual | With AI |
|------|--------|---------|
| Lead response | 5-30 min | Instant |
| Follow-up | 15 min/lead | 0 min |
| Request review | 5 min | 0 min |

### Conclusion

AI automation isn't rocket science. Start with one use case and expand.
      `,
    },
    category: { de: 'KI & Automatisierung', en: 'AI & Automation' },
    author: 'itsFeierabend Team',
    date: '2024-12-05',
    readTime: 4,
    featured: true,
  },
  {
    slug: 'conversion-rate-optimierung-landingpages',
    slugEn: 'conversion-rate-optimization-landing-pages',
    title: {
      de: 'Conversion Rate Optimierung: So werden aus Besuchern Kunden',
      en: 'Conversion Rate Optimization: Turning Visitors Into Customers',
    },
    excerpt: {
      de: 'Praktische Tipps, um deine Landingpage-Conversion zu verdoppeln.',
      en: 'Practical tips to double your landing page conversion rate.',
    },
    content: {
      de: `
## Warum Conversion Rate Optimierung?

Du bezahlst für jeden Klick. Wenn deine Landingpage nicht konvertiert, verlierst du Geld.

### Die wichtigsten Elemente

**Above the Fold**
- Klare Überschrift (Was + Für wen + Wo)
- Telefonnummer sichtbar
- Call-to-Action Button

**Social Proof**
- Kundenbewertungen
- Anzahl Projekte
- Zertifizierungen

**Vertrauenssignale**
- Lokale Adresse
- Team-Fotos
- Garantien

### Schnelle Optimierungen

1. CTA-Button Farbe ändern (Kontrast!)
2. Telefonnummer grösser machen
3. Bewertungen über dem Fold zeigen
4. Formularfelder reduzieren
5. Ladezeit verbessern

### A/B Testing

Teste immer nur eine Variable:
- Überschrift A vs B
- Button-Text
- Formular-Layout

### Fazit

Kleine Änderungen können grosse Unterschiede machen. Messe, teste, optimiere.
      `,
      en: `
## Why Conversion Rate Optimization?

You pay for every click. If your landing page doesn't convert, you're losing money.

### The Key Elements

**Above the Fold**
- Clear headline (What + For whom + Where)
- Visible phone number
- Call-to-action button

**Social Proof**
- Customer reviews
- Number of projects
- Certifications

**Trust Signals**
- Local address
- Team photos
- Guarantees

### Quick Optimizations

1. Change CTA button color (contrast!)
2. Make phone number larger
3. Show reviews above the fold
4. Reduce form fields
5. Improve loading time

### A/B Testing

Always test just one variable:
- Headline A vs B
- Button text
- Form layout

### Conclusion

Small changes can make big differences. Measure, test, optimize.
      `,
    },
    category: { de: 'Conversion', en: 'Conversion' },
    author: 'itsFeierabend Team',
    date: '2024-11-28',
    readTime: 5,
  },
  {
    slug: 'bewertungen-sammeln-strategie',
    slugEn: 'collecting-reviews-strategy',
    title: {
      de: 'Bewertungen sammeln: Die perfekte Strategie für lokale Dienstleister',
      en: 'Collecting Reviews: The Perfect Strategy for Local Service Providers',
    },
    excerpt: {
      de: 'Mehr 5-Sterne-Bewertungen auf Google — so machst du es richtig.',
      en: 'More 5-star reviews on Google — here\'s how to do it right.',
    },
    content: {
      de: `
## Warum Bewertungen so wichtig sind

Bewertungen sind der grösste Vertrauensfaktor. 93% der Kunden lesen Bewertungen vor einer Kaufentscheidung.

### Die beste Timing-Strategie

**Wann fragen?**
- Direkt nach erfolgreichem Abschluss
- Wenn der Kunde zufrieden ist
- Per SMS oder WhatsApp (höchste Antwortrate)

**Wie fragen?**
Kurz und persönlich:
"Hallo [Name], danke für Ihren Auftrag! Wenn Sie zufrieden waren, würden wir uns über eine kurze Bewertung freuen: [Link]"

### Negative Bewertungen

1. Schnell antworten (24h)
2. Professionell bleiben
3. Lösung anbieten
4. Offline klären

### Automatisierung

Mit dem richtigen Setup:
- Automatische SMS nach Auftragsabschluss
- Routing zu Google oder ProvenExpert
- Dashboard für Übersicht

### Fazit

Konsistentes Bewertungsmanagement bringt mehr Kunden als jede andere Marketing-Massnahme.
      `,
      en: `
## Why Reviews Are So Important

Reviews are the biggest trust factor. 93% of customers read reviews before making a purchase decision.

### The Best Timing Strategy

**When to ask?**
- Right after successful completion
- When the customer is satisfied
- Via SMS or WhatsApp (highest response rate)

**How to ask?**
Short and personal:
"Hello [Name], thank you for your order! If you were satisfied, we'd appreciate a quick review: [Link]"

### Negative Reviews

1. Respond quickly (24h)
2. Stay professional
3. Offer a solution
4. Resolve offline

### Automation

With the right setup:
- Automatic SMS after job completion
- Routing to Google or ProvenExpert
- Dashboard for overview

### Conclusion

Consistent review management brings more customers than any other marketing measure.
      `,
    },
    category: { de: 'Reputation', en: 'Reputation' },
    author: 'itsFeierabend Team',
    date: '2024-11-20',
    readTime: 4,
  },
  {
    slug: 'social-media-fuer-handwerker',
    slugEn: 'social-media-for-tradespeople',
    title: {
      de: 'Social Media für Handwerker: Was wirklich funktioniert',
      en: 'Social Media for Tradespeople: What Actually Works',
    },
    excerpt: {
      de: 'Weniger posten, mehr Resultate: Die Social Media Strategie für beschäftigte Unternehmer.',
      en: 'Post less, get more results: The social media strategy for busy entrepreneurs.',
    },
    content: {
      de: `
## Social Media ohne Zeitverschwendung

Du hast keine Zeit für stundenlange Social Media Arbeit? Kein Problem.

### Die 80/20 Strategie

**Was funktioniert:**
- Vorher/Nachher Fotos
- Kurze Projekt-Videos
- Kundenbewertungen teilen
- Behind-the-Scenes

**Was du ignorieren kannst:**
- Tägliches Posten
- Perfekte Grafiken
- Trend-Hopping

### Minimaler Aufwand, maximaler Effekt

1. **Foto-Routine entwickeln**
   - Bei jedem Projekt 3 Fotos machen
   - Vorher, während, nachher

2. **Wochen-Post planen**
   - 1-2 Posts pro Woche reichen
   - Beste Zeit: Morgens oder Abends

3. **Wiederverwendung**
   - Ein Video für Instagram, Facebook, Website

### Plattform-Empfehlung

- **Instagram**: Visuell stark, gut für Handwerk
- **Facebook**: Lokale Gruppen, Empfehlungen
- **LinkedIn**: B2B, Gebäudetechnik

### Fazit

Qualität schlägt Quantität. Zeige deine Arbeit authentisch.
      `,
      en: `
## Social Media Without Wasting Time

You don't have time for hours of social media work? No problem.

### The 80/20 Strategy

**What works:**
- Before/after photos
- Short project videos
- Share customer reviews
- Behind-the-scenes

**What you can ignore:**
- Daily posting
- Perfect graphics
- Trend-hopping

### Minimal Effort, Maximum Effect

1. **Develop a photo routine**
   - Take 3 photos at every project
   - Before, during, after

2. **Plan weekly posts**
   - 1-2 posts per week is enough
   - Best time: Morning or evening

3. **Reuse content**
   - One video for Instagram, Facebook, website

### Platform Recommendation

- **Instagram**: Visually strong, good for trades
- **Facebook**: Local groups, recommendations
- **LinkedIn**: B2B, building services

### Conclusion

Quality beats quantity. Show your work authentically.
      `,
    },
    category: { de: 'Social Media', en: 'Social Media' },
    author: 'itsFeierabend Team',
    date: '2024-11-15',
    readTime: 4,
  },
];

export function getBlogPost(slug: string, isEnglish: boolean): BlogPost | undefined {
  return blogPosts.find(post => 
    isEnglish ? post.slugEn === slug : post.slug === slug
  );
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}
