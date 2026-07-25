import { useLanguage } from '@/i18n/LanguageContext';
import { SEOLanding } from '@/components/SEOLanding';

export default function SeoAnalysePage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish
    ? {
        metaTitle: 'SEO Analysis Switzerland — improve your Google ranking',
        metaDescription:
          'Free SEO analysis for Swiss businesses. See what holds back your Google visibility — technical, content, backlinks, local. Prioritized fixes.',
        serviceSchemaName: 'SEO Analysis',
        serviceSchemaDescription:
          'Structured SEO analysis covering technical SEO, on-page signals, keyword-to-page fit, local SEO and backlink profile — with prioritized recommendations.',
        eyebrow: 'SEO Landing · SEO Analysis',
        headline: (
          <>
            Improve your <em className="font-editorial italic">Google ranking</em> — start with a real diagnosis.
          </>
        ),
        lede:
          'Most SEO tools list problems. We measure what matters, weight it by impact, and hand you the three fixes that move the needle first — for the Swiss market.',
        primaryCta: { label: 'Start free SEO audit', href: '/en/audit', location: 'seo-analysis-hero' },
        secondaryCta: { label: 'See packages', href: '/en/pricing', location: 'seo-analysis-hero' },
        annotation: 'Technical · on-page · local · AI search · Swiss context',
        problemLabel: 'Why rankings stall',
        problemHeadline: 'Ranking isn\'t random — it\'s a stack of measurable failures.',
        problemPoints: [
          'Slow Core Web Vitals push you below faster competitors regardless of content quality.',
          'Titles, descriptions and headings target the wrong intent — traffic that never converts.',
          'Missing or wrong structured data means Google can\'t categorize you for rich results.',
          'Local signals (Google Business, NAP consistency, Swiss market signals) are incomplete.',
          'Backlink profile is thin, spammy, or invisible — no authority to rank on hard terms.',
        ],
        analysisLabel: 'What the analysis covers',
        analysisHeadline: 'Five SEO layers. Measured, not guessed.',
        analysisItems: [
          { num: '01', title: 'Technical SEO', body: 'Crawlability, index status, Core Web Vitals, mobile fitness, HTTPS, canonicals, sitemap and robots.' },
          { num: '02', title: 'On-page signals', body: 'Titles, descriptions, H1/H2 structure, keyword-to-page fit, internal linking, structured data (JSON-LD).' },
          { num: '03', title: 'Content & intent', body: 'Query-to-page mapping, content depth vs. SERP competitors, thin-content risks, cannibalization checks.' },
          { num: '04', title: 'Local & Swiss market', body: 'Google Business Profile completeness, NAP consistency, regional signals, hreflang for DE/EN/FR/IT.' },
          { num: '05', title: 'Authority & backlinks', body: 'Backlink volume/quality via Semrush enrichment, referring domains, anchor-text distribution.' },
        ],
        processLabel: 'How we work',
        processSteps: [
          { num: '01', title: 'Enter your domain', body: 'The free audit gives you the first cut — technical + on-page + trust signals within 2-3 minutes.' },
          { num: '02', title: 'Enrichment with Semrush', body: 'For the deeper cut we add backlink profile, competitor overlap and keyword-position data — clearly source-labeled.' },
          { num: '03', title: 'Priority roadmap', body: 'You get a ranked list: what to fix first, what can wait, what to leave alone. Impact-over-effort, not a wishlist.' },
          { num: '04', title: 'Implementation (optional)', body: 'If you want us to ship the fixes, Launch Sprint covers the roadmap. Growth Retainer keeps it moving weekly.' },
        ],
        faqLabel: 'Common questions',
        faqItems: [
          { question: 'How is this different from Semrush\'s own audit?', answer: 'Semrush lists issues; we translate them into a prioritized action list weighted for the Swiss SME context, with a fixed scoring model you can compare over time.' },
          { question: 'Do you guarantee rankings?', answer: 'No serious SEO does. We guarantee measurable improvements to the signals that correlate with ranking — technical health, on-page fit, local completeness.' },
          { question: 'What about AI search / ChatGPT visibility?', answer: 'Covered separately in our AI Visibility analysis — the mechanics differ from classic SEO, though they share underlying entity signals.' },
          { question: 'How long until we see impact?', answer: 'Technical fixes and metadata often show in 4-8 weeks. Authority-driven ranking changes take 3-6 months. We report monthly with real numbers.' },
        ],
        finalHeadline: (
          <>
            Real ranking gains start with an <em className="font-editorial italic">honest baseline.</em>
          </>
        ),
        finalBody:
          'Run the free audit first. If it shows enough room to move, we\'ll show you the packages that ship the roadmap.',
      }
    : {
        metaTitle: 'SEO-Analyse Schweiz — Google-Ranking verbessern',
        metaDescription:
          'Kostenlose SEO-Analyse für Schweizer Unternehmen. Sehen Sie, was Ihre Google-Sichtbarkeit bremst — Technik, Content, Backlinks, Local. Priorisierte Fixes.',
        serviceSchemaName: 'SEO-Analyse',
        serviceSchemaDescription:
          'Strukturierte SEO-Analyse zu technischem SEO, On-Page-Signalen, Keyword-zu-Seite-Passung, Local SEO und Backlink-Profil — mit priorisierten Empfehlungen.',
        eyebrow: 'SEO Landing · SEO-Analyse',
        headline: (
          <>
            Verbessern Sie Ihr <em className="font-editorial italic">Google-Ranking</em> — mit einer ehrlichen Diagnose.
          </>
        ),
        lede:
          'Die meisten SEO-Tools listen Probleme auf. Wir messen, was zählt, gewichten nach Wirkung und geben Ihnen die drei Fixes, die zuerst tragen — für den Schweizer Markt.',
        primaryCta: { label: 'Gratis-SEO-Audit starten', href: '/audit', location: 'seo-analysis-hero' },
        secondaryCta: { label: 'Pakete ansehen', href: '/pakete', location: 'seo-analysis-hero' },
        annotation: 'Technik · On-Page · Local · AI-Search · Schweizer Kontext',
        problemLabel: 'Warum Rankings stagnieren',
        problemHeadline: 'Ranking ist kein Zufall — es ist ein Stapel messbarer Fehler.',
        problemPoints: [
          'Langsame Core Web Vitals drücken Sie unter schnellere Wettbewerber — unabhängig von Content-Qualität.',
          'Titles, Descriptions und Headings zielen auf den falschen Intent — Traffic, der nie konvertiert.',
          'Fehlende oder falsche strukturierte Daten heisst: Google kann Sie nicht in Rich Results einordnen.',
          'Lokale Signale (Google Business, NAP-Konsistenz, Schweiz-Signale) sind unvollständig.',
          'Backlink-Profil ist dünn, spammy oder unsichtbar — keine Autorität für harte Terms.',
        ],
        analysisLabel: 'Was die Analyse abdeckt',
        analysisHeadline: 'Fünf SEO-Ebenen. Gemessen, nicht geraten.',
        analysisItems: [
          { num: '01', title: 'Technisches SEO', body: 'Crawlbarkeit, Index-Status, Core Web Vitals, Mobile-Fitness, HTTPS, Canonicals, Sitemap und Robots.' },
          { num: '02', title: 'On-Page-Signale', body: 'Titles, Descriptions, H1/H2-Struktur, Keyword-zu-Seite-Passung, interne Verlinkung, strukturierte Daten (JSON-LD).' },
          { num: '03', title: 'Content & Intent', body: 'Query-zu-Seite-Mapping, Content-Tiefe vs. SERP-Wettbewerber, Thin-Content-Risiken, Kannibalisierungs-Checks.' },
          { num: '04', title: 'Local & Schweizer Markt', body: 'Google-Business-Profil-Vollständigkeit, NAP-Konsistenz, regionale Signale, hreflang für DE/EN/FR/IT.' },
          { num: '05', title: 'Autorität & Backlinks', body: 'Backlink-Volumen/-Qualität via Semrush-Anreicherung, verweisende Domains, Anchor-Text-Verteilung.' },
        ],
        processLabel: 'Wie wir arbeiten',
        processSteps: [
          { num: '01', title: 'Domain eingeben', body: 'Der kostenlose Audit liefert den ersten Schnitt — Technik + On-Page + Vertrauenssignale in 2-3 Minuten.' },
          { num: '02', title: 'Anreicherung mit Semrush', body: 'Für den tieferen Schnitt ergänzen wir Backlink-Profil, Wettbewerber-Overlap und Keyword-Positionen — klar quellen-gekennzeichnet.' },
          { num: '03', title: 'Priorisierter Fahrplan', body: 'Sie erhalten eine gerankte Liste: Was zuerst, was später, was gar nicht. Wirkung pro Aufwand — keine Wunschliste.' },
          { num: '04', title: 'Umsetzung (optional)', body: 'Wenn wir die Fixes umsetzen sollen, deckt Launch Sprint den Fahrplan ab. Growth Retainer hält ihn wöchentlich in Bewegung.' },
        ],
        faqLabel: 'Häufige Fragen',
        faqItems: [
          { question: 'Was unterscheidet Sie vom Semrush-Audit selbst?', answer: 'Semrush listet Issues; wir übersetzen sie in eine priorisierte Action-Liste, gewichtet für den Schweizer KMU-Kontext, mit einem fixen Scoring-Modell, das Sie über die Zeit vergleichen können.' },
          { question: 'Garantieren Sie Rankings?', answer: 'Kein ernstzunehmender SEO tut das. Wir garantieren messbare Verbesserungen der Signale, die mit Rankings korrelieren — technische Gesundheit, On-Page-Passung, lokale Vollständigkeit.' },
          { question: 'Was ist mit AI-Search / ChatGPT-Sichtbarkeit?', answer: 'Wird separat in unserer AI-Visibility-Analyse behandelt — die Mechanik unterscheidet sich von klassischem SEO, teilt aber Entity-Signale.' },
          { question: 'Wie lange bis zur Wirkung?', answer: 'Technische Fixes und Metadaten zeigen oft in 4-8 Wochen. Autoritäts-getriebene Rankings brauchen 3-6 Monate. Wir reporten monatlich mit echten Zahlen.' },
        ],
        finalHeadline: (
          <>
            Echte Ranking-Gewinne beginnen mit einer <em className="font-editorial italic">ehrlichen Baseline.</em>
          </>
        ),
        finalBody:
          'Fahren Sie zuerst den kostenlosen Audit. Wenn er genug Bewegungsraum zeigt, zeigen wir Ihnen die Pakete, die den Fahrplan umsetzen.',
      };

  return <SEOLanding {...content} />;
}
