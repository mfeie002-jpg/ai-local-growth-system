// Translations for itsFeierabend.ch - DE-CH & EN

export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Meta
    siteName: 'itsFeierabend.ch',
    siteDescription: 'KI-gestützte Digital Marketing Agentur. SEO, SEA, Social Media, Brand Management und KI-Implementierung für Ihr Wachstum.',
    
    // Navigation
    nav: {
      services: 'Services',
      system: 'System',
      audit: 'Gratis Audit',
      pricing: 'Pakete',
      faq: 'FAQ',
    },
    
    // CTAs
    cta: {
      freeAudit: 'Gratis Audit',
      freeCall: 'Gratis Call',
      getAudit: 'Gratis Audit holen',
      bookCall: 'Gratis Call buchen',
      startAudit: 'Audit starten',
      requestCall: 'Call anfragen',
      learnMore: 'Mehr erfahren',
    },
    
    // Hero
    hero: {
      title: 'Mehr Anfragen für deinen lokalen Service — mit einem System, das (fast) von alleine läuft.',
      subtitle: 'Wir kombinieren Google Ads, Local SEO, Conversion Optimierung und AI Automationen, damit aus Klicks gebuchte Jobs werden.',
      trustLine: 'Für Local Services in der Schweiz',
    },
    
    // Pillars
    pillars: {
      sectionTitle: 'Das System in 3 Säulen',
      traffic: {
        title: 'Traffic Engine',
        description: 'Google Ads + Local SEO (High-Intent, keine Vanity-Metrics).',
      },
      conversion: {
        title: 'Conversion Engine',
        description: 'Landingpages, Tracking, Call-Tracking, Offer & Copy.',
      },
      aiOps: {
        title: 'AI Ops',
        description: 'Lead-Routing, Follow-ups, CRM-Disziplin, Reviews, Reporting.',
      },
    },
    
    // Automations
    automations: {
      sectionTitle: 'Automationen, die Kunden lieben',
      leadConcierge: {
        title: 'Lead Concierge Agent',
        description: 'Antwortet schnell, fragt Qualifier, bucht Termine.',
      },
      followUp: {
        title: 'Follow-up Engine',
        description: 'SMS/E-Mail/WhatsApp Sequenzen bis zum Termin — ohne nervig zu sein.',
      },
      reviewHunter: {
        title: 'Review Hunter',
        description: 'Nach Abschluss automatisches Review-Request + Routing (Google / ProvenExpert).',
      },
      reporting: {
        title: 'Reporting Agent',
        description: 'Wöchentlicher CEO Report (Leads, Calls, CPL, ROAS, To-Do).',
      },
    },
    
    // Pricing
    pricing: {
      sectionTitle: 'Pakete & Pricing',
      disclaimer: 'Ad Spend ist extra (direkt beim Kunden). Bonus optional: z.B. pro gebuchten Job oder pro qualifiziertem Lead.',
      templateNote: 'Preise/Scope sind ein Template. Wir passen es je nach Branche, Region und Budget an.',
      perMonth: '/ Monat',
      oneTime: 'einmalig',
      launch: {
        name: 'Launch Sprint',
        duration: '14 Tage',
        forWhom: 'Start/Neustart',
        price: "CHF 1'990",
        features: [
          'Tracking Fix',
          'Audit-Report',
          '1 Landingpage',
          'CRM Pipeline',
          'Lead Response Setup',
        ],
      },
      growth: {
        name: 'Growth Retainer',
        duration: '90 Tage',
        forWhom: 'Konstanter Lead-Flow',
        price: "ab CHF 3'900",
        features: [
          'Ads + Local SEO',
          'CRO (Conversion Rate Optimization)',
          'Automationen',
          'Weekly Optimierung',
          'Dashboard',
        ],
      },
      leader: {
        name: 'Scale Retainer',
        duration: 'Ongoing',
        forWhom: 'Multi-Location Skalierung',
        price: "ab CHF 6'900",
        priceNote: '+ Bonus',
        features: [
          'Alles aus Growth',
          'Mehr Creatives',
          'Mehr Landingpages',
          'Review Engine',
          'Advanced Agents',
        ],
      },
    },
    
    // Audit Page
    audit: {
      heroTitle: 'Gratis Audit für Local Services in der Schweiz',
      heroSubtitle: 'Scorecard zu Website, Google Business, Tracking und Konkurrenz. Danach optional ein Gratis Call.',
      trustLine: 'Kein Spam. Keine Verpflichtung.',
      form: {
        industry: 'Branche',
        industryPlaceholder: 'Wähle deine Branche',
        industryOther: 'Andere',
        location: 'Ort / Einsatzgebiet',
        locationPlaceholder: 'z.B. Zürich und Umgebung',
        website: 'Website',
        websitePlaceholder: 'https://deine-website.ch',
        budget: 'Monatsbudget (Marketing)',
        budgetPlaceholder: 'z.B. CHF 2000',
        budgetHelper: 'Richtwert reicht.',
        capacity: 'Kapazität (neue Jobs/Woche)',
        capacityPlaceholder: 'z.B. 5-10',
        capacityHelper: 'Damit wir nicht Leads liefern, die du nicht bedienen kannst.',
        name: 'Name',
        namePlaceholder: 'Dein Name',
        email: 'E-Mail',
        emailPlaceholder: 'name@firma.ch',
        phone: 'Telefon (optional)',
        phonePlaceholder: '+41 ...',
        submit: 'Audit anfordern',
      },
      deliverables: {
        title: 'Was du bekommst',
        items: [
          'Scorecard mit den grössten Conversion-Bremsen (Website/LP)',
          'Tracking-Check (GA4/Events/Call-Tracking als Plan)',
          'Google Business Quick Wins (Local SEO Basics)',
          'Konkurrenz-Snapshot (wer gewinnt warum)',
          'Nächste Schritte: 3 Prioritäten für 30 Tage',
        ],
      },
      whatWeCheck: {
        title: 'Was wir prüfen',
        traffic: 'Traffic: Ads, SEO, Google Business',
        conversion: 'Conversion: Landingpage, Offer, Copy',
        ops: 'Ops: Tracking, CRM, Response Time',
      },
      steps: {
        title: 'So läuft\'s',
        step1: {
          title: 'Formular ausfüllen',
          description: '2 Minuten, keine versteckten Felder.',
        },
        step2: {
          title: 'Wir analysieren',
          description: 'Dein Audit wird innerhalb von 48h erstellt.',
        },
        step3: {
          title: 'Du entscheidest',
          description: 'Scorecard kommt per E-Mail. Call ist optional.',
        },
      },
    },
    
    // Call Page
    call: {
      heroTitle: 'Gratis Call buchen',
      heroSubtitle: '20 Minuten: Ziel, Offer, Kapazität, Budget, No-Go\'s, nächste 90 Tage.',
      trustLine: 'Wir melden uns mit Terminvorschlägen.',
      form: {
        name: 'Name',
        namePlaceholder: 'Dein Name',
        email: 'E-Mail',
        emailPlaceholder: 'name@firma.ch',
        phone: 'Telefon (optional)',
        phonePlaceholder: '+41 ...',
        company: 'Firma / Branche (optional)',
        companyPlaceholder: 'z.B. Reinigungsfirma',
        message: 'Nachricht (optional)',
        messagePlaceholder: 'Was möchtest du besprechen?',
        preferredTimes: 'Bevorzugte Zeiten (optional)',
        preferredTimesPlaceholder: 'z.B. Morgens, Di-Do',
        submit: 'Call anfragen',
      },
    },
    
    // System Page
    system: {
      heroTitle: 'Das System: Traffic → Conversion → AI Ops',
      heroSubtitle: 'Ein Full-Stack Growth System, das für lokale Dienstleister gebaut wurde.',
      traffic: {
        title: 'Traffic Engine',
        description: 'Wir bringen qualifizierte Besucher auf deine Seite — keine Vanity-Metrics.',
        outputs: [
          'Google Ads Kampagnen (High-Intent Keywords)',
          'Local SEO & Google Business Optimierung',
          'Standort-spezifische Landingpages',
        ],
      },
      conversion: {
        title: 'Conversion Engine',
        description: 'Aus Klicks werden Anfragen. Aus Anfragen werden gebuchte Jobs.',
        outputs: [
          'Conversion-optimierte Landingpages',
          'Call-Tracking & Lead Attribution',
          'A/B Testing & Offer Optimierung',
        ],
      },
      aiOps: {
        title: 'AI Ops',
        description: 'Automationen, die im Hintergrund schuften — 24/7.',
        outputs: [
          'Lead Concierge (automatische Antwort & Qualifizierung)',
          'Follow-up Sequenzen (SMS/WhatsApp/E-Mail)',
          'Review Requests & Reporting',
        ],
      },
    },
    
    // FAQ
    faq: {
      sectionTitle: 'Häufige Fragen',
      items: [
        {
          question: 'Ist das Audit wirklich gratis?',
          answer: 'Ja. Du bekommst eine Scorecard. Danach entscheidest du, ob du einen Call willst.',
        },
        {
          question: 'Für wen ist das System?',
          answer: 'Local Services in der Schweiz (Reinigung, Handwerk, Umzug, etc.).',
        },
        {
          question: 'Wie schnell geht\'s?',
          answer: 'Ads oft schneller. SEO braucht mehr Zeit. Im Call klären wir Prioritäten.',
        },
        {
          question: 'Ist ein Abo Pflicht?',
          answer: 'Nein. Es gibt Sprints und Retainer.',
        },
        {
          question: 'Was ist mit Datenschutz?',
          answer: 'Details in der Datenschutzerklärung (Schweiz).',
        },
        {
          question: 'Ist Ad Spend inklusive?',
          answer: 'Nein. Ad Spend zahlst du direkt.',
        },
        {
          question: 'Welche Branchen bedient ihr?',
          answer: 'Lokale Dienstleister: Reinigung, Handwerk, Umzug, Sanitär, Gartenbau, und mehr.',
        },
        {
          question: 'Wie lange dauert es, bis ich Resultate sehe?',
          answer: 'Google Ads: oft erste Leads in 1-2 Wochen. SEO: 3-6 Monate für nachhaltige Rankings.',
        },
        {
          question: 'Muss ich einen langen Vertrag unterschreiben?',
          answer: 'Nein. Der Launch Sprint ist einmalig, Retainer sind monatlich kündbar.',
        },
        {
          question: 'Was passiert nach dem Audit?',
          answer: 'Du bekommst die Scorecard per E-Mail. Dann kannst du einen Call buchen — oder nicht.',
        },
        {
          question: 'Kann ich nur einen Teil des Systems buchen?',
          answer: 'Ja. Wir passen das Angebot an deine Prioritäten und dein Budget an.',
        },
        {
          question: 'Arbeitet ihr mit Konkurrenten in derselben Region?',
          answer: 'Wir limitieren die Anzahl Kunden pro Branche/Region, um Interessenkonflikte zu vermeiden.',
        },
        {
          question: 'Brauche ich technisches Wissen?',
          answer: 'Nein. Wir kümmern uns um alles Technische — du konzentrierst dich auf dein Kerngeschäft.',
        },
      ],
      auditItems: [
        {
          question: 'Ist der Call verpflichtend?',
          answer: 'Nein. Das Audit bekommst du so oder so.',
        },
        {
          question: 'Braucht ihr Zugriff auf mein Konto?',
          answer: 'Nein fürs Audit. Für Umsetzung ggf. später.',
        },
        {
          question: 'Wie lange dauert das Formular?',
          answer: 'Ca. 2 Minuten.',
        },
      ],
    },
    
    // Case Studies
    caseStudies: {
      sectionTitle: 'Case Studies',
      noData: 'Beispiele und Details im Call.',
    },
    
    // Footer
    footer: {
      location: 'Schweiz',
      contact: 'Kontakt',
      email: 'info@itsfeierabend.ch',
      links: {
        imprint: 'Impressum',
        privacy: 'Datenschutz',
        faq: 'FAQ',
      },
      copyright: '© {year} itsFeierabend.ch. Alle Rechte vorbehalten.',
    },
    
    // Industries (for form dropdown)
    industries: [
      'Reinigung',
      'Umzug',
      'Sanitär',
      'Elektro',
      'Gartenbau',
      'Malerei',
      'Schreinerei',
      'Schlosserei',
      'Gebäudetechnik',
      'Andere',
    ],
    
    // Legal
    legal: {
      imprint: {
        title: 'Impressum',
        placeholder: '[TODO: Firmenname, Adresse, UID, Vertretungsberechtigte Person, Kontakt hier einfügen]',
        note: 'Bitte diese Angaben vor der Veröffentlichung ersetzen.',
      },
      privacy: {
        title: 'Datenschutzerklärung',
        placeholder: '[TODO: Datenschutz Text gemäss nDSG, Cookies, Analytics, Kontakt hier einfügen]',
        note: 'Bitte diese Angaben vor der Veröffentlichung ersetzen.',
      },
    },
    
    // Callback Request
    callback: {
      title: 'Rückruf anfragen',
      description: 'Wenn du willst, rufen wir dich zurück. Du bestätigst kurz AI + optional Aufzeichnung.',
      form: {
        phone: 'Telefonnummer',
        phonePlaceholder: '+41 ...',
        preferredTime: 'Bevorzugte Zeit (optional)',
        preferredTimePlaceholder: 'z.B. Nachmittags',
        consentAiCall: 'Ich bin einverstanden, von einem KI-Assistenten angerufen zu werden.',
        consentRecording: 'Ich bin einverstanden, dass das Gespräch aufgezeichnet wird (optional).',
        submit: 'Rückruf anfragen',
      },
      microcopy: 'Kein Zeitversprechen. Wir melden uns so schnell wie möglich.',
      success: 'Rückruf angefordert! Wir melden uns bald.',
      error: 'Fehler beim Anfordern. Bitte versuche es später erneut.',
      disabled: 'Rückruf-Funktion ist derzeit nicht verfügbar.',
    },
  },
  
  en: {
    // Meta
    siteName: 'itsFeierabend.ch',
    siteDescription: 'AI-powered digital marketing agency. SEO, SEA, social media, brand management and AI implementation for your growth.',
    
    // Navigation
    nav: {
      services: 'Services',
      system: 'System',
      audit: 'Free Audit',
      pricing: 'Pricing',
      faq: 'FAQ',
    },
    
    // CTAs
    cta: {
      freeAudit: 'Free Audit',
      freeCall: 'Free Call',
      getAudit: 'Get a free audit',
      bookCall: 'Book a free call',
      startAudit: 'Start free audit',
      requestCall: 'Request a call',
      learnMore: 'Learn more',
    },
    
    // Hero
    hero: {
      title: 'More booked jobs for your local service — powered by an AI-first growth system.',
      subtitle: 'We combine Google Ads, Local SEO, conversion optimization and automations so clicks turn into customers.',
      trustLine: 'For local services in Switzerland',
    },
    
    // Pillars
    pillars: {
      sectionTitle: 'The System in 3 Pillars',
      traffic: {
        title: 'Traffic Engine',
        description: 'Google Ads + Local SEO (high-intent, no vanity metrics).',
      },
      conversion: {
        title: 'Conversion Engine',
        description: 'Landing pages, tracking, call tracking, offer & copy.',
      },
      aiOps: {
        title: 'AI Ops',
        description: 'Lead routing, follow-ups, CRM discipline, reviews, reporting.',
      },
    },
    
    // Automations
    automations: {
      sectionTitle: 'Automations Customers Love',
      leadConcierge: {
        title: 'Lead Concierge Agent',
        description: 'Responds fast, asks qualifiers, books appointments.',
      },
      followUp: {
        title: 'Follow-up Engine',
        description: 'SMS/email/WhatsApp sequences until the appointment — without being annoying.',
      },
      reviewHunter: {
        title: 'Review Hunter',
        description: 'Automatic review requests after completion + routing (Google / ProvenExpert).',
      },
      reporting: {
        title: 'Reporting Agent',
        description: 'Weekly CEO report (leads, calls, CPL, ROAS, to-do).',
      },
    },
    
    // Pricing
    pricing: {
      sectionTitle: 'Packages & Pricing',
      disclaimer: 'Ad spend is extra (paid directly by client). Optional bonus: e.g., per booked job or per qualified lead.',
      templateNote: 'Prices/scope are a template. We adapt based on industry, region and budget.',
      perMonth: '/ month',
      oneTime: 'one-time',
      launch: {
        name: 'Launch Sprint',
        duration: '14 days',
        forWhom: 'Start/restart',
        price: 'CHF 1,990',
        features: [
          'Tracking fix',
          'Audit report',
          '1 landing page',
          'CRM pipeline',
          'Lead response setup',
        ],
      },
      growth: {
        name: 'Growth Retainer',
        duration: '90 days',
        forWhom: 'Consistent lead flow',
        price: 'from CHF 3,900',
        features: [
          'Ads + Local SEO',
          'CRO (Conversion Rate Optimization)',
          'Automations',
          'Weekly optimization',
          'Dashboard',
        ],
      },
      leader: {
        name: 'Scale Retainer',
        duration: 'Ongoing',
        forWhom: 'Multi-location scaling',
        price: 'from CHF 6,900',
        priceNote: '+ bonus',
        features: [
          'Everything from Growth',
          'More creatives',
          'More landing pages',
          'Review engine',
          'Advanced agents',
        ],
      },
    },
    
    // Audit Page
    audit: {
      heroTitle: 'Free audit for local service businesses in Switzerland',
      heroSubtitle: 'Scorecard covering website, Google Business, tracking, and competitors. Optional free call afterwards.',
      trustLine: 'No spam. No obligation.',
      form: {
        industry: 'Industry',
        industryPlaceholder: 'Select your industry',
        industryOther: 'Other',
        location: 'Location / Service Area',
        locationPlaceholder: 'e.g. Zurich area',
        website: 'Website',
        websitePlaceholder: 'https://your-website.ch',
        budget: 'Monthly Budget (Marketing)',
        budgetPlaceholder: 'e.g. CHF 2000',
        budgetHelper: 'Rough estimate is fine.',
        capacity: 'Capacity (new jobs/week)',
        capacityPlaceholder: 'e.g. 5-10',
        capacityHelper: 'So we don\'t deliver leads you can\'t handle.',
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'name@company.ch',
        phone: 'Phone (optional)',
        phonePlaceholder: '+41 ...',
        submit: 'Request audit',
      },
      deliverables: {
        title: 'What You Get',
        items: [
          'Scorecard with biggest conversion blockers (website/LP)',
          'Tracking check (GA4/events/call tracking plan)',
          'Google Business quick wins (Local SEO basics)',
          'Competitor snapshot (who wins & why)',
          'Next steps: 3 priorities for 30 days',
        ],
      },
      whatWeCheck: {
        title: 'What We Check',
        traffic: 'Traffic: Ads, SEO, Google Business',
        conversion: 'Conversion: Landing page, offer, copy',
        ops: 'Ops: Tracking, CRM, response time',
      },
      steps: {
        title: 'How It Works',
        step1: {
          title: 'Fill out the form',
          description: '2 minutes, no hidden fields.',
        },
        step2: {
          title: 'We analyze',
          description: 'Your audit is created within 48h.',
        },
        step3: {
          title: 'You decide',
          description: 'Scorecard arrives by email. Call is optional.',
        },
      },
    },
    
    // Call Page
    call: {
      heroTitle: 'Book a Free Call',
      heroSubtitle: '20 minutes: goal, offer, capacity, budget, no-go\'s, next 90 days.',
      trustLine: 'We\'ll get back to you with time slot suggestions.',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'name@company.ch',
        phone: 'Phone (optional)',
        phonePlaceholder: '+41 ...',
        company: 'Company / Industry (optional)',
        companyPlaceholder: 'e.g. Cleaning company',
        message: 'Message (optional)',
        messagePlaceholder: 'What would you like to discuss?',
        preferredTimes: 'Preferred times (optional)',
        preferredTimesPlaceholder: 'e.g. Mornings, Tue-Thu',
        submit: 'Request a call',
      },
    },
    
    // System Page
    system: {
      heroTitle: 'The System: Traffic → Conversion → AI Ops',
      heroSubtitle: 'A full-stack growth system built for local service providers.',
      traffic: {
        title: 'Traffic Engine',
        description: 'We bring qualified visitors to your site — no vanity metrics.',
        outputs: [
          'Google Ads campaigns (high-intent keywords)',
          'Local SEO & Google Business optimization',
          'Location-specific landing pages',
        ],
      },
      conversion: {
        title: 'Conversion Engine',
        description: 'Clicks become inquiries. Inquiries become booked jobs.',
        outputs: [
          'Conversion-optimized landing pages',
          'Call tracking & lead attribution',
          'A/B testing & offer optimization',
        ],
      },
      aiOps: {
        title: 'AI Ops',
        description: 'Automations that work in the background — 24/7.',
        outputs: [
          'Lead concierge (automatic response & qualification)',
          'Follow-up sequences (SMS/WhatsApp/email)',
          'Review requests & reporting',
        ],
      },
    },
    
    // FAQ
    faq: {
      sectionTitle: 'Frequently Asked Questions',
      items: [
        {
          question: 'Is the audit really free?',
          answer: 'Yes. You get a scorecard. Then you decide if you want a call.',
        },
        {
          question: 'Who is this system for?',
          answer: 'Local services in Switzerland (cleaning, trades, moving, etc.).',
        },
        {
          question: 'How fast does it work?',
          answer: 'Ads often faster. SEO takes more time. We clarify priorities in the call.',
        },
        {
          question: 'Is a subscription required?',
          answer: 'No. There are sprints and retainers.',
        },
        {
          question: 'What about privacy?',
          answer: 'Details in the privacy policy (Switzerland).',
        },
        {
          question: 'Is ad spend included?',
          answer: 'No. You pay ad spend directly.',
        },
        {
          question: 'Which industries do you serve?',
          answer: 'Local service providers: cleaning, trades, moving, plumbing, landscaping, and more.',
        },
        {
          question: 'How long until I see results?',
          answer: 'Google Ads: often first leads in 1-2 weeks. SEO: 3-6 months for sustainable rankings.',
        },
        {
          question: 'Do I have to sign a long contract?',
          answer: 'No. Launch Sprint is one-time, retainers are monthly cancellable.',
        },
        {
          question: 'What happens after the audit?',
          answer: 'You receive the scorecard by email. Then you can book a call — or not.',
        },
        {
          question: 'Can I book only part of the system?',
          answer: 'Yes. We adapt the offer to your priorities and budget.',
        },
        {
          question: 'Do you work with competitors in the same region?',
          answer: 'We limit the number of clients per industry/region to avoid conflicts of interest.',
        },
        {
          question: 'Do I need technical knowledge?',
          answer: 'No. We handle all the technical stuff — you focus on your core business.',
        },
      ],
      auditItems: [
        {
          question: 'Is the call mandatory?',
          answer: 'No. You get the audit either way.',
        },
        {
          question: 'Do you need access to my account?',
          answer: 'No for the audit. Possibly later for implementation.',
        },
        {
          question: 'How long does the form take?',
          answer: 'About 2 minutes.',
        },
      ],
    },
    
    // Case Studies
    caseStudies: {
      sectionTitle: 'Case Studies',
      noData: 'Examples and details in the call.',
    },
    
    // Footer
    footer: {
      location: 'Switzerland',
      contact: 'Contact',
      email: 'info@itsfeierabend.ch',
      links: {
        imprint: 'Imprint',
        privacy: 'Privacy',
        faq: 'FAQ',
      },
      copyright: '© {year} itsFeierabend.ch. All rights reserved.',
    },
    
    // Industries (for form dropdown)
    industries: [
      'Cleaning',
      'Moving',
      'Plumbing',
      'Electrical',
      'Landscaping',
      'Painting',
      'Carpentry',
      'Locksmith',
      'Building Services',
      'Other',
    ],
    
    // Legal
    legal: {
      imprint: {
        title: 'Imprint',
        placeholder: '[TODO: Company name, address, UID, authorized representative, contact to be added here]',
        note: 'Please replace this information before publishing.',
      },
      privacy: {
        title: 'Privacy Policy',
        placeholder: '[TODO: Privacy policy text according to nFADP, cookies, analytics, contact to be added here]',
        note: 'Please replace this information before publishing.',
      },
    },
    
    // Callback Request
    callback: {
      title: 'Request a Callback',
      description: 'If you\'d like, we can call you back. Just confirm AI call + optional recording consent.',
      form: {
        phone: 'Phone Number',
        phonePlaceholder: '+41 ...',
        preferredTime: 'Preferred Time (optional)',
        preferredTimePlaceholder: 'e.g. Afternoons',
        consentAiCall: 'I agree to be called by an AI assistant.',
        consentRecording: 'I agree to the call being recorded (optional).',
        submit: 'Request Callback',
      },
      microcopy: 'No time guarantee. We\'ll get back to you as soon as possible.',
      success: 'Callback requested! We\'ll be in touch soon.',
      error: 'Error requesting callback. Please try again later.',
      disabled: 'Callback feature is currently not available.',
    },
  },
} as const;

export type Translations = typeof translations.de;
