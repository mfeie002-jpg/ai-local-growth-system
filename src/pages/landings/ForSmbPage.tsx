import { useLanguage } from '@/i18n/LanguageContext';
import { SEOLanding } from '@/components/SEOLanding';

export default function ForSmbPage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish
    ? {
        metaTitle: 'For Swiss SMEs — a digital growth partner that gets your context',
        metaDescription:
          'Digital growth for Swiss SMEs — audit, roadmap, implementation. No lock-in on domains, ad accounts or data. You keep the keys.',
        eyebrow: 'For · Swiss SMEs',
        headline: (
          <>
            A digital partner that gets <em className="font-editorial italic">Swiss SME reality.</em>
          </>
        ),
        lede:
          'You don\'t need another agency deck. You need someone who measures what\'s broken, prioritizes what to fix, and ships without holding your ad accounts hostage.',
        primaryCta: { label: 'Start free audit', href: '/en/audit', location: 'for-smb-hero' },
        secondaryCta: { label: 'Book a call', href: '/en/free-call', location: 'for-smb-hero' },
        annotation: 'Audit first · your accounts · monthly cancellable',
        problemLabel: 'What Swiss SMEs actually deal with',
        problemHeadline: 'Marketing partners often make things worse.',
        problemPoints: [
          'Agencies gate the domain, ad accounts or CRM — leaving means starting from zero.',
          'Reports show vanity metrics (impressions, reach) instead of qualified leads.',
          'Fixes take weeks because nothing is prioritized by impact.',
          'AI is either absent or bolted on as a demo — no measurable effect on the funnel.',
          'Local Swiss context (nDSG, DE/FR/IT, cantonal search behavior) is treated as an afterthought.',
        ],
        analysisLabel: 'What you actually get',
        analysisHeadline: 'Measurable clarity, then execution.',
        analysisItems: [
          { num: '01', title: 'Free audit first', body: 'Before any commercial conversation, you get a real diagnostic with score, strengths, risks and prioritized fixes.' },
          { num: '02', title: 'Anti-lock-in', body: 'Domain, ad accounts, CRM, data — all stay in your name. We work on your infrastructure, you can leave any time.' },
          { num: '03', title: 'Impact-over-effort roadmap', body: 'Every recommendation is scored by expected impact and effort. No wishlist. No busywork.' },
          { num: '04', title: 'AI where it matters', body: 'AI in the audit (deterministic + LLM interpretation), AI in lead handling (routing, triage), AI in content (draft assist). Not AI as a demo.' },
        ],
        processLabel: 'Working with us',
        processSteps: [
          { num: '01', title: 'Free audit', body: 'You start here. Get the score and the top 3-5 fixes before any commercial conversation.' },
          { num: '02', title: '20-minute call', body: 'We walk through the audit together, translate technical findings into business impact, and answer whether we\'re the right fit.' },
          { num: '03', title: 'Launch Sprint', body: 'A one-off engagement (CHF 1\'990) that ships the top fixes — tracking, one landing, CRM hookup, lead-response setup.' },
          { num: '04', title: 'Growth or Scale Retainer', body: 'Monthly work on ads, SEO, CRO and automation — starting from CHF 3\'900/mo. Monthly cancellable.' },
        ],
        faqLabel: 'Common questions',
        faqItems: [
          { question: 'Do you only work with specific industries?', answer: 'We work best with Swiss SMEs in local services, professional services and B2B — where a well-run funnel changes revenue meaningfully.' },
          { question: 'What if we already have an agency?', answer: 'The audit still gives you a neutral second opinion. If you\'re happy with your current setup, you keep it — we\'ll say so honestly.' },
          { question: 'Are the packages fixed?', answer: 'Launch Sprint is fixed scope. Growth and Scale Retainers start from the listed price and adapt to your industry, region and volume.' },
          { question: 'What happens if we cancel?', answer: 'You keep everything — domain, ad accounts, CRM, dashboards, documentation. We hand over cleanly. That\'s the deal.' },
        ],
        finalHeadline: (
          <>
            Start where it counts — <em className="font-editorial italic">real diagnosis.</em>
          </>
        ),
        finalBody:
          'The free audit takes 2-3 minutes and shows exactly where your funnel leaks. Everything else follows from that.',
      }
    : {
        metaTitle: 'Für Schweizer KMU — ein Wachstumspartner, der Ihren Kontext versteht',
        metaDescription:
          'Digitales Wachstum für Schweizer KMU — Audit, Fahrplan, Umsetzung. Kein Lock-in auf Domains, Werbekonten oder Daten. Sie behalten die Schlüssel.',
        eyebrow: 'Für · Schweizer KMU',
        headline: (
          <>
            Ein digitaler Partner, der die <em className="font-editorial italic">Realität Schweizer KMU</em> versteht.
          </>
        ),
        lede:
          'Sie brauchen kein weiteres Agentur-Deck. Sie brauchen jemanden, der misst, was kaputt ist, priorisiert, was zu fixen ist, und umsetzt — ohne Ihre Werbekonten als Geisel zu nehmen.',
        primaryCta: { label: 'Gratis-Audit starten', href: '/audit', location: 'for-smb-hero' },
        secondaryCta: { label: 'Gespräch buchen', href: '/gratis-call', location: 'for-smb-hero' },
        annotation: 'Audit zuerst · Ihre Accounts · monatlich kündbar',
        problemLabel: 'Was Schweizer KMU wirklich erleben',
        problemHeadline: 'Marketing-Partner machen es oft schlimmer.',
        problemPoints: [
          'Agenturen kontrollieren Domain, Werbekonten oder CRM — Kündigung heisst bei Null anfangen.',
          'Reports zeigen Vanity-Metriken (Impressions, Reichweite) statt qualifizierter Leads.',
          'Fixes dauern Wochen, weil nichts nach Wirkung priorisiert wird.',
          'KI ist entweder abwesend oder als Demo aufgesetzt — ohne messbare Wirkung auf den Funnel.',
          'Schweizer Kontext (nDSG, DE/FR/IT, kantonales Suchverhalten) wird als Nachgedanke behandelt.',
        ],
        analysisLabel: 'Was Sie tatsächlich bekommen',
        analysisHeadline: 'Messbare Klarheit, dann Umsetzung.',
        analysisItems: [
          { num: '01', title: 'Zuerst der kostenlose Audit', body: 'Vor jedem Verkaufsgespräch bekommen Sie eine echte Diagnose mit Score, Stärken, Risiken und priorisierten Fixes.' },
          { num: '02', title: 'Anti-Lock-in', body: 'Domain, Werbekonten, CRM, Daten — alles bleibt auf Ihren Namen. Wir arbeiten auf Ihrer Infrastruktur, Sie können jederzeit gehen.' },
          { num: '03', title: 'Wirkung-pro-Aufwand-Fahrplan', body: 'Jede Empfehlung ist nach erwarteter Wirkung und Aufwand bewertet. Keine Wunschliste. Keine Busywork.' },
          { num: '04', title: 'KI dort, wo sie zählt', body: 'KI im Audit (deterministisch + LLM-Interpretation), KI in Lead-Bearbeitung (Routing, Triage), KI im Content (Draft-Assist). Nicht KI als Demo.' },
        ],
        processLabel: 'Zusammenarbeit',
        processSteps: [
          { num: '01', title: 'Kostenloser Audit', body: 'Hier starten Sie. Sie erhalten Score und Top-3-5-Fixes vor jedem Verkaufsgespräch.' },
          { num: '02', title: '20-Minuten-Call', body: 'Wir gehen den Audit gemeinsam durch, übersetzen technische Findings in Business-Impact und beantworten, ob wir passen.' },
          { num: '03', title: 'Launch Sprint', body: 'Einmaliges Engagement (CHF 1\'990), das die Top-Fixes umsetzt — Tracking, eine Landingpage, CRM-Anbindung, Lead-Response-Setup.' },
          { num: '04', title: 'Growth- oder Scale-Retainer', body: 'Monatliche Arbeit an Ads, SEO, CRO und Automation — ab CHF 3\'900/Mt. Monatlich kündbar.' },
        ],
        faqLabel: 'Häufige Fragen',
        faqItems: [
          { question: 'Arbeiten Sie nur mit bestimmten Branchen?', answer: 'Wir arbeiten am besten mit Schweizer KMU in Local Services, Professional Services und B2B — dort, wo ein sauber laufender Funnel den Umsatz spürbar verändert.' },
          { question: 'Was, wenn wir schon eine Agentur haben?', answer: 'Der Audit ist eine neutrale Zweitmeinung. Wenn Ihr Setup passt, behalten Sie es — wir sagen das ehrlich.' },
          { question: 'Sind die Pakete fix?', answer: 'Launch Sprint hat fixen Scope. Growth- und Scale-Retainer starten ab den genannten Preisen und passen sich Branche, Region und Volumen an.' },
          { question: 'Was passiert bei Kündigung?', answer: 'Sie behalten alles — Domain, Werbekonten, CRM, Dashboards, Dokumentation. Wir übergeben sauber. Das ist der Deal.' },
        ],
        finalHeadline: (
          <>
            Starten Sie dort, wo es zählt — <em className="font-editorial italic">echte Diagnose.</em>
          </>
        ),
        finalBody:
          'Der kostenlose Audit dauert 2-3 Minuten und zeigt genau, wo Ihr Funnel leckt. Alles Weitere folgt daraus.',
      };

  return <SEOLanding {...content} />;
}
