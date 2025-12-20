import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CTAButton } from '@/components/CTAButton';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Search, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  FileText, 
  Image, 
  Link2, 
  Code, 
  Database,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Star,
  Share2,
  Lock,
  Gauge,
  Layers,
  Eye,
  MousePointer,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertOctagon,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  effort: 'low' | 'medium' | 'high';
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
    effortLevels: {
      low: language === 'de' ? 'Gering' : 'Low',
      medium: language === 'de' ? 'Mittel' : 'Medium',
      high: language === 'de' ? 'Hoch' : 'High'
    },
    ctaTitle: language === 'de' ? 'Überwältigt von den Ergebnissen?' : 'Overwhelmed by the Results?',
    ctaSubtitle: language === 'de' 
      ? 'Kein Problem! Unser Experten-Team implementiert alle Optimierungen für Sie.' 
      : 'No problem! Our expert team implements all optimizations for you.',
    ctaButton: language === 'de' ? 'Implementierung anfragen' : 'Request Implementation',
    estimatedTime: language === 'de' ? 'Geschätzte Implementierungszeit' : 'Estimated Implementation Time',
    estimatedValue: language === 'de' ? 'Geschätzter Mehrwert' : 'Estimated Added Value',
    perMonth: language === 'de' ? '/ Monat' : '/ month',
    disclaimer: language === 'de' 
      ? 'Dies ist eine Demo-Ansicht. Starten Sie Ihre kostenlose Analyse für echte Ergebnisse.'
      : 'This is a demo view. Start your free analysis for real results.',
    startAnalysis: language === 'de' ? 'Eigene Analyse starten' : 'Start Your Analysis'
  };

  const categories: Category[] = [
    {
      id: 'seo',
      name: 'SEO & Sichtbarkeit',
      icon: <Search className="h-5 w-5" />,
      score: 28,
      color: 'text-red-500',
      issues: [
        { id: 'seo-1', title: 'Fehlende Meta-Beschreibungen', description: '12 Seiten haben keine Meta-Description', severity: 'critical', impact: 'Reduziert Click-Through-Rate um bis zu 30%', effort: 'low' },
        { id: 'seo-2', title: 'Duplicate Title Tags', description: '8 Seiten haben identische Titel', severity: 'critical', impact: 'Verwirrung bei Suchmaschinen', effort: 'low' },
        { id: 'seo-3', title: 'Fehlende H1-Überschriften', description: '5 Seiten ohne Hauptüberschrift', severity: 'critical', impact: 'Schlechte Keyword-Zuordnung', effort: 'low' },
        { id: 'seo-4', title: 'Broken Internal Links', description: '23 interne Links führen zu 404-Seiten', severity: 'critical', impact: 'Verlust von Link-Juice und schlechte UX', effort: 'medium' },
        { id: 'seo-5', title: 'Fehlende Alt-Texte', description: '47 Bilder ohne Alt-Attribut', severity: 'warning', impact: 'Verpasste Bildsuche-Optimierung', effort: 'medium' },
        { id: 'seo-6', title: 'Thin Content', description: '6 Seiten mit weniger als 300 Wörtern', severity: 'warning', impact: 'Geringe Ranking-Chancen', effort: 'high' },
        { id: 'seo-7', title: 'Fehlende Canonical Tags', description: 'Keine Canonical-URLs definiert', severity: 'warning', impact: 'Mögliche Duplicate Content Probleme', effort: 'low' },
        { id: 'seo-8', title: 'Keine XML-Sitemap', description: 'Sitemap fehlt oder ist fehlerhaft', severity: 'warning', impact: 'Schlechtere Indexierung', effort: 'low' },
        { id: 'seo-9', title: 'Robots.txt Probleme', description: 'Wichtige Seiten werden blockiert', severity: 'critical', impact: 'Seiten werden nicht indexiert', effort: 'low' },
        { id: 'seo-10', title: 'Keine strukturierten Daten', description: 'Schema.org Markup fehlt komplett', severity: 'warning', impact: 'Keine Rich Snippets möglich', effort: 'medium' },
        { id: 'seo-11', title: 'Keyword-Kannibalisierung', description: '4 Seiten konkurrieren um gleiche Keywords', severity: 'warning', impact: 'Verwässerte Rankings', effort: 'high' },
        { id: 'seo-12', title: 'Fehlende Open Graph Tags', description: 'Social Media Preview fehlt', severity: 'info', impact: 'Schlechte Social Shares', effort: 'low' },
        { id: 'seo-13', title: 'URL-Struktur suboptimal', description: 'URLs zu lang und nicht sprechend', severity: 'info', impact: 'Schlechtere User-Wahrnehmung', effort: 'medium' },
        { id: 'seo-14', title: 'Keine Breadcrumb-Navigation', description: 'Breadcrumbs fehlen auf allen Seiten', severity: 'info', impact: 'Schlechtere interne Verlinkung', effort: 'medium' }
      ]
    },
    {
      id: 'performance',
      name: 'Performance & Geschwindigkeit',
      icon: <Zap className="h-5 w-5" />,
      score: 31,
      color: 'text-orange-500',
      issues: [
        { id: 'perf-1', title: 'Extrem langsame Ladezeit', description: 'First Contentful Paint: 6.2s (Ziel: <1.8s)', severity: 'critical', impact: '53% der Nutzer verlassen die Seite', effort: 'high' },
        { id: 'perf-2', title: 'Largest Contentful Paint', description: 'LCP: 8.4s (Ziel: <2.5s)', severity: 'critical', impact: 'Massiver Ranking-Nachteil', effort: 'high' },
        { id: 'perf-3', title: 'Cumulative Layout Shift', description: 'CLS: 0.42 (Ziel: <0.1)', severity: 'critical', impact: 'Frustration bei Nutzern', effort: 'medium' },
        { id: 'perf-4', title: 'Nicht optimierte Bilder', description: '34 Bilder nicht komprimiert (12.4 MB)', severity: 'critical', impact: 'Verlängert Ladezeit massiv', effort: 'medium' },
        { id: 'perf-5', title: 'Kein Browser-Caching', description: 'Cache-Header fehlen komplett', severity: 'warning', impact: 'Jeder Besuch lädt alles neu', effort: 'low' },
        { id: 'perf-6', title: 'Render-Blocking Resources', description: '8 CSS/JS Dateien blockieren Rendering', severity: 'warning', impact: 'Verzögerter First Paint', effort: 'medium' },
        { id: 'perf-7', title: 'Keine GZIP-Komprimierung', description: 'Server-Komprimierung deaktiviert', severity: 'warning', impact: '70% größere Dateien', effort: 'low' },
        { id: 'perf-8', title: 'Zu viele HTTP-Requests', description: '94 Requests pro Seitenaufruf', severity: 'warning', impact: 'Erhöhte Latenz', effort: 'high' },
        { id: 'perf-9', title: 'Kein Lazy Loading', description: 'Alle Bilder werden sofort geladen', severity: 'warning', impact: 'Unnötige Datenlast', effort: 'low' },
        { id: 'perf-10', title: 'Unoptimiertes JavaScript', description: '2.3 MB unkomprimiertes JS', severity: 'critical', impact: 'Lange Parse-Zeit auf Mobil', effort: 'high' },
        { id: 'perf-11', title: 'Keine CDN-Nutzung', description: 'Assets werden nicht über CDN ausgeliefert', severity: 'info', impact: 'Langsamere globale Ladezeiten', effort: 'medium' },
        { id: 'perf-12', title: 'Fehlende Preconnect Hints', description: 'Externe Domains ohne Preconnect', severity: 'info', impact: 'Verzögerte Third-Party Loads', effort: 'low' }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Optimierung',
      icon: <Smartphone className="h-5 w-5" />,
      score: 42,
      color: 'text-yellow-500',
      issues: [
        { id: 'mob-1', title: 'Nicht responsive Design', description: '14 Elemente passen nicht auf Mobile', severity: 'critical', impact: '68% der Nutzer sind mobil', effort: 'high' },
        { id: 'mob-2', title: 'Touch-Targets zu klein', description: '23 Buttons/Links unter 48x48px', severity: 'warning', impact: 'Frustrierende Bedienung', effort: 'medium' },
        { id: 'mob-3', title: 'Text zu klein', description: 'Schriftgröße unter 16px auf Mobil', severity: 'warning', impact: 'Schlechte Lesbarkeit', effort: 'low' },
        { id: 'mob-4', title: 'Horizontales Scrollen', description: 'Seite breiter als Viewport', severity: 'critical', impact: 'Inhalte nicht sichtbar', effort: 'medium' },
        { id: 'mob-5', title: 'Fehlender Viewport Meta-Tag', description: 'Viewport nicht korrekt definiert', severity: 'critical', impact: 'Seite wird falsch skaliert', effort: 'low' },
        { id: 'mob-6', title: 'Flash-Inhalte', description: '2 Flash-Elemente gefunden', severity: 'critical', impact: 'Funktioniert nicht auf Mobil', effort: 'medium' },
        { id: 'mob-7', title: 'Pop-ups blockieren Inhalt', description: 'Interstitials auf Mobil problematisch', severity: 'warning', impact: 'Google-Penalty möglich', effort: 'low' },
        { id: 'mob-8', title: 'Langsame Mobile-Ladezeit', description: 'Mobile Score: 23/100', severity: 'critical', impact: 'Hohe Absprungrate', effort: 'high' }
      ]
    },
    {
      id: 'security',
      name: 'Sicherheit & Datenschutz',
      icon: <Shield className="h-5 w-5" />,
      score: 38,
      color: 'text-red-600',
      issues: [
        { id: 'sec-1', title: 'Kein HTTPS', description: 'Seite nicht über SSL gesichert', severity: 'critical', impact: '"Nicht sicher" Warnung im Browser', effort: 'medium' },
        { id: 'sec-2', title: 'Mixed Content', description: '18 HTTP-Ressourcen auf HTTPS-Seite', severity: 'critical', impact: 'SSL-Warnung trotz Zertifikat', effort: 'medium' },
        { id: 'sec-3', title: 'Fehlende Security Headers', description: 'CSP, HSTS, X-Frame-Options fehlen', severity: 'warning', impact: 'Anfällig für Angriffe', effort: 'low' },
        { id: 'sec-4', title: 'Outdated Software', description: 'WordPress 4.9, PHP 7.1', severity: 'critical', impact: 'Bekannte Sicherheitslücken', effort: 'high' },
        { id: 'sec-5', title: 'Cookie-Banner fehlt', description: 'Keine DSGVO-konforme Cookie-Einwilligung', severity: 'critical', impact: 'Rechtliche Konsequenzen möglich', effort: 'medium' },
        { id: 'sec-6', title: 'Impressum unvollständig', description: 'Pflichtangaben fehlen', severity: 'warning', impact: 'Abmahnrisiko', effort: 'low' },
        { id: 'sec-7', title: 'Datenschutzerklärung veraltet', description: 'Nicht DSGVO-konform', severity: 'warning', impact: 'Rechtliche Konsequenzen', effort: 'medium' },
        { id: 'sec-8', title: 'Offene Admin-Seiten', description: 'Login-Seite öffentlich indexiert', severity: 'warning', impact: 'Brute-Force Risiko', effort: 'low' },
        { id: 'sec-9', title: 'Keine Backup-Strategie', description: 'Kein automatisches Backup erkennbar', severity: 'info', impact: 'Datenverlust-Risiko', effort: 'medium' }
      ]
    },
    {
      id: 'ux',
      name: 'User Experience & Design',
      icon: <Users className="h-5 w-5" />,
      score: 45,
      color: 'text-orange-400',
      issues: [
        { id: 'ux-1', title: 'Keine klare Call-to-Action', description: 'Hauptziel der Seite unklar', severity: 'critical', impact: 'Niedrige Conversion-Rate', effort: 'medium' },
        { id: 'ux-2', title: 'Veraltetes Design', description: 'Design-Trends von 2015', severity: 'warning', impact: 'Wirkt unprofessionell', effort: 'high' },
        { id: 'ux-3', title: 'Inkonsistente Navigation', description: 'Menü variiert zwischen Seiten', severity: 'warning', impact: 'Verwirrende Bedienung', effort: 'medium' },
        { id: 'ux-4', title: 'Fehlende Suchfunktion', description: 'Keine Suche für 200+ Seiten', severity: 'warning', impact: 'Nutzer finden Inhalte nicht', effort: 'medium' },
        { id: 'ux-5', title: 'Lange Formulare', description: 'Kontaktformular mit 12 Feldern', severity: 'warning', impact: 'Hohe Abbruchrate', effort: 'low' },
        { id: 'ux-6', title: 'Keine Fehlerbehandlung', description: 'Formular-Fehler nicht erklärt', severity: 'info', impact: 'Frustrierte Nutzer', effort: 'low' },
        { id: 'ux-7', title: 'Schlechter Farbkontrast', description: '8 Texte unter WCAG AA', severity: 'warning', impact: 'Barrierefreiheit-Probleme', effort: 'low' },
        { id: 'ux-8', title: 'Kein Fokus-State', description: 'Keyboard-Navigation unmöglich', severity: 'info', impact: 'Barrierefreiheit-Probleme', effort: 'low' },
        { id: 'ux-9', title: 'Auto-Play Videos', description: '3 Videos starten automatisch', severity: 'warning', impact: 'Störend für Nutzer', effort: 'low' },
        { id: 'ux-10', title: 'Keine 404-Seite', description: 'Standard-Server-Fehlerseite', severity: 'info', impact: 'Verlorene Nutzer', effort: 'low' }
      ]
    },
    {
      id: 'content',
      name: 'Content & Konversion',
      icon: <FileText className="h-5 w-5" />,
      score: 35,
      color: 'text-purple-500',
      issues: [
        { id: 'cont-1', title: 'Keine Trust-Elemente', description: 'Keine Kundenbewertungen, Zertifikate', severity: 'critical', impact: 'Geringes Vertrauen', effort: 'medium' },
        { id: 'cont-2', title: 'Fehlende Social Proof', description: 'Keine Testimonials oder Case Studies', severity: 'warning', impact: 'Schwache Überzeugungskraft', effort: 'medium' },
        { id: 'cont-3', title: 'Preise nicht transparent', description: 'Kein Pricing auf der Website', severity: 'warning', impact: 'Nutzer brechen ab', effort: 'low' },
        { id: 'cont-4', title: 'Veraltete Inhalte', description: '15 Seiten zuletzt 2021 aktualisiert', severity: 'warning', impact: 'Wirkt vernachlässigt', effort: 'high' },
        { id: 'cont-5', title: 'Keine FAQ-Sektion', description: 'Häufige Fragen unbeantwortet', severity: 'info', impact: 'Mehr Support-Anfragen', effort: 'medium' },
        { id: 'cont-6', title: 'Fehlende USPs', description: 'Alleinstellungsmerkmale nicht klar', severity: 'critical', impact: 'Warum sollte man Sie wählen?', effort: 'medium' },
        { id: 'cont-7', title: 'Kein Blog', description: 'Keine regelmäßigen Inhalte', severity: 'info', impact: 'Verpasste SEO-Chancen', effort: 'high' },
        { id: 'cont-8', title: 'Schwache Headlines', description: 'Überschriften nicht überzeugend', severity: 'warning', impact: 'Nutzer lesen nicht weiter', effort: 'low' },
        { id: 'cont-9', title: 'Keine Lead-Magnete', description: 'Kein Anreiz für E-Mail-Signup', severity: 'info', impact: 'Keine Lead-Generierung', effort: 'medium' }
      ]
    },
    {
      id: 'local',
      name: 'Local SEO & Google',
      icon: <MapPin className="h-5 w-5" />,
      score: 22,
      color: 'text-red-500',
      issues: [
        { id: 'loc-1', title: 'Kein Google Business Profil', description: 'Nicht in Google Maps gelistet', severity: 'critical', impact: 'Unsichtbar für lokale Suchen', effort: 'medium' },
        { id: 'loc-2', title: 'NAP-Inkonsistenz', description: 'Unterschiedliche Adressen online', severity: 'critical', impact: 'Verwirrung bei Google', effort: 'high' },
        { id: 'loc-3', title: 'Keine lokalen Keywords', description: 'Standort nicht in Texten erwähnt', severity: 'warning', impact: 'Schlechtes lokales Ranking', effort: 'low' },
        { id: 'loc-4', title: 'Keine Bewertungen', description: '0 Google-Rezensionen', severity: 'critical', impact: 'Weniger Vertrauen, schlechteres Ranking', effort: 'high' },
        { id: 'loc-5', title: 'Fehlende LocalBusiness Schema', description: 'Keine strukturierten lokalen Daten', severity: 'warning', impact: 'Keine Rich Snippets', effort: 'low' },
        { id: 'loc-6', title: 'Keine lokalen Backlinks', description: 'Keine Verlinkungen aus der Region', severity: 'info', impact: 'Schwächere lokale Autorität', effort: 'high' },
        { id: 'loc-7', title: 'Keine Standort-Seiten', description: 'Bei mehreren Standorten: separate Seiten fehlen', severity: 'info', impact: 'Verpasste Ranking-Chancen', effort: 'medium' }
      ]
    },
    {
      id: 'technical',
      name: 'Technische Infrastruktur',
      icon: <Code className="h-5 w-5" />,
      score: 29,
      color: 'text-gray-500',
      issues: [
        { id: 'tech-1', title: 'Langsamer Hosting-Server', description: 'TTFB: 2.3s (Ziel: <200ms)', severity: 'critical', impact: 'Alles ist langsam', effort: 'high' },
        { id: 'tech-2', title: 'Keine Redirects für www', description: 'www und non-www beide erreichbar', severity: 'warning', impact: 'Duplicate Content', effort: 'low' },
        { id: 'tech-3', title: 'Veraltete jQuery-Version', description: 'jQuery 1.12 mit Sicherheitslücken', severity: 'warning', impact: 'Sicherheitsrisiko', effort: 'medium' },
        { id: 'tech-4', title: 'Keine Lazy Loading für Iframes', description: 'YouTube-Videos laden sofort', severity: 'info', impact: 'Langsame Seitenladung', effort: 'low' },
        { id: 'tech-5', title: 'Zu viele Plugins', description: '34 aktive WordPress-Plugins', severity: 'warning', impact: 'Konflikte und Langsamkeit', effort: 'high' },
        { id: 'tech-6', title: 'Keine Staging-Umgebung', description: 'Änderungen direkt auf Live', severity: 'info', impact: 'Risiko bei Updates', effort: 'medium' },
        { id: 'tech-7', title: 'Database nicht optimiert', description: 'Post-Revisionen: 2,847 Einträge', severity: 'info', impact: 'Langsame Queries', effort: 'low' },
        { id: 'tech-8', title: 'Kein Error Logging', description: 'Fehler werden nicht protokolliert', severity: 'info', impact: 'Probleme unentdeckt', effort: 'low' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & Tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      score: 18,
      color: 'text-red-600',
      issues: [
        { id: 'ana-1', title: 'Kein Analytics installiert', description: 'Keine Daten über Besucher', severity: 'critical', impact: 'Keine datenbasierte Optimierung möglich', effort: 'low' },
        { id: 'ana-2', title: 'Kein Conversion-Tracking', description: 'Kontaktformular-Absendungen nicht gemessen', severity: 'critical', impact: 'ROI nicht messbar', effort: 'low' },
        { id: 'ana-3', title: 'Keine Heatmaps', description: 'Nutzerverhalten unbekannt', severity: 'info', impact: 'Verpasste Optimierungen', effort: 'low' },
        { id: 'ana-4', title: 'Kein Search Console', description: 'Nicht in Google Search Console', severity: 'critical', impact: 'Keine SEO-Insights', effort: 'low' },
        { id: 'ana-5', title: 'Keine Ziele definiert', description: 'Analytics ohne Ziel-Tracking', severity: 'warning', impact: 'Keine Conversion-Daten', effort: 'low' },
        { id: 'ana-6', title: 'Kein Facebook Pixel', description: 'Remarketing nicht möglich', severity: 'info', impact: 'Werbe-Chancen verpasst', effort: 'low' }
      ]
    },
    {
      id: 'social',
      name: 'Social Media Integration',
      icon: <Share2 className="h-5 w-5" />,
      score: 25,
      color: 'text-blue-500',
      issues: [
        { id: 'soc-1', title: 'Keine Social Links', description: 'Social Media Profile nicht verlinkt', severity: 'warning', impact: 'Verpasste Reichweite', effort: 'low' },
        { id: 'soc-2', title: 'Keine Share-Buttons', description: 'Inhalte nicht teilbar', severity: 'info', impact: 'Weniger virales Potenzial', effort: 'low' },
        { id: 'soc-3', title: 'Open Graph fehlt', description: 'Schlechte Social Previews', severity: 'warning', impact: 'Weniger Klicks aus Social', effort: 'low' },
        { id: 'soc-4', title: 'Twitter Cards fehlen', description: 'Keine Twitter-Vorschau', severity: 'info', impact: 'Schlechtere Twitter-Shares', effort: 'low' },
        { id: 'soc-5', title: 'Keine Social Proof', description: 'Follower-Zahlen nicht gezeigt', severity: 'info', impact: 'Weniger Vertrauen', effort: 'low' }
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

  const getProgressColor = (score: number) => {
    if (score < 30) return 'bg-destructive';
    if (score < 50) return 'bg-yellow-500';
    if (score < 70) return 'bg-orange-400';
    return 'bg-green-500';
  };

  return (
    <Layout>
      <SEOHead
        title={`${content.title} | Digital Marketing Agentur`}
        description="Vollständiger Website-Analyse-Report mit detaillierten Verbesserungsvorschlägen für SEO, Performance, Sicherheit und mehr."
        canonical="/analyse-ergebnis-demo"
      />

      {/* Demo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3 text-sm">
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
            <div className="text-center mb-12">
              <p className="text-muted-foreground mb-2">{content.subtitle}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {content.demoSite}
              </h1>
              <p className="text-sm text-muted-foreground">
                Analysiert am {new Date().toLocaleDateString('de-CH')}
              </p>
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

          {/* Category Scores */}
          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-5 gap-4 mb-12">
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
          <ScrollReveal delay={0.3}>
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
                              <div className="flex items-center gap-2 mb-1">
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

          {/* Overwhelming CTA */}
          <ScrollReveal delay={0.4}>
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 md:p-12 text-center">
                <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.ctaTitle}</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {content.ctaSubtitle}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto mb-8">
                  <div className="bg-background/50 rounded-lg p-4">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{content.estimatedTime}</p>
                    <p className="text-xl font-bold">2-4 {language === 'de' ? 'Wochen' : 'Weeks'}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{content.estimatedValue}</p>
                    <p className="text-xl font-bold">+CHF 5'000 - 15'000 {content.perMonth}</p>
                  </div>
                </div>

                <CTAButton size="lg" href="/call" className="text-lg px-12">
                  {content.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </CTAButton>
              </CardContent>
            </Card>
          </ScrollReveal>

        </div>
      </div>
    </Layout>
  );
};

export default AnalysisResultsDemo;
