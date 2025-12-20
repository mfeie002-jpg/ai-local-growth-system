import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { 
  Globe, 
  Search, 
  Code, 
  Palette, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScanResult {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  score: number;
  status: 'good' | 'warning' | 'error';
  items: { label: string; status: 'good' | 'warning' | 'error' }[];
}

export function AIScannerDemo() {
  const { isEnglish } = useLanguage();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const scanRef = useRef<HTMLDivElement>(null);

  const content = isEnglish ? {
    placeholder: 'Enter your website URL...',
    button: 'Start AI Analysis',
    scanning: 'Analyzing...',
    phases: [
      'Connecting to server...',
      'Scanning page structure...',
      'Analyzing SEO factors...',
      'Checking performance metrics...',
      'Evaluating UX patterns...',
      'Reviewing security...',
      'Generating insights...',
      'Compiling results...',
    ],
    complete: 'Analysis Complete!',
    tryAgain: 'Analyze Another Site',
    overallScore: 'Overall Score',
    getFullReport: 'Get Full Report',
  } : {
    placeholder: 'Gib deine Website-URL ein...',
    button: 'KI-Analyse starten',
    scanning: 'Analysiere...',
    phases: [
      'Verbinde mit Server...',
      'Scanne Seitenstruktur...',
      'Analysiere SEO-Faktoren...',
      'Prüfe Performance-Metriken...',
      'Evaluiere UX-Patterns...',
      'Überprüfe Sicherheit...',
      'Generiere Insights...',
      'Stelle Ergebnisse zusammen...',
    ],
    complete: 'Analyse abgeschlossen!',
    tryAgain: 'Andere Seite analysieren',
    overallScore: 'Gesamtscore',
    getFullReport: 'Vollständigen Report holen',
  };

  const demoResults: ScanResult[] = isEnglish ? [
    {
      category: 'SEO',
      icon: Search,
      score: 72,
      status: 'warning',
      items: [
        { label: 'Meta titles optimized', status: 'good' },
        { label: 'Missing H1 on 3 pages', status: 'error' },
        { label: 'Alt text coverage 68%', status: 'warning' },
        { label: 'Sitemap present', status: 'good' },
      ],
    },
    {
      category: 'Performance',
      icon: Zap,
      score: 58,
      status: 'error',
      items: [
        { label: 'LCP: 3.2s (needs work)', status: 'error' },
        { label: 'FID: 45ms (good)', status: 'good' },
        { label: 'CLS: 0.18 (needs work)', status: 'warning' },
        { label: 'Images not optimized', status: 'error' },
      ],
    },
    {
      category: 'UX/Design',
      icon: Palette,
      score: 81,
      status: 'good',
      items: [
        { label: 'Mobile responsive', status: 'good' },
        { label: 'CTA visibility good', status: 'good' },
        { label: 'Form UX needs work', status: 'warning' },
        { label: 'Navigation clear', status: 'good' },
      ],
    },
    {
      category: 'Technical',
      icon: Code,
      score: 67,
      status: 'warning',
      items: [
        { label: 'HTTPS enabled', status: 'good' },
        { label: 'No schema markup', status: 'error' },
        { label: 'Robots.txt present', status: 'good' },
        { label: 'Mixed content issues', status: 'warning' },
      ],
    },
    {
      category: 'Security',
      icon: Shield,
      score: 85,
      status: 'good',
      items: [
        { label: 'SSL valid', status: 'good' },
        { label: 'No XSS vulnerabilities', status: 'good' },
        { label: 'CSP header missing', status: 'warning' },
        { label: 'Secure cookies', status: 'good' },
      ],
    },
  ] : [
    {
      category: 'SEO',
      icon: Search,
      score: 72,
      status: 'warning',
      items: [
        { label: 'Meta-Titel optimiert', status: 'good' },
        { label: 'H1 fehlt auf 3 Seiten', status: 'error' },
        { label: 'Alt-Text Abdeckung 68%', status: 'warning' },
        { label: 'Sitemap vorhanden', status: 'good' },
      ],
    },
    {
      category: 'Performance',
      icon: Zap,
      score: 58,
      status: 'error',
      items: [
        { label: 'LCP: 3.2s (Verbesserung nötig)', status: 'error' },
        { label: 'FID: 45ms (gut)', status: 'good' },
        { label: 'CLS: 0.18 (Verbesserung nötig)', status: 'warning' },
        { label: 'Bilder nicht optimiert', status: 'error' },
      ],
    },
    {
      category: 'UX/Design',
      icon: Palette,
      score: 81,
      status: 'good',
      items: [
        { label: 'Mobile responsive', status: 'good' },
        { label: 'CTA-Sichtbarkeit gut', status: 'good' },
        { label: 'Formular-UX verbesserbar', status: 'warning' },
        { label: 'Navigation klar', status: 'good' },
      ],
    },
    {
      category: 'Technisch',
      icon: Code,
      score: 67,
      status: 'warning',
      items: [
        { label: 'HTTPS aktiviert', status: 'good' },
        { label: 'Kein Schema-Markup', status: 'error' },
        { label: 'Robots.txt vorhanden', status: 'good' },
        { label: 'Mixed Content Issues', status: 'warning' },
      ],
    },
    {
      category: 'Sicherheit',
      icon: Shield,
      score: 85,
      status: 'good',
      items: [
        { label: 'SSL gültig', status: 'good' },
        { label: 'Keine XSS-Schwachstellen', status: 'good' },
        { label: 'CSP-Header fehlt', status: 'warning' },
        { label: 'Sichere Cookies', status: 'good' },
      ],
    },
  ];

  const startScan = () => {
    if (!url) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setResults([]);
    setCurrentPhase(content.phases[0]);

    // Simulate scanning phases
    let phase = 0;
    const phaseInterval = setInterval(() => {
      phase++;
      if (phase < content.phases.length) {
        setCurrentPhase(content.phases[phase]);
      }
    }, 600);

    // Progress animation
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(phaseInterval);
          setIsScanning(false);
          setScanComplete(true);
          setResults(demoResults);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetScan = () => {
    setUrl('');
    setScanProgress(0);
    setScanComplete(false);
    setResults([]);
    setCurrentPhase('');
  };

  const overallScore = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div ref={scanRef} className="max-w-4xl mx-auto">
      {/* Scanner Interface */}
      <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
        {/* Scanner Header */}
        <div className="p-6 bg-gradient-to-r from-ai/10 to-primary/10 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ai/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-ai" />
            </div>
            <div>
              <h3 className="font-bold font-display">AI Website Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish ? 'Powered by itsFeierabend AI' : 'Powered by itsFeierabend AI'}
              </p>
            </div>
          </div>
          
          {/* URL Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder={content.placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 bg-background/50"
                disabled={isScanning}
              />
            </div>
            <Button
              onClick={scanComplete ? resetScan : startScan}
              disabled={isScanning || (!url && !scanComplete)}
              className={cn(
                "h-12 px-6 font-medium",
                isScanning && "animate-pulse"
              )}
            >
              {isScanning ? content.scanning : scanComplete ? content.tryAgain : content.button}
            </Button>
          </div>
        </div>

        {/* Scanner Body */}
        <div className="p-6">
          {/* Scanning Animation */}
          {isScanning && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentPhase}</span>
                  <span className="text-primary font-medium">{scanProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-ai transition-all duration-300 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              {/* Scanning Lines Animation */}
              <div className="relative h-40 rounded-xl bg-muted/30 overflow-hidden">
                <div className="absolute inset-0 flex flex-col gap-2 p-4">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="h-4 bg-primary/20 rounded animate-pulse"
                      style={{ 
                        width: `${60 + Math.random() * 40}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
                {/* Scan line */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ai to-transparent opacity-70"
                  style={{
                    top: `${(scanProgress % 100)}%`,
                    boxShadow: '0 0 20px hsl(var(--ai))'
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {scanComplete && results.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              {/* Overall Score */}
              <div className="flex items-center justify-center p-6 rounded-xl bg-muted/30">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{content.overallScore}</p>
                  <div className={cn(
                    "text-6xl font-bold font-display",
                    getScoreColor(overallScore)
                  )}>
                    {overallScore}
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>

              {/* Category Results */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-muted/20 border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <result.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{result.category}</span>
                      </div>
                      <span className={cn("font-bold", getScoreColor(result.score))}>
                        {result.score}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {result.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getStatusIcon(item.status)}
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {isEnglish 
                    ? 'This is a preview. Get the full analysis with implementation prompts.'
                    : 'Dies ist eine Vorschau. Hole die volle Analyse mit Implementierungs-Prompts.'}
                </p>
                <Button asChild className="glow-ai">
                  <a href={isEnglish ? '/en/free-audit' : '/gratis-audit'}>
                    {content.getFullReport}
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!isScanning && !scanComplete && (
            <div className="py-12 text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {isEnglish 
                  ? 'Enter a URL above to see our AI in action'
                  : 'Gib oben eine URL ein, um unsere KI in Aktion zu sehen'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
