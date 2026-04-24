import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CTAButton } from '@/components/CTAButton';
import { Button } from '@/components/ui/button';
// PDF generation moved to evidence-based ReportPDF (@react-pdf/renderer) on real reports.
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Search, 
  Zap, 
  Shield, 
  Smartphone, 
  FileText, 
  Code, 
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertOctagon,
  Info,
  Download,
  DollarSign,
  TrendingDown,
  Rocket,
  Target,
  Ban,
  ThumbsUp,
  Calculator,
  Coins,
  Timer,
  Skull,
  HeartCrack,
  CircleDollarSign,
  Sparkles,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  hoursToFix: number;
  costIfIgnored: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  score: number;
  issues: Issue[];
  color: string;
}

const AnalysisResultsDemo: React.FC = () => {
  const { language } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['seo', 'performance']);

  const content = {
    title: language === 'de' ? 'Analyse-Ergebnis' : 'Analysis Results',
    subtitle: language === 'de' ? 'Vollständiger Report für' : 'Complete Report for',
    demoSite: 'beispiel-website.ch',
    overallScore: 34,
    totalIssues: 147,
    criticalIssues: 23,
    warningIssues: 68,
    infoIssues: 56,
    scoreLabel: language === 'de' ? 'Gesamt-Score' : 'Overall Score',
    issuesFound: language === 'de' ? 'Probleme gefunden' : 'Issues Found',
    critical: language === 'de' ? 'Kritisch' : 'Critical',
    warnings: language === 'de' ? 'Warnungen' : 'Warnings',
    improvements: language === 'de' ? 'Verbesserungen' : 'Improvements',
    impactLabel: language === 'de' ? 'Auswirkung' : 'Impact',
    effortLabel: language === 'de' ? 'Aufwand' : 'Effort',
    hoursLabel: language === 'de' ? 'Stunden' : 'Hours',
    costLabel: language === 'de' ? 'Monatlicher Verlust' : 'Monthly Loss',
    effortLevels: {
      low: language === 'de' ? 'Gering' : 'Low',
      medium: language === 'de' ? 'Mittel' : 'Medium',
      high: language === 'de' ? 'Hoch' : 'High'
    },
    disclaimer: language === 'de' 
      ? 'Dies ist eine Demo-Ansicht. Starten Sie Ihre kostenlose Analyse für echte Ergebnisse.'
      : 'This is a demo view. Start your free analysis for real results.',
    startAnalysis: language === 'de' ? 'Eigene Analyse starten' : 'Start Your Analysis',
    downloadPdf: language === 'de' ? 'Report als PDF' : 'Download PDF',
    // Cost & Time section
    costTimeTitle: language === 'de' ? 'Der wahre Preis des Nichtstuns' : 'The True Cost of Inaction',
    costTimeSubtitle: language === 'de' 
      ? 'Jeder Tag ohne Optimierung kostet Sie bares Geld. Hier ist die Rechnung:'
      : 'Every day without optimization costs you real money. Here\'s the calculation:',
    // Consequences section
    consequencesTitle: language === 'de' ? 'Was passiert, wenn Sie nichts tun?' : 'What happens if you do nothing?',
    consequencesSubtitle: language === 'de' 
      ? 'Die Konkurrenz schläft nicht. Ohne Optimierung verlieren Sie täglich:'
      : 'Your competition never sleeps. Without optimization, you\'re losing daily:',
    // Business projection
    projectionTitle: language === 'de' ? 'Ihr Business: Vorher vs. Nachher' : 'Your Business: Before vs. After',
    projectionSubtitle: language === 'de' 
      ? 'Basierend auf unseren Analysen und Erfahrungswerten:'
      : 'Based on our analysis and experience:',
    // Final CTA
    finalCtaTitle: language === 'de' ? 'Sie haben zwei Optionen' : 'You have two options',
    option1Title: language === 'de' ? 'Selbst machen' : 'Do it yourself',
    option2Title: language === 'de' ? 'Wir machen alles für Sie' : 'We do everything for you',
  };

  // Calculate totals
  const totalHours = 847; // Calculated from all issues
  const hourlyRate = 150;
  const monthlyLossIfIgnored = 12450; // CHF per month lost
  const currentMonthlyRevenue = 25000;
  const projectedMonthlyRevenue = 67500;

  const categories: Category[] = [
    {
      id: 'seo',
      name: 'SEO & Sichtbarkeit',
      icon: <Search className="h-5 w-5" />,
      score: 28,
      color: 'text-red-500',
      issues: [
        { id: 'seo-1', title: 'Fehlende Meta-Beschreibungen', description: '12 Seiten haben keine Meta-Description', severity: 'critical', impact: 'Reduziert Click-Through-Rate um bis zu 30%', effort: 'low', hoursToFix: 6, costIfIgnored: 450 },
        { id: 'seo-2', title: 'Duplicate Title Tags', description: '8 Seiten haben identische Titel', severity: 'critical', impact: 'Verwirrung bei Suchmaschinen', effort: 'low', hoursToFix: 4, costIfIgnored: 320 },
        { id: 'seo-3', title: 'Fehlende H1-Überschriften', description: '5 Seiten ohne Hauptüberschrift', severity: 'critical', impact: 'Schlechte Keyword-Zuordnung', effort: 'low', hoursToFix: 3, costIfIgnored: 280 },
        { id: 'seo-4', title: 'Broken Internal Links', description: '23 interne Links führen zu 404-Seiten', severity: 'critical', impact: 'Verlust von Link-Juice und schlechte UX', effort: 'medium', hoursToFix: 8, costIfIgnored: 520 },
        { id: 'seo-5', title: 'Fehlende Alt-Texte', description: '47 Bilder ohne Alt-Attribut', severity: 'warning', impact: 'Verpasste Bildsuche-Optimierung', effort: 'medium', hoursToFix: 12, costIfIgnored: 180 },
        { id: 'seo-6', title: 'Thin Content', description: '6 Seiten mit weniger als 300 Wörtern', severity: 'warning', impact: 'Geringe Ranking-Chancen', effort: 'high', hoursToFix: 24, costIfIgnored: 650 },
        { id: 'seo-7', title: 'Fehlende Canonical Tags', description: 'Keine Canonical-URLs definiert', severity: 'warning', impact: 'Mögliche Duplicate Content Probleme', effort: 'low', hoursToFix: 2, costIfIgnored: 220 },
        { id: 'seo-8', title: 'Keine XML-Sitemap', description: 'Sitemap fehlt oder ist fehlerhaft', severity: 'warning', impact: 'Schlechtere Indexierung', effort: 'low', hoursToFix: 2, costIfIgnored: 180 },
        { id: 'seo-9', title: 'Robots.txt Probleme', description: 'Wichtige Seiten werden blockiert', severity: 'critical', impact: 'Seiten werden nicht indexiert', effort: 'low', hoursToFix: 1, costIfIgnored: 890 },
        { id: 'seo-10', title: 'Keine strukturierten Daten', description: 'Schema.org Markup fehlt komplett', severity: 'warning', impact: 'Keine Rich Snippets möglich', effort: 'medium', hoursToFix: 16, costIfIgnored: 340 },
        { id: 'seo-11', title: 'Keyword-Kannibalisierung', description: '4 Seiten konkurrieren um gleiche Keywords', severity: 'warning', impact: 'Verwässerte Rankings', effort: 'high', hoursToFix: 20, costIfIgnored: 480 },
        { id: 'seo-12', title: 'Fehlende Open Graph Tags', description: 'Social Media Preview fehlt', severity: 'info', impact: 'Schlechte Social Shares', effort: 'low', hoursToFix: 4, costIfIgnored: 120 },
        { id: 'seo-13', title: 'URL-Struktur suboptimal', description: 'URLs zu lang und nicht sprechend', severity: 'info', impact: 'Schlechtere User-Wahrnehmung', effort: 'medium', hoursToFix: 12, costIfIgnored: 90 },
        { id: 'seo-14', title: 'Keine Breadcrumb-Navigation', description: 'Breadcrumbs fehlen auf allen Seiten', severity: 'info', impact: 'Schlechtere interne Verlinkung', effort: 'medium', hoursToFix: 8, costIfIgnored: 110 }
      ]
    },
    {
      id: 'performance',
      name: 'Performance & Geschwindigkeit',
      icon: <Zap className="h-5 w-5" />,
      score: 31,
      color: 'text-orange-500',
      issues: [
        { id: 'perf-1', title: 'Extrem langsame Ladezeit', description: 'First Contentful Paint: 6.2s (Ziel: <1.8s)', severity: 'critical', impact: '53% der Nutzer verlassen die Seite', effort: 'high', hoursToFix: 40, costIfIgnored: 2100 },
        { id: 'perf-2', title: 'Largest Contentful Paint', description: 'LCP: 8.4s (Ziel: <2.5s)', severity: 'critical', impact: 'Massiver Ranking-Nachteil', effort: 'high', hoursToFix: 32, costIfIgnored: 1800 },
        { id: 'perf-3', title: 'Cumulative Layout Shift', description: 'CLS: 0.42 (Ziel: <0.1)', severity: 'critical', impact: 'Frustration bei Nutzern', effort: 'medium', hoursToFix: 16, costIfIgnored: 560 },
        { id: 'perf-4', title: 'Nicht optimierte Bilder', description: '34 Bilder nicht komprimiert (12.4 MB)', severity: 'critical', impact: 'Verlängert Ladezeit massiv', effort: 'medium', hoursToFix: 8, costIfIgnored: 780 },
        { id: 'perf-5', title: 'Kein Browser-Caching', description: 'Cache-Header fehlen komplett', severity: 'warning', impact: 'Jeder Besuch lädt alles neu', effort: 'low', hoursToFix: 2, costIfIgnored: 190 },
        { id: 'perf-6', title: 'Render-Blocking Resources', description: '8 CSS/JS Dateien blockieren Rendering', severity: 'warning', impact: 'Verzögerter First Paint', effort: 'medium', hoursToFix: 12, costIfIgnored: 340 },
        { id: 'perf-7', title: 'Keine GZIP-Komprimierung', description: 'Server-Komprimierung deaktiviert', severity: 'warning', impact: '70% größere Dateien', effort: 'low', hoursToFix: 1, costIfIgnored: 210 },
        { id: 'perf-8', title: 'Zu viele HTTP-Requests', description: '94 Requests pro Seitenaufruf', severity: 'warning', impact: 'Erhöhte Latenz', effort: 'high', hoursToFix: 24, costIfIgnored: 420 },
        { id: 'perf-9', title: 'Kein Lazy Loading', description: 'Alle Bilder werden sofort geladen', severity: 'warning', impact: 'Unnötige Datenlast', effort: 'low', hoursToFix: 4, costIfIgnored: 180 },
        { id: 'perf-10', title: 'Unoptimiertes JavaScript', description: '2.3 MB unkomprimiertes JS', severity: 'critical', impact: 'Lange Parse-Zeit auf Mobil', effort: 'high', hoursToFix: 32, costIfIgnored: 890 },
        { id: 'perf-11', title: 'Keine CDN-Nutzung', description: 'Assets werden nicht über CDN ausgeliefert', severity: 'info', impact: 'Langsamere globale Ladezeiten', effort: 'medium', hoursToFix: 8, costIfIgnored: 150 },
        { id: 'perf-12', title: 'Fehlende Preconnect Hints', description: 'Externe Domains ohne Preconnect', severity: 'info', impact: 'Verzögerte Third-Party Loads', effort: 'low', hoursToFix: 2, costIfIgnored: 60 }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Optimierung',
      icon: <Smartphone className="h-5 w-5" />,
      score: 42,
      color: 'text-yellow-500',
      issues: [
        { id: 'mob-1', title: 'Nicht responsive Design', description: '14 Elemente passen nicht auf Mobile', severity: 'critical', impact: '68% der Nutzer sind mobil', effort: 'high', hoursToFix: 48, costIfIgnored: 1650 },
        { id: 'mob-2', title: 'Touch-Targets zu klein', description: '23 Buttons/Links unter 48x48px', severity: 'warning', impact: 'Frustrierende Bedienung', effort: 'medium', hoursToFix: 8, costIfIgnored: 280 },
        { id: 'mob-3', title: 'Text zu klein', description: 'Schriftgröße unter 16px auf Mobil', severity: 'warning', impact: 'Schlechte Lesbarkeit', effort: 'low', hoursToFix: 4, costIfIgnored: 190 },
        { id: 'mob-4', title: 'Horizontales Scrollen', description: 'Seite breiter als Viewport', severity: 'critical', impact: 'Inhalte nicht sichtbar', effort: 'medium', hoursToFix: 12, costIfIgnored: 520 },
        { id: 'mob-5', title: 'Fehlender Viewport Meta-Tag', description: 'Viewport nicht korrekt definiert', severity: 'critical', impact: 'Seite wird falsch skaliert', effort: 'low', hoursToFix: 1, costIfIgnored: 340 },
        { id: 'mob-6', title: 'Flash-Inhalte', description: '2 Flash-Elemente gefunden', severity: 'critical', impact: 'Funktioniert nicht auf Mobil', effort: 'medium', hoursToFix: 8, costIfIgnored: 280 },
        { id: 'mob-7', title: 'Pop-ups blockieren Inhalt', description: 'Interstitials auf Mobil problematisch', severity: 'warning', impact: 'Google-Penalty möglich', effort: 'low', hoursToFix: 4, costIfIgnored: 450 },
        { id: 'mob-8', title: 'Langsame Mobile-Ladezeit', description: 'Mobile Score: 23/100', severity: 'critical', impact: 'Hohe Absprungrate', effort: 'high', hoursToFix: 32, costIfIgnored: 980 }
      ]
    },
    {
      id: 'security',
      name: 'Sicherheit & Datenschutz',
      icon: <Shield className="h-5 w-5" />,
      score: 38,
      color: 'text-red-600',
      issues: [
        { id: 'sec-1', title: 'Kein HTTPS', description: 'Seite nicht über SSL gesichert', severity: 'critical', impact: '"Nicht sicher" Warnung im Browser', effort: 'medium', hoursToFix: 8, costIfIgnored: 1200 },
        { id: 'sec-2', title: 'Mixed Content', description: '18 HTTP-Ressourcen auf HTTPS-Seite', severity: 'critical', impact: 'SSL-Warnung trotz Zertifikat', effort: 'medium', hoursToFix: 6, costIfIgnored: 340 },
        { id: 'sec-3', title: 'Fehlende Security Headers', description: 'CSP, HSTS, X-Frame-Options fehlen', severity: 'warning', impact: 'Anfällig für Angriffe', effort: 'low', hoursToFix: 4, costIfIgnored: 280 },
        { id: 'sec-4', title: 'Outdated Software', description: 'WordPress 4.9, PHP 7.1', severity: 'critical', impact: 'Bekannte Sicherheitslücken', effort: 'high', hoursToFix: 24, costIfIgnored: 890 },
        { id: 'sec-5', title: 'Cookie-Banner fehlt', description: 'Keine DSGVO-konforme Cookie-Einwilligung', severity: 'critical', impact: 'Rechtliche Konsequenzen möglich', effort: 'medium', hoursToFix: 8, costIfIgnored: 5000 },
        { id: 'sec-6', title: 'Impressum unvollständig', description: 'Pflichtangaben fehlen', severity: 'warning', impact: 'Abmahnrisiko', effort: 'low', hoursToFix: 2, costIfIgnored: 2500 },
        { id: 'sec-7', title: 'Datenschutzerklärung veraltet', description: 'Nicht DSGVO-konform', severity: 'warning', impact: 'Rechtliche Konsequenzen', effort: 'medium', hoursToFix: 8, costIfIgnored: 3000 },
        { id: 'sec-8', title: 'Offene Admin-Seiten', description: 'Login-Seite öffentlich indexiert', severity: 'warning', impact: 'Brute-Force Risiko', effort: 'low', hoursToFix: 2, costIfIgnored: 180 },
        { id: 'sec-9', title: 'Keine Backup-Strategie', description: 'Kein automatisches Backup erkennbar', severity: 'info', impact: 'Datenverlust-Risiko', effort: 'medium', hoursToFix: 4, costIfIgnored: 450 }
      ]
    },
    {
      id: 'ux',
      name: 'User Experience & Design',
      icon: <Users className="h-5 w-5" />,
      score: 45,
      color: 'text-orange-400',
      issues: [
        { id: 'ux-1', title: 'Keine klare Call-to-Action', description: 'Hauptziel der Seite unklar', severity: 'critical', impact: 'Niedrige Conversion-Rate', effort: 'medium', hoursToFix: 16, costIfIgnored: 1850 },
        { id: 'ux-2', title: 'Veraltetes Design', description: 'Design-Trends von 2015', severity: 'warning', impact: 'Wirkt unprofessionell', effort: 'high', hoursToFix: 80, costIfIgnored: 980 },
        { id: 'ux-3', title: 'Inkonsistente Navigation', description: 'Menü variiert zwischen Seiten', severity: 'warning', impact: 'Verwirrende Bedienung', effort: 'medium', hoursToFix: 12, costIfIgnored: 340 },
        { id: 'ux-4', title: 'Fehlende Suchfunktion', description: 'Keine Suche für 200+ Seiten', severity: 'warning', impact: 'Nutzer finden Inhalte nicht', effort: 'medium', hoursToFix: 16, costIfIgnored: 420 },
        { id: 'ux-5', title: 'Lange Formulare', description: 'Kontaktformular mit 12 Feldern', severity: 'warning', impact: 'Hohe Abbruchrate', effort: 'low', hoursToFix: 4, costIfIgnored: 650 },
        { id: 'ux-6', title: 'Keine Fehlerbehandlung', description: 'Formular-Fehler nicht erklärt', severity: 'info', impact: 'Frustrierte Nutzer', effort: 'low', hoursToFix: 4, costIfIgnored: 180 },
        { id: 'ux-7', title: 'Schlechter Farbkontrast', description: '8 Texte unter WCAG AA', severity: 'warning', impact: 'Barrierefreiheit-Probleme', effort: 'low', hoursToFix: 4, costIfIgnored: 120 },
        { id: 'ux-8', title: 'Kein Fokus-State', description: 'Keyboard-Navigation unmöglich', severity: 'info', impact: 'Barrierefreiheit-Probleme', effort: 'low', hoursToFix: 4, costIfIgnored: 90 },
        { id: 'ux-9', title: 'Auto-Play Videos', description: '3 Videos starten automatisch', severity: 'warning', impact: 'Störend für Nutzer', effort: 'low', hoursToFix: 2, costIfIgnored: 180 },
        { id: 'ux-10', title: 'Keine 404-Seite', description: 'Standard-Server-Fehlerseite', severity: 'info', impact: 'Verlorene Nutzer', effort: 'low', hoursToFix: 4, costIfIgnored: 120 }
      ]
    },
    {
      id: 'content',
      name: 'Content & Konversion',
      icon: <FileText className="h-5 w-5" />,
      score: 35,
      color: 'text-purple-500',
      issues: [
        { id: 'cont-1', title: 'Keine Trust-Elemente', description: 'Keine Kundenbewertungen, Zertifikate', severity: 'critical', impact: 'Geringes Vertrauen', effort: 'medium', hoursToFix: 16, costIfIgnored: 1450 },
        { id: 'cont-2', title: 'Fehlende Social Proof', description: 'Keine Testimonials oder Case Studies', severity: 'warning', impact: 'Schwache Überzeugungskraft', effort: 'medium', hoursToFix: 24, costIfIgnored: 890 },
        { id: 'cont-3', title: 'Preise nicht transparent', description: 'Kein Pricing auf der Website', severity: 'warning', impact: 'Nutzer brechen ab', effort: 'low', hoursToFix: 8, costIfIgnored: 720 },
        { id: 'cont-4', title: 'Veraltete Inhalte', description: '15 Seiten zuletzt 2021 aktualisiert', severity: 'warning', impact: 'Wirkt vernachlässigt', effort: 'high', hoursToFix: 40, costIfIgnored: 340 },
        { id: 'cont-5', title: 'Keine FAQ-Sektion', description: 'Häufige Fragen unbeantwortet', severity: 'info', impact: 'Mehr Support-Anfragen', effort: 'medium', hoursToFix: 12, costIfIgnored: 280 },
        { id: 'cont-6', title: 'Fehlende USPs', description: 'Alleinstellungsmerkmale nicht klar', severity: 'critical', impact: 'Warum sollte man Sie wählen?', effort: 'medium', hoursToFix: 16, costIfIgnored: 1200 },
        { id: 'cont-7', title: 'Kein Blog', description: 'Keine regelmäßigen Inhalte', severity: 'info', impact: 'Verpasste SEO-Chancen', effort: 'high', hoursToFix: 40, costIfIgnored: 450 },
        { id: 'cont-8', title: 'Schwache Headlines', description: 'Überschriften nicht überzeugend', severity: 'warning', impact: 'Nutzer lesen nicht weiter', effort: 'low', hoursToFix: 8, costIfIgnored: 380 },
        { id: 'cont-9', title: 'Keine Lead-Magnete', description: 'Kein Anreiz für E-Mail-Signup', severity: 'info', impact: 'Keine Lead-Generierung', effort: 'medium', hoursToFix: 20, costIfIgnored: 560 }
      ]
    },
    {
      id: 'local',
      name: 'Local SEO & Google',
      icon: <MapPin className="h-5 w-5" />,
      score: 22,
      color: 'text-red-500',
      issues: [
        { id: 'loc-1', title: 'Kein Google Business Profil', description: 'Nicht in Google Maps gelistet', severity: 'critical', impact: 'Unsichtbar für lokale Suchen', effort: 'medium', hoursToFix: 8, costIfIgnored: 1800 },
        { id: 'loc-2', title: 'NAP-Inkonsistenz', description: 'Unterschiedliche Adressen online', severity: 'critical', impact: 'Verwirrung bei Google', effort: 'high', hoursToFix: 24, costIfIgnored: 890 },
        { id: 'loc-3', title: 'Keine lokalen Keywords', description: 'Standort nicht in Texten erwähnt', severity: 'warning', impact: 'Schlechtes lokales Ranking', effort: 'low', hoursToFix: 8, costIfIgnored: 450 },
        { id: 'loc-4', title: 'Keine Bewertungen', description: '0 Google-Rezensionen', severity: 'critical', impact: 'Weniger Vertrauen, schlechteres Ranking', effort: 'high', hoursToFix: 20, costIfIgnored: 1200 },
        { id: 'loc-5', title: 'Fehlende LocalBusiness Schema', description: 'Keine strukturierten lokalen Daten', severity: 'warning', impact: 'Keine Rich Snippets', effort: 'low', hoursToFix: 4, costIfIgnored: 280 },
        { id: 'loc-6', title: 'Keine lokalen Backlinks', description: 'Keine Verlinkungen aus der Region', severity: 'info', impact: 'Schwächere lokale Autorität', effort: 'high', hoursToFix: 40, costIfIgnored: 340 },
        { id: 'loc-7', title: 'Keine Standort-Seiten', description: 'Bei mehreren Standorten: separate Seiten fehlen', severity: 'info', impact: 'Verpasste Ranking-Chancen', effort: 'medium', hoursToFix: 24, costIfIgnored: 420 }
      ]
    },
    {
      id: 'technical',
      name: 'Technische Infrastruktur',
      icon: <Code className="h-5 w-5" />,
      score: 29,
      color: 'text-gray-500',
      issues: [
        { id: 'tech-1', title: 'Langsamer Hosting-Server', description: 'TTFB: 2.3s (Ziel: <200ms)', severity: 'critical', impact: 'Alles ist langsam', effort: 'high', hoursToFix: 16, costIfIgnored: 980 },
        { id: 'tech-2', title: 'Keine Redirects für www', description: 'www und non-www beide erreichbar', severity: 'warning', impact: 'Duplicate Content', effort: 'low', hoursToFix: 1, costIfIgnored: 180 },
        { id: 'tech-3', title: 'Veraltete jQuery-Version', description: 'jQuery 1.12 mit Sicherheitslücken', severity: 'warning', impact: 'Sicherheitsrisiko', effort: 'medium', hoursToFix: 12, costIfIgnored: 340 },
        { id: 'tech-4', title: 'Keine Lazy Loading für Iframes', description: 'YouTube-Videos laden sofort', severity: 'info', impact: 'Langsame Seitenladung', effort: 'low', hoursToFix: 2, costIfIgnored: 90 },
        { id: 'tech-5', title: 'Zu viele Plugins', description: '34 aktive WordPress-Plugins', severity: 'warning', impact: 'Konflikte und Langsamkeit', effort: 'high', hoursToFix: 24, costIfIgnored: 420 },
        { id: 'tech-6', title: 'Keine Staging-Umgebung', description: 'Änderungen direkt auf Live', severity: 'info', impact: 'Risiko bei Updates', effort: 'medium', hoursToFix: 8, costIfIgnored: 180 },
        { id: 'tech-7', title: 'Database nicht optimiert', description: 'Post-Revisionen: 2,847 Einträge', severity: 'info', impact: 'Langsame Queries', effort: 'low', hoursToFix: 2, costIfIgnored: 90 },
        { id: 'tech-8', title: 'Kein Error Logging', description: 'Fehler werden nicht protokolliert', severity: 'info', impact: 'Probleme unentdeckt', effort: 'low', hoursToFix: 2, costIfIgnored: 120 }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & Tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      score: 18,
      color: 'text-red-600',
      issues: [
        { id: 'ana-1', title: 'Kein Analytics installiert', description: 'Keine Daten über Besucher', severity: 'critical', impact: 'Keine datenbasierte Optimierung möglich', effort: 'low', hoursToFix: 4, costIfIgnored: 890 },
        { id: 'ana-2', title: 'Kein Conversion-Tracking', description: 'Kontaktformular-Absendungen nicht gemessen', severity: 'critical', impact: 'ROI nicht messbar', effort: 'low', hoursToFix: 4, costIfIgnored: 780 },
        { id: 'ana-3', title: 'Keine Heatmaps', description: 'Nutzerverhalten unbekannt', severity: 'info', impact: 'Verpasste Optimierungen', effort: 'low', hoursToFix: 4, costIfIgnored: 340 },
        { id: 'ana-4', title: 'Kein Search Console', description: 'Nicht in Google Search Console', severity: 'critical', impact: 'Keine SEO-Insights', effort: 'low', hoursToFix: 2, costIfIgnored: 560 },
        { id: 'ana-5', title: 'Keine Ziele definiert', description: 'Analytics ohne Ziel-Tracking', severity: 'warning', impact: 'Keine Conversion-Daten', effort: 'low', hoursToFix: 4, costIfIgnored: 450 },
        { id: 'ana-6', title: 'Kein Facebook Pixel', description: 'Remarketing nicht möglich', severity: 'info', impact: 'Werbe-Chancen verpasst', effort: 'low', hoursToFix: 2, costIfIgnored: 280 }
      ]
    },
    {
      id: 'social',
      name: 'Social Media Integration',
      icon: <Share2 className="h-5 w-5" />,
      score: 25,
      color: 'text-blue-500',
      issues: [
        { id: 'soc-1', title: 'Keine Social Links', description: 'Social Media Profile nicht verlinkt', severity: 'warning', impact: 'Verpasste Reichweite', effort: 'low', hoursToFix: 2, costIfIgnored: 180 },
        { id: 'soc-2', title: 'Keine Share-Buttons', description: 'Inhalte nicht teilbar', severity: 'info', impact: 'Weniger virales Potenzial', effort: 'low', hoursToFix: 4, costIfIgnored: 120 },
        { id: 'soc-3', title: 'Open Graph fehlt', description: 'Schlechte Social Previews', severity: 'warning', impact: 'Weniger Klicks aus Social', effort: 'low', hoursToFix: 4, costIfIgnored: 220 },
        { id: 'soc-4', title: 'Twitter Cards fehlen', description: 'Keine Twitter-Vorschau', severity: 'info', impact: 'Schlechtere Twitter-Shares', effort: 'low', hoursToFix: 2, costIfIgnored: 90 },
        { id: 'soc-5', title: 'Keine Social Proof', description: 'Follower-Zahlen nicht gezeigt', severity: 'info', impact: 'Weniger Vertrauen', effort: 'low', hoursToFix: 2, costIfIgnored: 120 }
      ]
    }
  ];

  const getSeverityIcon = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">{content.critical}</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 text-xs">{content.warnings}</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-xs">{content.improvements}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-destructive';
    if (score < 50) return 'text-yellow-500';
    if (score < 70) return 'text-orange-400';
    return 'text-green-500';
  };

  // PDF download is only available on real, evidence-based reports (see ReportPDF.tsx).
  // This demo page is illustrative only — no PDF export here.
  const generatePDF = () => {
    toast.info(
      language === 'de'
        ? 'PDF-Export ist nur für echte Analyse-Reports verfügbar. Starte eine kostenlose Analyse, um deinen Report zu erhalten.'
        : 'PDF export is only available for real analysis reports. Start a free analysis to get your report.'
    );
  };

  // Simulate email notification (dummy)
  const sendEmailNotification = () => {
    console.log('[DUMMY] Email notification would be sent to admin about new analysis request');
    // In real implementation, this would call an edge function
  };

  // Consequences of not fixing
  const consequences = [
    { 
      icon: <TrendingDown className="h-8 w-8" />, 
      title: language === 'de' ? 'Sinkende Rankings' : 'Declining Rankings',
      description: language === 'de' ? 'Google bevorzugt schnelle, sichere, mobile-optimierte Websites. Jeden Monat fallen Sie weiter zurück.' : 'Google prefers fast, secure, mobile-optimized websites. Every month you fall further behind.',
      loss: 'CHF 2,400/Monat'
    },
    { 
      icon: <HeartCrack className="h-8 w-8" />, 
      title: language === 'de' ? 'Verlorene Kunden' : 'Lost Customers',
      description: language === 'de' ? '53% der Besucher verlassen langsame Websites. Das sind potenzielle Kunden, die zur Konkurrenz gehen.' : '53% of visitors leave slow websites. Those are potential customers going to your competitors.',
      loss: 'CHF 4,800/Monat'
    },
    { 
      icon: <Skull className="h-8 w-8" />, 
      title: language === 'de' ? 'Wachsende Konkurrenz' : 'Growing Competition',
      description: language === 'de' ? 'Während Sie warten, optimieren Ihre Konkurrenten. Der Abstand wird täglich größer.' : 'While you wait, your competitors optimize. The gap grows daily.',
      loss: 'CHF 3,200/Monat'
    },
    { 
      icon: <Ban className="h-8 w-8" />, 
      title: language === 'de' ? 'Rechtliche Risiken' : 'Legal Risks',
      description: language === 'de' ? 'DSGVO-Verstöße können zu Abmahnungen und Bußgeldern führen. Ein fehlendes Cookie-Banner kann CHF 5,000+ kosten.' : 'GDPR violations can lead to warnings and fines. A missing cookie banner can cost CHF 5,000+.',
      loss: 'CHF 2,050/Monat'
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={`${content.title} | Digital Marketing Agentur`}
        description="Vollständiger Website-Analyse-Report mit detaillierten Verbesserungsvorschlägen für SEO, Performance, Sicherheit und mehr."
        canonical="/analyse-ergebnis-demo"
      />

      {/* Demo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-3 text-sm">
          <AlertOctagon className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{content.disclaimer}</span>
          <CTAButton variant="secondary" size="sm" href="/ultimate-package">
            {content.startAnalysis}
          </CTAButton>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-2">{content.subtitle}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {content.demoSite}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                Analysiert am {new Date().toLocaleDateString('de-CH')}
              </p>
              <Button onClick={generatePDF} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {content.downloadPdf}
              </Button>
            </div>
          </ScrollReveal>

          {/* Score Overview */}
          <ScrollReveal delay={0.1}>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {/* Overall Score */}
              <Card className="md:col-span-1 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{content.scoreLabel}</p>
                  <div className={`text-6xl font-bold ${getScoreColor(content.overallScore)}`}>
                    {content.overallScore}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">von 100</p>
                </CardContent>
              </Card>

              {/* Issue Breakdown */}
              <Card className="md:col-span-3">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{content.issuesFound}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-destructive/10">
                      <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <div className="text-3xl font-bold text-destructive">{content.criticalIssues}</div>
                      <p className="text-sm text-muted-foreground">{content.critical}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-yellow-500">{content.warningIssues}</div>
                      <p className="text-sm text-muted-foreground">{content.warnings}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10">
                      <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-500">{content.infoIssues}</div>
                      <p className="text-sm text-muted-foreground">{content.improvements}</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {content.totalIssues} {language === 'de' ? 'Verbesserungspunkte insgesamt' : 'improvement points total'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>

          {/* THE REAL COST - Hours & Money */}
          <ScrollReveal delay={0.15}>
            <Card className="mb-12 border-destructive/30 bg-gradient-to-br from-destructive/5 to-background">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                  <Calculator className="h-8 w-8 text-destructive" />
                  {content.costTimeTitle}
                </CardTitle>
                <p className="text-center text-muted-foreground">{content.costTimeSubtitle}</p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 rounded-xl bg-destructive/10 border border-destructive/20">
                    <Timer className="h-10 w-10 text-destructive mx-auto mb-3" />
                    <div className="text-4xl font-bold text-destructive mb-2">{totalHours}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Arbeitsstunden benötigt' : 'Work hours needed'}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <Coins className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-yellow-600 mb-2">CHF {(totalHours * hourlyRate).toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'DIY-Kosten (à CHF 150/h)' : 'DIY cost (at CHF 150/h)'}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <Clock className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-orange-500 mb-2">{Math.ceil(totalHours / 40)}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Wochen Vollzeit-Arbeit' : 'Weeks of full-time work'}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-red-600/10 border border-red-600/20">
                    <CircleDollarSign className="h-10 w-10 text-red-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-red-600 mb-2">CHF {monthlyLossIfIgnored.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Monatlicher Verlust ohne Änderung' : 'Monthly loss without change'}</p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-muted/50 border">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {language === 'de' ? 'Die harte Wahrheit' : 'The hard truth'}
                  </h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? 'Diese Probleme verschwinden nicht von alleine. Sie werden schlimmer.'
                        : 'These problems don\'t go away on their own. They get worse.'}
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? 'Jeder Tag Verzögerung = verlorene Kunden an die Konkurrenz.'
                        : 'Every day of delay = lost customers to competitors.'}
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? 'In 12 Monaten ohne Änderung: CHF ' + (monthlyLossIfIgnored * 12).toLocaleString() + ' verloren.'
                        : 'In 12 months without change: CHF ' + (monthlyLossIfIgnored * 12).toLocaleString() + ' lost.'}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* CONSEQUENCES */}
          <ScrollReveal delay={0.2}>
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{content.consequencesTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{content.consequencesSubtitle}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {consequences.map((item, index) => (
                  <Card key={index} className="border-destructive/20 hover:border-destructive/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-destructive/10 text-destructive flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-bold">
                            <TrendingDown className="h-4 w-4" />
                            {item.loss}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center">
                <Skull className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {language === 'de' ? 'Gesamter geschätzter Verlust' : 'Total Estimated Loss'}
                </h3>
                <div className="text-5xl font-bold text-destructive mb-2">
                  CHF {monthlyLossIfIgnored.toLocaleString()}/Monat
                </div>
                <p className="text-muted-foreground">
                  = CHF {(monthlyLossIfIgnored * 12).toLocaleString()} {language === 'de' ? 'pro Jahr' : 'per year'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* BUSINESS PROJECTION */}
          <ScrollReveal delay={0.25}>
            <Card className="mb-12 border-green-500/30 bg-gradient-to-br from-green-500/5 to-background">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                  <Rocket className="h-8 w-8 text-green-500" />
                  {content.projectionTitle}
                </CardTitle>
                <p className="text-center text-muted-foreground">{content.projectionSubtitle}</p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Before */}
                  <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-destructive/10">
                        <TrendingDown className="h-6 w-6 text-destructive" />
                      </div>
                      <h3 className="text-xl font-bold">{language === 'de' ? 'JETZT (ohne Optimierung)' : 'NOW (without optimization)'}</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Monatliche Besucher' : 'Monthly Visitors'}</span>
                        <span className="font-bold">~2,400</span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Conversion-Rate' : 'Conversion Rate'}</span>
                        <span className="font-bold text-destructive">1.2%</span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Leads/Monat' : 'Leads/Month'}</span>
                        <span className="font-bold">~29</span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Umsatz/Monat' : 'Revenue/Month'}</span>
                        <span className="font-bold">CHF {currentMonthlyRevenue.toLocaleString()}</span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                        <span className="text-destructive font-medium">{language === 'de' ? 'Google-Ranking' : 'Google Ranking'}</span>
                        <span className="font-bold text-destructive">{language === 'de' ? 'Seite 3-5' : 'Page 3-5'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold">{language === 'de' ? 'NACHHER (mit Optimierung)' : 'AFTER (with optimization)'}</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Monatliche Besucher' : 'Monthly Visitors'}</span>
                        <span className="font-bold text-green-500">~8,500 <span className="text-xs">(+254%)</span></span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Conversion-Rate' : 'Conversion Rate'}</span>
                        <span className="font-bold text-green-500">4.8% <span className="text-xs">(+300%)</span></span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Leads/Monat' : 'Leads/Month'}</span>
                        <span className="font-bold text-green-500">~408 <span className="text-xs">(+1,307%)</span></span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Umsatz/Monat' : 'Revenue/Month'}</span>
                        <span className="font-bold text-green-500">CHF {projectedMonthlyRevenue.toLocaleString()} <span className="text-xs">(+170%)</span></span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                        <span className="text-green-600 font-medium">{language === 'de' ? 'Google-Ranking' : 'Google Ranking'}</span>
                        <span className="font-bold text-green-500">Top 3</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
                  <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'de' ? 'Potenzielle Umsatzsteigerung' : 'Potential Revenue Increase'}
                  </h3>
                  <div className="text-5xl font-bold text-green-500 mb-2">
                    +CHF {(projectedMonthlyRevenue - currentMonthlyRevenue).toLocaleString()}/Monat
                  </div>
                  <p className="text-muted-foreground">
                    = +CHF {((projectedMonthlyRevenue - currentMonthlyRevenue) * 12).toLocaleString()} {language === 'de' ? 'pro Jahr' : 'per year'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Category Scores */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        const element = document.getElementById(`category-${category.id}`);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}>
                  <CardContent className="p-4 text-center">
                    <div className={`${category.color} mb-2 flex justify-center`}>
                      {category.icon}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{category.name}</p>
                    <div className="mt-2">
                      <Progress value={category.score} className="h-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {category.issues.length} {language === 'de' ? 'Probleme' : 'Issues'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Detailed Issues by Category */}
          <ScrollReveal delay={0.35}>
            <div className="space-y-6 mb-16">
              {categories.map((category) => (
                <Card key={category.id} id={`category-${category.id}`}>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setExpandedCategories(prev => 
                                prev.includes(category.id) 
                                  ? prev.filter(id => id !== category.id)
                                  : [...prev, category.id]
                              )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.issues.filter(i => i.severity === 'critical').length} kritisch, {' '}
                            {category.issues.filter(i => i.severity === 'warning').length} Warnungen, {' '}
                            {category.issues.filter(i => i.severity === 'info').length} Verbesserungen
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <span className="text-sm text-muted-foreground">
                            {category.issues.reduce((sum, i) => sum + i.hoursToFix, 0)}h | CHF {category.issues.reduce((sum, i) => sum + i.costIfIgnored, 0).toLocaleString()}/Mo
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                            {category.score}/100
                          </span>
                        </div>
                        {expandedCategories.includes(category.id) 
                          ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          : <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedCategories.includes(category.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {category.issues.map((issue) => (
                          <div 
                            key={issue.id} 
                            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="mt-1">
                              {getSeverityIcon(issue.severity)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-medium">{issue.title}</h4>
                                {getSeverityBadge(issue.severity)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs">
                                <span className="text-muted-foreground">
                                  <strong>{content.impactLabel}:</strong> {issue.impact}
                                </span>
                                <span className="text-muted-foreground">
                                  <strong>{content.effortLabel}:</strong> {content.effortLevels[issue.effort]}
                                </span>
                                <span className="text-orange-500 font-medium">
                                  <strong>{content.hoursLabel}:</strong> {issue.hoursToFix}h
                                </span>
                                <span className="text-destructive font-medium">
                                  <strong>{content.costLabel}:</strong> CHF {issue.costIfIgnored}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* FINAL CTA - Two Options */}
          <ScrollReveal delay={0.4}>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{content.finalCtaTitle}</h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Option 1: DIY */}
                <Card className="border-muted hover:border-muted-foreground/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-muted" />
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">{content.option1Title}</h3>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <span>{totalHours} {language === 'de' ? 'Stunden Arbeit' : 'hours of work'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <DollarSign className="h-5 w-5 flex-shrink-0" />
                        <span>CHF {(totalHours * hourlyRate).toLocaleString()} {language === 'de' ? 'Opportunitätskosten' : 'opportunity cost'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Timer className="h-5 w-5 flex-shrink-0" />
                        <span>{Math.ceil(totalHours / 40)}+ {language === 'de' ? 'Wochen Vollzeit' : 'weeks full-time'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span>{language === 'de' ? 'Lernkurve & Fehlerrisiko' : 'Learning curve & error risk'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Ban className="h-5 w-5 flex-shrink-0" />
                        <span>{language === 'de' ? 'Keine Garantie' : 'No guarantee'}</span>
                      </li>
                    </ul>

                    <Button variant="outline" className="w-full" size="lg" onClick={generatePDF}>
                      <Download className="mr-2 h-5 w-5" />
                      {language === 'de' ? 'Report herunterladen & selbst starten' : 'Download report & start yourself'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Option 2: Done for you */}
                <Card className="border-primary/50 hover:border-primary transition-colors relative overflow-hidden shadow-lg shadow-primary/10">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-green-500" />
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      {language === 'de' ? 'Empfohlen' : 'Recommended'}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">{content.option2Title}</h3>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Alles in 2-4 Wochen erledigt' : 'Everything done in 2-4 weeks'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Experten-Implementierung' : 'Expert implementation'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Keine Fehler, keine Lernkurve' : 'No errors, no learning curve'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Garantierte Resultate' : 'Guaranteed results'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Laufende Optimierung inkl.' : 'Ongoing optimization incl.'}</span>
                      </li>
                    </ul>

                    <CTAButton size="lg" href="/call" className="w-full text-lg">
                      <Target className="mr-2 h-5 w-5" />
                      {language === 'de' ? 'Kostenloses Beratungsgespräch' : 'Free consultation call'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </CTAButton>
                    
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {language === 'de' ? '15 Min. Gespräch • Unverbindlich • Individuelles Angebot' : '15 min call • No obligation • Custom quote'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Die Frage ist nicht OB Sie optimieren sollten — die Analyse zeigt klar, dass Sie müssen. Die Frage ist nur: Wie lange können Sie es sich leisten, CHF ' + monthlyLossIfIgnored.toLocaleString() + ' pro Monat zu verlieren?'
                  : 'The question is not IF you should optimize — the analysis clearly shows you must. The question is: How long can you afford to lose CHF ' + monthlyLossIfIgnored.toLocaleString() + ' per month?'}
              </p>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </Layout>
  );
};

export default AnalysisResultsDemo;
