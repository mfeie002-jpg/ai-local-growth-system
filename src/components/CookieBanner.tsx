import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/i18n/LanguageContext';
import { 
  getConsent, 
  acceptAll, 
  acceptNecessaryOnly, 
  setConsent,
  type ConsentPreferences 
} from '@/lib/consent';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const { isEnglish } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const isDE = !isEnglish;

  useEffect(() => {
    // Check if consent has been given
    const consent = getConsent();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !dialogRef.current) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    const focusableSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusables = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled'));

    focusables()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSettings) {
        setShowSettings(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isVisible, showSettings]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setConsent(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => {}}
      />

      {/* Banner */}
      <div ref={dialogRef} className={cn(
        'relative w-full max-w-lg bg-card border border-border rounded-xl shadow-xl p-6 animate-in fade-in slide-in-from-bottom-4',
        showSettings && 'max-w-md'
      )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-dialog-title"
        aria-describedby={showSettings ? undefined : 'cookie-dialog-description'}
      >
        {showSettings ? (
          // Settings View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 id="cookie-dialog-title" className="text-lg font-semibold text-foreground">
                {isDE ? 'Cookie-Einstellungen' : 'Cookie Settings'}
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                className="min-h-11 min-w-11"
                onClick={() => setShowSettings(false)}
                aria-label={isDE ? 'Cookie-Einstellungen schliessen' : 'Close cookie settings'}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Necessary - Always on */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label htmlFor="consent-necessary" className="font-medium">
                    {isDE ? 'Notwendig' : 'Necessary'}
                  </Label>
                  <p id="consent-necessary-description" className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Für die Grundfunktionen der Website erforderlich.'
                      : 'Required for basic website functionality.'}
                  </p>
                </div>
                <Switch id="consent-necessary" checked disabled aria-describedby="consent-necessary-description" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label htmlFor="consent-analytics" className="font-medium">
                    {isDE ? 'Analyse' : 'Analytics'}
                  </Label>
                  <p id="consent-analytics-description" className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Hilft uns, die Website zu verbessern.'
                      : 'Helps us improve the website.'}
                  </p>
                </div>
                <Switch
                  id="consent-analytics"
                  aria-describedby="consent-analytics-description"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label htmlFor="consent-marketing" className="font-medium">
                    {isDE ? 'Marketing' : 'Marketing'}
                  </Label>
                  <p id="consent-marketing-description" className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Für personalisierte Werbung.'
                      : 'For personalized advertising.'}
                  </p>
                </div>
                <Switch
                  id="consent-marketing"
                  aria-describedby="consent-marketing-description"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSettings(false)}
              >
                {isDE ? 'Abbrechen' : 'Cancel'}
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSavePreferences}
              >
                {isDE ? 'Speichern' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          // Main Banner View
          <div className="space-y-4">
            <div>
              <h3 id="cookie-dialog-title" className="text-lg font-semibold text-foreground mb-2">
                {isDE ? 'Cookies & Datenschutz' : 'Cookies & Privacy'}
              </h3>
              <p id="cookie-dialog-description" className="text-sm text-muted-foreground">
                {isDE 
                  ? 'Wir verwenden optionale Cookies für Analyse und Marketing. Sie entscheiden, welche Sie zulassen.'
                  : 'We use cookies for analytics and marketing. You can choose which ones you want to allow.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAcceptAll}
              >
                {isDE ? 'Alle akzeptieren' : 'Accept all'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAcceptNecessary}
              >
                {isDE ? 'Nur notwendige' : 'Necessary only'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11"
                onClick={() => setShowSettings(true)}
                title={isDE ? 'Einstellungen' : 'Settings'}
                aria-label={isDE ? 'Cookie-Einstellungen öffnen' : 'Open cookie settings'}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              <Link
                to={isDE ? '/datenschutz' : '/en/privacy'}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {isDE
                  ? 'Details finden Sie in unserer Datenschutzerklärung.'
                  : 'Details are available in our privacy policy.'}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
