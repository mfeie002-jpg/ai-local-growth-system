import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDir);
const distDir = join(projectRoot, 'dist');
const baseHtml = await readFile(join(distDir, 'index.html'), 'utf8');
const baseUrl = 'https://itsfeierabend.ch';

const pages = [
  ['/', 'de-CH', 'AI Business Audit für Schweizer KMU', 'Evidenzbasierte digitale Standortbestimmung für Sichtbarkeit, Leads, Conversion, Tracking, CRM und Automatisierung.', 'itsFeierabend.ch analysiert die digitale Geschäftslage und priorisiert die nächsten Massnahmen.'],
  ['/en', 'en', 'AI Business Audit for Swiss SMEs', 'Evidence-based digital diagnostics for visibility, leads, conversion, tracking, CRM and automation.', 'itsFeierabend.ch assesses the digital business baseline and prioritizes the next actions.'],
  ['/ai-business-audit', 'de-CH', 'AI Business Audit für Schweizer KMU', 'Digitale Standortbestimmung mit getrennten Messwerten, Selbstangaben, Schätzungen und Expertenprüfung.', 'Sichtbarkeit, Leads, Conversion, Tracking, CRM und Automatisierung in einer priorisierten Diagnose.'],
  ['/en/ai-business-audit', 'en', 'AI Business Audit for Swiss SMEs', 'Digital baseline with measurements, user inputs, estimates and expert review kept separate.', 'Visibility, leads, conversion, tracking, CRM and automation in one prioritized diagnostic.'],
  ['/website-audit', 'de-CH', 'Website Audit für Schweizer Unternehmen', 'Website-Analyse für Technik, Mobile UX, Botschaft, Vertrauen und Conversion mit nachvollziehbarer Evidenz.', 'Sehen Sie, wo Ihre Website Anfragen verliert.'],
  ['/en/website-audit', 'en', 'Website Audit for Swiss companies', 'Website analysis covering technical health, mobile UX, messaging, trust and conversion.', 'See where your website loses enquiries.'],
  ['/seo-analyse', 'de-CH', 'SEO-Analyse für Schweizer KMU', 'SEO Audit für Indexierung, Suchintention, Seitenarchitektur, lokale Sichtbarkeit und Content-Lücken.', 'SEO-Sichtbarkeit nach Geschäftswert priorisieren.'],
  ['/en/seo-analysis', 'en', 'SEO Analysis for Swiss SMEs', 'SEO audit covering indexation, search intent, site architecture, local visibility and content gaps.', 'Prioritize SEO visibility by commercial value.'],
  ['/ai-visibility', 'de-CH', 'AI Search Visibility für Schweizer Unternehmen', 'Entity-Klarheit, semantische Abdeckung, Quellen, strukturierte Antworten und technische Zugänglichkeit.', 'In AI-Antworten verständlich und zitierfähig werden.'],
  ['/en/ai-visibility', 'en', 'AI Search Visibility for Swiss companies', 'Entity clarity, semantic coverage, sources, structured answers and technical accessibility.', 'Become understandable and citable in AI-generated answers.'],
  ['/automation', 'de-CH', 'CRM- und Automatisierungsanalyse für KMU', 'Lead-Erfassung, Routing, Follow-up, CRM-Stufen, Attribution und Reporting systematisch prüfen.', 'Weniger verlorene Leads. Klarere Prozesse.'],
  ['/en/automation', 'en', 'CRM and automation analysis for SMEs', 'Assess lead capture, routing, follow-up, CRM stages, attribution and reporting.', 'Fewer lost leads. Clearer processes.'],
  ['/leistungen', 'de-CH', 'Audits, Growth Sprints und laufende Optimierung', 'Vom kostenlosen Quick Audit über vertiefte Analysen und Growth Sprints bis zur laufenden Optimierung.', 'Von der Diagnose zur messbaren Umsetzung.'],
  ['/en/services', 'en', 'Audits, growth sprints and ongoing optimization', 'From the free Quick Audit through deeper analysis and growth sprints to ongoing optimization.', 'From diagnosis to measurable implementation.'],
  ['/fuer-kmu', 'de-CH', 'AI Business Audits für Schweizer KMU', 'Für etablierte Dienstleistungs- und B2B-KMU mit wertvollen Leads und schwacher Messung oder Nachbearbeitung.', 'Für KMU, bei denen eine qualifizierte Anfrage zählt.'],
  ['/en/for-smes', 'en', 'AI Business Audits for Swiss SMEs', 'For established service and B2B SMEs with valuable leads and weak measurement or follow-up.', 'For SMEs where one qualified lead matters.'],
  ['/partner', 'de-CH', 'Partner-Audits für Agenturen und IT-Dienstleister', 'Diagnose, qualifizierte Übergabe und klar getrennte Verantwortlichkeiten für Schweizer Partner.', 'Audits als belastbarer Einstieg für Partner.'],
  ['/en/partners', 'en', 'Partner audits for agencies and IT providers', 'Diagnosis, qualified handoff and clearly separated responsibilities for Swiss partners.', 'Audits as a credible entry point for partners.'],
  ['/fallstudien', 'de-CH', 'Audit-Methodik in der Praxis', 'Transparentes Produktbeispiel ohne fiktive Kunden, Testimonials oder Performance-Claims.', 'Ein reales Produktbeispiel. Keine erfundene Erfolgsgeschichte.'],
  ['/en/case-studies', 'en', 'Audit methodology in practice', 'A transparent product case without fictional clients, testimonials or performance claims.', 'A real product case. No invented success story.'],
  ['/insights', 'de-CH', 'Insights zu Audits, SEO, AI Visibility und CRM', 'Methodische Insights zu Website Audits, SEO, AI Search Visibility, Lead-Funnels, CRM und Automatisierung.', 'Wissen, das eine Entscheidung verbessert.'],
  ['/en/insights', 'en', 'Insights on audits, SEO, AI visibility and CRM', 'Methodological insights on website audits, SEO, AI visibility, lead funnels, CRM and automation.', 'Knowledge that improves a decision.'],
  ['/ueber-uns', 'de-CH', 'Methodik und Verantwortung', 'Über itsFeierabend.ch: Schweizer Plattform für AI Business Audits und digitale Wachstumsdiagnose.', 'Ruhige Diagnose statt lauter Agenturversprechen.'],
  ['/en/about', 'en', 'Methodology and accountability', 'About itsFeierabend.ch: a Swiss platform for AI business audits and digital growth diagnostics.', 'Clear diagnosis instead of loud agency promises.'],
  ['/kontakt', 'de-CH', 'Kontakt und Analyseanfrage', 'Kontakt für vertiefte Audits, Growth Sprints, SEO- und AI-Visibility-Analysen sowie CRM- und Automatisierungsprojekte.', 'Welche Frage soll zuerst geklärt werden?'],
  ['/en/contact', 'en', 'Contact and analysis enquiry', 'Contact for deep audits, growth sprints, SEO and AI visibility analysis, CRM and automation projects.', 'Which question should we answer first?'],
  ['/audit', 'de-CH', 'Kostenloser AI Business Audit', 'Mehrstufiger Quick Audit mit transparenten Evidenzstufen.', 'Kostenlosen AI Business Audit starten', 'Website, Geschäftskontext und privater Report-Link in drei Schritten.', 'noindex'],
  ['/en/audit', 'en', 'Free AI Business Audit', 'Multi-step Quick Audit with transparent evidence states.', 'Start the free AI Business Audit', 'Website, business context and a private report link in three steps.', 'noindex'],
  ['/impressum', 'de-CH', 'Impressum', 'Kontakt- und Anbieterinformationen für itsFeierabend.ch.', 'Impressum', 'Kontakt- und Anbieterinformationen für itsFeierabend.ch.', 'noindex'],
  ['/en/imprint', 'en', 'Imprint', 'Contact and provider information for itsFeierabend.ch.', 'Imprint', 'Contact and provider information for itsFeierabend.ch.', 'noindex'],
  ['/datenschutz', 'de-CH', 'Datenschutzerklärung', 'Informationen zur Datenbearbeitung auf itsFeierabend.ch.', 'Datenschutzerklärung', 'Informationen zur Datenbearbeitung auf itsFeierabend.ch.', 'noindex'],
  ['/en/privacy', 'en', 'Privacy policy', 'Information about data processing on itsFeierabend.ch.', 'Privacy policy', 'Information about data processing on itsFeierabend.ch.', 'noindex'],
];

const publicPairs = new Map();
const indexablePages = pages.filter((page) => page.at(-1) !== 'noindex');
for (let index = 0; index < indexablePages.length; index += 2) {
  const dePath = indexablePages[index]?.[0];
  const enPath = indexablePages[index + 1]?.[0];
  if (!dePath || !enPath) continue;
  const pair = { de: dePath, en: enPath };
  publicPairs.set(dePath, pair);
  publicPairs.set(enPath, pair);
}

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function replaceMeta(html, path, lang, title, description, heading, summary) {
  const canonical = `${baseUrl}${path === '/' ? '/' : path}`;
  const fullTitle = `${title} | itsFeierabend.ch`;
  const shell = `<div id="root"><main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(summary)}</p></main></div>`;
  let result = html
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'de_CH'}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, shell);

  const pair = publicPairs.get(path);
  if (pair) {
    const deUrl = `${baseUrl}${pair.de}`;
    const enUrl = `${baseUrl}${pair.en}`;
    result = result.replace(
      '</head>',
      `  <link rel="alternate" hreflang="de-CH" href="${deUrl}" />\n` +
      `  <link rel="alternate" hreflang="en" href="${enUrl}" />\n` +
      `  <link rel="alternate" hreflang="x-default" href="${deUrl}" />\n` +
      '  </head>',
    );
  }

  return result;
}

for (const page of pages) {
  const [path, lang, title, description] = page;
  const isCompactEntry = page.length === 5;
  const heading = isCompactEntry ? title : page[4];
  const summary = isCompactEntry ? page[4] : page[5];
  const robots = isCompactEntry ? undefined : page[6];
  let html = replaceMeta(baseHtml, path, lang, title, description, heading, summary);
  if (robots === 'noindex') {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
  }
  const output = path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
  if (path !== '/') {
    // Vite preview and several static hosts resolve the slashless canonical
    // path through an extension fallback before trying /path/index.html.
    // Emit both forms with identical metadata and canonicals.
    const extensionOutput = join(distDir, `${path.slice(1)}.html`);
    await mkdir(dirname(extensionOutput), { recursive: true });
    await writeFile(extensionOutput, html);
  }
}

const notFound = replaceMeta(
  baseHtml,
  '/404',
  'de-CH',
  'Seite nicht gefunden',
  'Die angeforderte Seite existiert nicht.',
  'Seite nicht gefunden',
  'Prüfen Sie die Adresse oder wechseln Sie zur Startseite.',
).replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
await writeFile(join(distDir, '404.html'), notFound);

console.log(
  `Generated ${pages.length} route-specific directory entry points, ` +
  `${pages.length - 1} slashless aliases and 404.html.`,
);
