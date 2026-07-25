import { useLanguage } from '@/i18n/LanguageContext';
import { SEOLanding } from '@/components/SEOLanding';

export default function AIVisibilityPage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish
    ? {
        metaTitle: 'AI Search Visibility — get cited by ChatGPT and answer engines',
        metaDescription:
          'How discoverable is your business in ChatGPT, Perplexity and Google\'s AI Overviews? Entity-first optimization for answer engines.',
        serviceSchemaName: 'AI Search Visibility',
        serviceSchemaDescription:
          'Entity-first optimization for large-language-model answer engines — clear entity definition, citable statements, structured facts and topical authority.',
        eyebrow: 'AI Search · Visibility',
        headline: (
          <>
            Get cited when your customers <em className="font-editorial italic">ask an AI.</em>
          </>
        ),
        lede:
          'Ranking in Google is only half the game. When someone asks ChatGPT, Perplexity or Google\'s AI Overview about your category, are you named — or invisible?',
        primaryCta: { label: 'Get the audit', href: '/en/audit', location: 'ai-visibility-hero' },
        secondaryCta: { label: 'Talk it through', href: '/en/free-call', location: 'ai-visibility-hero' },
        annotation: 'Entity signals · citable facts · answer-engine readiness',
        problemLabel: 'The new gap',
        problemHeadline: 'Answer engines don\'t rank pages — they cite entities.',
        problemPoints: [
          'Your About page reads like brochure copy — no clear entity definition an LLM can lift.',
          'Facts are trapped in images, PDFs or PPT decks that model crawlers can\'t parse.',
          'Contradictory information across LinkedIn, Google Business, imprint and website confuses entity resolution.',
          'No structured data (Organization, ProfessionalService, FAQPage) — the machine-readable layer is missing.',
          'Reviews and mentions live on platforms LLMs weight highly, but you don\'t know which ones matter.',
        ],
        analysisLabel: 'What we analyze',
        analysisHeadline: 'Answer-engine readiness — measured across four surfaces.',
        analysisItems: [
          { num: '01', title: 'Entity definition', body: 'How clearly your site defines who you are, what you do, for whom, where. Extracted the way an LLM extracts it.' },
          { num: '02', title: 'Structured facts', body: 'Presence and correctness of Organization, ProfessionalService, FAQPage, BreadcrumbList JSON-LD. Consistency across platforms.' },
          { num: '03', title: 'Citable statements', body: 'Whether your key claims are phrased in a way LLMs can lift as citations — with source, date, specificity.' },
          { num: '04', title: 'Topical authority', body: 'Depth of coverage on your topic across your own site plus third-party mentions (reviews, directories, partnerships).' },
        ],
        processLabel: 'How we work',
        processSteps: [
          { num: '01', title: 'Baseline scan', body: 'The free audit already covers entity and structured-data signals. We show you the current state before you spend anything.' },
          { num: '02', title: 'Deep AI visibility check', body: 'For the deeper cut we test real prompts across ChatGPT, Perplexity and Google AI Overview to see when you\'re named and when you aren\'t.' },
          { num: '03', title: 'Entity rewrite', body: 'Your About, service pages, FAQ and structured data get rewritten around clear, citable entity signals.' },
          { num: '04', title: 'Measure over time', body: 'We re-run the prompt tests monthly. You see whether your name appears more often, in which contexts, next to which competitors.' },
        ],
        faqLabel: 'Common questions',
        faqItems: [
          { question: 'Can you guarantee I\'ll be cited by ChatGPT?', answer: 'No. Model training and retrieval are opaque. We can measurably improve every signal that correlates with citation — and track whether it moves the outcome.' },
          { question: 'Is this different from SEO?', answer: 'It overlaps (entity signals, structured data, authority) but the target audience is a language model, not a search index. Prompt-based measurement replaces keyword ranking.' },
          { question: 'How new is this?', answer: 'Answer engines went mainstream in 2024. There\'s no established playbook — we\'re building measurement and iterating on what moves the needle for Swiss SMEs.' },
          { question: 'Do you also help with classic SEO?', answer: 'Yes. Most work stacks both — classic SEO for Google, entity signals for AI. See our SEO analysis for the traditional side.' },
        ],
        finalHeadline: (
          <>
            The <em className="font-editorial italic">next search interface</em> is a conversation. Be findable there.
          </>
        ),
        finalBody:
          'Start with the free audit — you\'ll see the entity and structured-data signals immediately. If there\'s enough room to move, we go deeper.',
      }
    : {
        metaTitle: 'AI-Sichtbarkeit — von ChatGPT und Answer Engines zitiert werden',
        metaDescription:
          'Wie auffindbar ist Ihr Unternehmen in ChatGPT, Perplexity und Googles AI Overviews? Entity-first-Optimierung für Answer Engines.',
        serviceSchemaName: 'AI-Sichtbarkeit',
        serviceSchemaDescription:
          'Entity-first-Optimierung für LLM-Answer-Engines — klare Entity-Definition, zitierfähige Aussagen, strukturierte Fakten und thematische Autorität.',
        eyebrow: 'AI Search · Sichtbarkeit',
        headline: (
          <>
            Zitiert werden, wenn Kunden <em className="font-editorial italic">eine KI fragen.</em>
          </>
        ),
        lede:
          'In Google zu ranken ist nur die halbe Miete. Wenn jemand ChatGPT, Perplexity oder Googles AI Overview zu Ihrer Kategorie fragt — werden Sie genannt oder sind Sie unsichtbar?',
        primaryCta: { label: 'Audit starten', href: '/audit', location: 'ai-visibility-hero' },
        secondaryCta: { label: 'Gespräch buchen', href: '/gratis-call', location: 'ai-visibility-hero' },
        annotation: 'Entity-Signale · zitierfähige Fakten · Answer-Engine-Reife',
        problemLabel: 'Die neue Lücke',
        problemHeadline: 'Answer Engines ranken keine Seiten — sie zitieren Entities.',
        problemPoints: [
          'Ihre About-Seite liest sich wie Broschüren-Copy — keine klare Entity-Definition, die ein LLM übernehmen kann.',
          'Fakten stecken in Bildern, PDFs oder PPT-Decks, die Modell-Crawler nicht parsen können.',
          'Widersprüchliche Angaben über LinkedIn, Google Business, Impressum und Website verwirren die Entity-Resolution.',
          'Keine strukturierten Daten (Organization, ProfessionalService, FAQPage) — die maschinenlesbare Schicht fehlt.',
          'Reviews und Erwähnungen leben auf Plattformen, die LLMs stark gewichten — Sie wissen aber nicht, welche zählen.',
        ],
        analysisLabel: 'Was wir analysieren',
        analysisHeadline: 'Answer-Engine-Reife — gemessen auf vier Flächen.',
        analysisItems: [
          { num: '01', title: 'Entity-Definition', body: 'Wie klar Ihre Seite definiert, wer Sie sind, was Sie tun, für wen, wo. Extrahiert, wie ein LLM extrahiert.' },
          { num: '02', title: 'Strukturierte Fakten', body: 'Vorhandensein und Korrektheit von Organization, ProfessionalService, FAQPage, BreadcrumbList JSON-LD. Konsistenz plattformübergreifend.' },
          { num: '03', title: 'Zitierfähige Aussagen', body: 'Ob Ihre Kernaussagen so formuliert sind, dass LLMs sie als Zitate übernehmen können — mit Quelle, Datum, Spezifität.' },
          { num: '04', title: 'Thematische Autorität', body: 'Abdeckungstiefe zu Ihrem Thema auf der eigenen Seite plus Drittparteien-Erwähnungen (Reviews, Verzeichnisse, Partnerschaften).' },
        ],
        processLabel: 'Wie wir arbeiten',
        processSteps: [
          { num: '01', title: 'Baseline-Scan', body: 'Der kostenlose Audit deckt Entity- und Structured-Data-Signale bereits ab. Sie sehen den Ist-Zustand, bevor Sie etwas ausgeben.' },
          { num: '02', title: 'Vertiefte AI-Visibility-Prüfung', body: 'Für den tieferen Schnitt testen wir echte Prompts in ChatGPT, Perplexity und Google AI Overview — wann Sie genannt werden, wann nicht.' },
          { num: '03', title: 'Entity-Rewrite', body: 'Ihre About-, Leistungs- und FAQ-Seiten sowie strukturierten Daten werden auf klare, zitierfähige Entity-Signale umgeschrieben.' },
          { num: '04', title: 'Messen über Zeit', body: 'Wir wiederholen die Prompt-Tests monatlich. Sie sehen, ob Ihr Name häufiger erscheint, in welchen Kontexten, neben welchen Wettbewerbern.' },
        ],
        faqLabel: 'Häufige Fragen',
        faqItems: [
          { question: 'Garantieren Sie, dass ChatGPT mich zitiert?', answer: 'Nein. Modell-Training und Retrieval sind intransparent. Wir können messbar jedes Signal verbessern, das mit Zitation korreliert — und tracken, ob es das Ergebnis bewegt.' },
          { question: 'Unterscheidet sich das von SEO?', answer: 'Es überlappt (Entity-Signale, strukturierte Daten, Autorität), aber Zielpublikum ist ein Sprachmodell, kein Suchindex. Prompt-basierte Messung ersetzt Keyword-Ranking.' },
          { question: 'Wie neu ist das?', answer: 'Answer Engines gingen 2024 Mainstream. Es gibt kein etabliertes Playbook — wir bauen Messung auf und iterieren, was für Schweizer KMU wirklich zieht.' },
          { question: 'Helfen Sie auch bei klassischem SEO?', answer: 'Ja. Meiste Arbeit stapelt beides — klassisches SEO für Google, Entity-Signale für KI. Siehe SEO-Analyse für die traditionelle Seite.' },
        ],
        finalHeadline: (
          <>
            Die <em className="font-editorial italic">nächste Suchoberfläche</em> ist ein Gespräch. Seien Sie dort auffindbar.
          </>
        ),
        finalBody:
          'Beginnen Sie mit dem kostenlosen Audit — Sie sehen Entity- und Structured-Data-Signale sofort. Wenn Bewegungsraum da ist, gehen wir tiefer.',
      };

  return <SEOLanding {...content} />;
}
