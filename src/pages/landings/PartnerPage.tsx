import { useLanguage } from '@/i18n/LanguageContext';
import { SEOLanding } from '@/components/SEOLanding';

export default function PartnerPage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish
    ? {
        metaTitle: 'Partner Program — offer the audit to your clients',
        metaDescription:
          'For agencies, consultants and service networks: white-label or referral access to the itsFeierabend audit. Real diagnostics your clients can act on.',
        eyebrow: 'Partner · Referral',
        headline: (
          <>
            Give your clients a <em className="font-editorial italic">real diagnostic.</em> We handle the audit.
          </>
        ),
        lede:
          'You already have client relationships. We have a deterministic audit. Together, you extend your value without adding infrastructure — as a referral partner or under a white-label arrangement.',
        primaryCta: { label: 'Apply as partner', href: '/en/free-call', location: 'partner-hero' },
        secondaryCta: { label: 'See how the audit works', href: '/en/website-audit', location: 'partner-hero' },
        annotation: 'Referral · white-label · Swiss agencies, consultants, networks',
        problemLabel: 'Why a partnership makes sense',
        problemHeadline: 'You shouldn\'t need to build audit infrastructure to prove value.',
        problemPoints: [
          'Your clients ask for measurable diagnostics — you don\'t want to hand them a competitor\'s tool.',
          'Building your own scoring engine, LLM interpretation and enrichment stack is a distraction from your core work.',
          'Off-the-shelf SEO tools list issues — they don\'t translate them into prioritized action for the Swiss SME context.',
          'Losing clients to agencies that show them a scored roadmap first is a real risk.',
        ],
        analysisLabel: 'How the partnership works',
        analysisHeadline: 'Two clear paths depending on your setup.',
        analysisItems: [
          { num: '01', title: 'Referral partner', body: 'You send clients to a co-branded audit link. If a paid engagement follows, we share revenue transparently. No integration work.' },
          { num: '02', title: 'White-label', body: 'The audit runs under your brand. You keep the client relationship, we handle scoring, enrichment and report generation in the background.' },
          { num: '03', title: 'Fulfillment partner', body: 'You use our audit to identify opportunities, then fulfill implementation yourself. We supply the diagnostic layer.' },
          { num: '04', title: 'Network arrangement', body: 'Industry associations and service networks get bulk audit allowances plus custom reporting for their members.' },
        ],
        processLabel: 'Getting started',
        processSteps: [
          { num: '01', title: 'Intro call', body: 'A short conversation to understand your setup, client base and preferred model (referral, white-label, fulfillment).' },
          { num: '02', title: 'Pilot round', body: 'You run a handful of audits with real clients to validate fit before any commercial framework is set up.' },
          { num: '03', title: 'Framework agreement', body: 'Rev-share, white-label terms or fulfillment scope are documented cleanly. Swiss legal basis.' },
          { num: '04', title: 'Ongoing support', body: 'Direct access to our team for edge cases, custom reports and joint client sessions when it helps.' },
        ],
        faqLabel: 'Common questions',
        faqItems: [
          { question: 'What counts as a "partner"?', answer: 'Swiss agencies, freelance consultants, industry associations, IT service providers or platforms with SME client relationships.' },
          { question: 'Are there minimums?', answer: 'No monthly minimum for referrals. White-label and fulfillment models are custom — discussed in the intro call.' },
          { question: 'Can we resell your retainers?', answer: 'Yes, under negotiated terms. Most partners refer for the audit and let us close for retainers with clear rev-share.' },
          { question: 'What about client confidentiality?', answer: 'Audit data is scoped per client. Partners see aggregate portfolio reports; we never share one client\'s data with another partner.' },
        ],
        finalHeadline: (
          <>
            Extend your offer — <em className="font-editorial italic">without building it.</em>
          </>
        ),
        finalBody:
          'Book an intro call. We\'ll figure out in 20 minutes whether a referral, white-label or fulfillment setup makes sense.',
      }
    : {
        metaTitle: 'Partnerprogramm — den Audit für Ihre Kunden anbieten',
        metaDescription:
          'Für Agenturen, Berater und Service-Netzwerke: White-Label- oder Referral-Zugang zum itsFeierabend-Audit. Echte Diagnostik, auf die Ihre Kunden reagieren können.',
        eyebrow: 'Partner · Referral',
        headline: (
          <>
            Geben Sie Ihren Kunden eine <em className="font-editorial italic">echte Diagnose.</em> Wir liefern den Audit.
          </>
        ),
        lede:
          'Sie haben die Kundenbeziehungen. Wir haben den deterministischen Audit. Zusammen erweitern Sie Ihren Wert, ohne Infrastruktur zu bauen — als Referral-Partner oder unter White-Label-Arrangement.',
        primaryCta: { label: 'Als Partner bewerben', href: '/gratis-call', location: 'partner-hero' },
        secondaryCta: { label: 'So funktioniert der Audit', href: '/website-audit', location: 'partner-hero' },
        annotation: 'Referral · White-Label · Schweizer Agenturen, Berater, Netzwerke',
        problemLabel: 'Warum eine Partnerschaft Sinn ergibt',
        problemHeadline: 'Sie sollten keine Audit-Infrastruktur bauen müssen, um Wert zu beweisen.',
        problemPoints: [
          'Ihre Kunden fragen nach messbarer Diagnostik — Sie wollen ihnen nicht das Tool eines Wettbewerbers in die Hand drücken.',
          'Eigene Scoring-Engine, LLM-Interpretation und Enrichment-Stack zu bauen lenkt vom Kerngeschäft ab.',
          'Standard-SEO-Tools listen Issues — sie übersetzen sie nicht in priorisierte Aktion für den Schweizer KMU-Kontext.',
          'Kunden an Agenturen zu verlieren, die zuerst einen bewerteten Fahrplan zeigen, ist ein reales Risiko.',
        ],
        analysisLabel: 'Wie die Partnerschaft funktioniert',
        analysisHeadline: 'Zwei klare Pfade je nach Setup.',
        analysisItems: [
          { num: '01', title: 'Referral-Partner', body: 'Sie schicken Kunden auf einen co-branded Audit-Link. Bei bezahltem Anschluss-Engagement teilen wir Umsatz transparent. Keine Integrationsarbeit.' },
          { num: '02', title: 'White-Label', body: 'Der Audit läuft unter Ihrer Marke. Sie halten die Kundenbeziehung, wir übernehmen Scoring, Anreicherung und Report-Generierung im Hintergrund.' },
          { num: '03', title: 'Fulfillment-Partner', body: 'Sie nutzen unseren Audit, um Chancen zu identifizieren, und setzen selbst um. Wir liefern die Diagnostik-Ebene.' },
          { num: '04', title: 'Netzwerk-Arrangement', body: 'Branchenverbände und Service-Netzwerke bekommen Bulk-Audit-Kontingente plus Custom-Reporting für ihre Mitglieder.' },
        ],
        processLabel: 'Erste Schritte',
        processSteps: [
          { num: '01', title: 'Intro-Call', body: 'Ein kurzes Gespräch, um Ihr Setup, Ihre Kundenbasis und den bevorzugten Modus (Referral, White-Label, Fulfillment) zu verstehen.' },
          { num: '02', title: 'Pilot-Runde', body: 'Sie fahren eine Handvoll Audits mit echten Kunden, um den Fit zu validieren, bevor ein kommerzieller Rahmen aufgesetzt wird.' },
          { num: '03', title: 'Rahmenvertrag', body: 'Rev-Share, White-Label-Bedingungen oder Fulfillment-Scope werden sauber dokumentiert. Schweizer Rechtsbasis.' },
          { num: '04', title: 'Laufende Betreuung', body: 'Direkter Zugang zu unserem Team für Edge Cases, Custom Reports und gemeinsame Kunden-Sessions, wenn es hilft.' },
        ],
        faqLabel: 'Häufige Fragen',
        faqItems: [
          { question: 'Wer zählt als "Partner"?', answer: 'Schweizer Agenturen, freiberufliche Berater, Branchenverbände, IT-Dienstleister oder Plattformen mit KMU-Kundenbeziehungen.' },
          { question: 'Gibt es Mindestmengen?', answer: 'Kein Monats-Minimum für Referrals. White-Label- und Fulfillment-Modelle sind individuell — im Intro-Call besprochen.' },
          { question: 'Können wir Ihre Retainer weiterverkaufen?', answer: 'Ja, unter verhandelten Bedingungen. Die meisten Partner vermitteln für den Audit und lassen uns Retainer mit klarem Rev-Share abschliessen.' },
          { question: 'Was ist mit Kunden-Vertraulichkeit?', answer: 'Audit-Daten sind pro Kunde gescoped. Partner sehen aggregierte Portfolio-Reports; wir teilen niemals Daten eines Kunden mit einem anderen Partner.' },
        ],
        finalHeadline: (
          <>
            Erweitern Sie Ihr Angebot — <em className="font-editorial italic">ohne es zu bauen.</em>
          </>
        ),
        finalBody:
          'Buchen Sie einen Intro-Call. In 20 Minuten klären wir, ob ein Referral-, White-Label- oder Fulfillment-Setup passt.',
      };

  return <SEOLanding {...content} />;
}
