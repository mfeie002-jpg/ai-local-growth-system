import { useState, useEffect } from 'react';
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
import { initGA4 } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const { isEnglish } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  const isDE = !isEnglish;

  useEffect(() => {
    // Check if consent has been given
    const consent = getConsent();
    if (!consent) {
      setIsVisible(true);
    } else {
      // Initialize GA4 if analytics consent was given
      if (consent.analytics) {
        initGA4();
      }
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    initGA4();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setConsent(preferences);
    if (preferences.analytics) {
      initGA4();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => {}}
      />

      {/* Banner */}
      <div className={cn(
        'relative w-full max-w-lg bg-card border border-border rounded-xl shadow-xl p-6 animate-in fade-in slide-in-from-bottom-4',
        showSettings && 'max-w-md'
      )}>
        {showSettings ? (
          // Settings View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {isDE ? 'Cookie-Einstellungen' : 'Cookie Settings'}
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Necessary - Always on */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="font-medium">
                    {isDE ? 'Notwendig' : 'Necessary'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Für die Grundfunktionen der Website erforderlich.'
                      : 'Required for basic website functionality.'}
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label className="font-medium">
                    {isDE ? 'Analyse' : 'Analytics'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Hilft uns, die Website zu verbessern.'
                      : 'Helps us improve the website.'}
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="font-medium">
                    {isDE ? 'Marketing' : 'Marketing'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isDE 
                      ? 'Für personalisierte Werbung.'
                      : 'For personalized advertising.'}
                  </p>
                </div>
                <Switch
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isDE ? 'Cookies & Datenschutz' : 'Cookies & Privacy'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isDE 
                  ? 'Wir nutzen Cookies für Analyse und Marketing. Du kannst selbst entscheiden, welche du zulassen möchtest.'
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
                onClick={() => setShowSettings(true)}
                title={isDE ? 'Einstellungen' : 'Settings'}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              {isDE 
                ? 'Details in unserer Datenschutzerklärung.'
                : 'Details in our privacy policy.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
