import { useLanguage } from '@/i18n/LanguageContext';
import { SEOLanding } from '@/components/SEOLanding';

export default function WebsiteAuditPage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish
    ? {
        metaTitle: 'Website Audit Switzerland — 25+ signals in minutes',
        metaDescription:
          'Free website audit for Swiss businesses. 25+ deterministic signals across tech, content, trust, conversion. No commitment.',
        serviceSchemaName: 'Website Audit',
        serviceSchemaDescription:
          'Deterministic website audit covering technical performance, content clarity, trust signals and conversion friction — 25+ measured signals.',
        eyebrow: 'SEO Landing · Website Audit',
        headline: (
          <>
            The <em className="font-editorial italic">website audit</em> that names your growth blockers.
          </>
        ),
        lede:
          'We measure 25+ signals across technical performance, content, trust and conversion — and hand you a prioritized fix list. Free. No login. No sales call unless you ask.',
        primaryCta: { label: 'Start free audit', href: '/en/audit', location: 'website-audit-hero' },
        secondaryCta: { label: 'How it works', href: '/en/ultimate-package', location: 'website-audit-hero' },
        annotation: '25+ signals · deterministic scoring · Swiss-built · no commitment',
        problemLabel: 'The gap',
        problemHeadline: 'Your site is losing leads in places you don\'t see.',
        problemPoints: [
          'Core Web Vitals silently reduce ad-spend efficiency and organic rankings.',
          'Meta tags, headings and structured data miss the intent Google actually indexes.',
          'Contact forms have friction — extra fields, missing labels, no confirmation.',
          'Trust signals (imprint, reviews, response time) are inconsistent or missing.',
          'The audit-to-action loop is broken: reports get read, nothing gets shipped.',
        ],
        analysisLabel: 'What we measure',
        analysisHeadline: 'Five dimensions. One deterministic score.',
        analysisItems: [
          { num: '01', title: 'Technical health', body: 'Core Web Vitals, HTTPS, canonicals, mobile viewport, indexability, sitemap and robots hygiene.' },
          { num: '02', title: 'Content & SEO', body: 'Title/description quality, heading structure, keyword-to-page fit, JSON-LD, internal linking.' },
          { num: '03', title: 'Trust & compliance', body: 'Imprint completeness, privacy policy, contact reachability, review presence, Swiss legal basics.' },
          { num: '04', title: 'Conversion mechanics', body: 'Form friction, CTA placement, form validation, response-time expectation, mobile tap targets.' },
          { num: '05', title: 'Automation readiness', body: 'Tracking coverage, lead routing, CRM integration hints, AI/automation surface area.' },
        ],
        processLabel: 'How it runs',
        processSteps: [
          { num: '01', title: 'Enter your URL', body: 'One field. No account, no credit card. We validate the URL is reachable and safe to scan.' },
          { num: '02', title: 'Deterministic scan', body: 'We collect 25+ signals via public data and PageSpeed APIs. Every measurement has a source label.' },
          { num: '03', title: 'Score & report', body: 'You see an overall score plus per-dimension breakdown, top strengths and biggest risks.' },
          { num: '04', title: 'Prioritized fixes', body: '3-5 recommended actions ranked by impact-over-effort — actionable this quarter, not a wishlist.' },
        ],
        faqLabel: 'Common questions',
        faqItems: [
          { question: 'Is it really free?', answer: 'Yes. The audit runs on our infrastructure, we absorb the cost. If you want implementation help afterwards, we quote separately.' },
          { question: 'What data do you use?', answer: 'Only publicly accessible signals from your URL, plus Google PageSpeed API and (for enrichment) Semrush data on your domain. No cookies, no login.' },
          { question: 'Can I get the report as PDF?', answer: 'Yes. Every audit result page has an export option. The report is yours to share internally.' },
          { question: 'Will you follow up with sales?', answer: 'Only if you explicitly ask. Every email includes an opt-out link and we honor it immediately.' },
        ],
        finalHeadline: (
          <>
            One URL. <em className="font-editorial italic">One score.</em> Zero commitment.
          </>
        ),
        finalBody:
          'The audit takes 2-3 minutes. You get a real score with real recommendations. What you do with it is your call.',
      }
    : {
        metaTitle: 'Website-Audit Schweiz — 25+ Signale in Minuten',
        metaDescription:
          'Kostenloser Website-Audit für Schweizer Unternehmen. 25+ deterministische Signale zu Technik, Content, Vertrauen, Conversion. Ohne Verpflichtung.',
        serviceSchemaName: 'Website Audit',
        serviceSchemaDescription:
          'Deterministischer Website-Audit zu technischer Performance, Content, Vertrauenssignalen und Conversion — 25+ gemessene Signale.',
        eyebrow: 'SEO Landing · Website-Audit',
        headline: (
          <>
            Der <em className="font-editorial italic">Website-Audit</em>, der Ihre Wachstumsbremsen beim Namen nennt.
          </>
        ),
        lede:
          'Wir messen 25+ Signale zu technischer Performance, Content, Vertrauen und Conversion — und geben Ihnen eine priorisierte Fix-Liste. Kostenlos. Kein Login. Kein Verkaufsgespräch, ausser Sie fragen danach.',
        primaryCta: { label: 'Gratis-Audit starten', href: '/audit', location: 'website-audit-hero' },
        secondaryCta: { label: 'Wie es funktioniert', href: '/ultimate-package', location: 'website-audit-hero' },
        annotation: '25+ Signale · deterministisches Scoring · aus der Schweiz · keine Verpflichtung',
        problemLabel: 'Die Lücke',
        problemHeadline: 'Ihre Seite verliert Leads an Stellen, die Sie nicht sehen.',
        problemPoints: [
          'Core Web Vitals senken still Anzeigeneffizienz und organische Rankings.',
          'Meta-Tags, Headings und strukturierte Daten verpassen die Intent-Signale, die Google indexiert.',
          'Kontaktformulare haben Reibung — zu viele Felder, fehlende Labels, keine Bestätigung.',
          'Vertrauenssignale (Impressum, Bewertungen, Reaktionszeit) sind lückenhaft oder fehlen.',
          'Der Loop von Audit zu Umsetzung ist gebrochen: Reports werden gelesen, nichts wird umgesetzt.',
        ],
        analysisLabel: 'Was wir messen',
        analysisHeadline: 'Fünf Dimensionen. Ein deterministischer Score.',
        analysisItems: [
          { num: '01', title: 'Technische Gesundheit', body: 'Core Web Vitals, HTTPS, Canonicals, Mobile-Viewport, Indexierbarkeit, Sitemap- und Robots-Hygiene.' },
          { num: '02', title: 'Content & SEO', body: 'Qualität von Title/Description, Heading-Struktur, Keyword-zu-Seite-Passung, JSON-LD, interne Verlinkung.' },
          { num: '03', title: 'Vertrauen & Compliance', body: 'Impressums-Vollständigkeit, Datenschutz, Kontakt-Erreichbarkeit, Bewertungen, Schweizer Rechtsbasis.' },
          { num: '04', title: 'Conversion-Mechanik', body: 'Formular-Reibung, CTA-Platzierung, Validierung, Reaktionszeit-Erwartung, Mobile-Tap-Targets.' },
          { num: '05', title: 'Automations-Reife', body: 'Tracking-Abdeckung, Lead-Routing, CRM-Anbindungs-Hinweise, KI-/Automations-Angriffsfläche.' },
        ],
        processLabel: 'Wie es abläuft',
        processSteps: [
          { num: '01', title: 'URL eingeben', body: 'Ein Feld. Kein Account, keine Karte. Wir prüfen, dass die URL erreichbar und sicher scanbar ist.' },
          { num: '02', title: 'Deterministischer Scan', body: 'Wir sammeln 25+ Signale via öffentliche Daten und PageSpeed-API. Jede Messung hat eine Quellen-Kennzeichnung.' },
          { num: '03', title: 'Score & Report', body: 'Sie sehen einen Gesamt-Score plus Aufschlüsselung pro Dimension, Top-Stärken und grösste Risiken.' },
          { num: '04', title: 'Priorisierte Fixes', body: '3-5 empfohlene Massnahmen nach Wirkung pro Aufwand — umsetzbar dieses Quartal, keine Wunschliste.' },
        ],
        faqLabel: 'Häufige Fragen',
        faqItems: [
          { question: 'Ist es wirklich kostenlos?', answer: 'Ja. Der Audit läuft auf unserer Infrastruktur, wir tragen die Kosten. Wenn Sie danach Umsetzungshilfe möchten, offerieren wir separat.' },
          { question: 'Welche Daten verwenden Sie?', answer: 'Nur öffentlich zugängliche Signale Ihrer URL, plus Google-PageSpeed-API und (zur Anreicherung) Semrush-Daten Ihrer Domain. Keine Cookies, kein Login.' },
          { question: 'Bekomme ich den Report als PDF?', answer: 'Ja. Jede Audit-Ergebnisseite hat einen Export. Der Report gehört Ihnen und darf intern geteilt werden.' },
          { question: 'Melden Sie sich mit Sales?', answer: 'Nur wenn Sie es explizit möchten. Jede E-Mail hat einen Opt-Out-Link, wir respektieren ihn sofort.' },
        ],
        finalHeadline: (
          <>
            Eine URL. <em className="font-editorial italic">Ein Score.</em> Null Verpflichtung.
          </>
        ),
        finalBody:
          'Der Audit dauert 2-3 Minuten. Sie bekommen einen echten Score mit echten Empfehlungen. Was Sie damit machen, ist Ihre Sache.',
      };

  return <SEOLanding {...content} />;
}
