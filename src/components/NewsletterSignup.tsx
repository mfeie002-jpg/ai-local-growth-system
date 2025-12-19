import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';

export function NewsletterSignup() {
  const { isEnglish } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('success');
    setEmail('');
    
    toast.success(
      isEnglish 
        ? 'Welcome! Check your inbox for confirmation.' 
        : 'Willkommen! Prüfe deinen Posteingang zur Bestätigung.'
    );
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold">
          {isEnglish ? 'Subscribe to Our Newsletter' : 'Newsletter abonnieren'}
        </h3>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {isEnglish
          ? 'Get weekly tips on SEO, Google Ads, and AI automation delivered to your inbox.'
          : 'Erhalte wöchentliche Tipps zu SEO, Google Ads und KI-Automatisierung direkt in deinen Posteingang.'}
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder={isEnglish ? 'Enter your email' : 'Deine E-Mail-Adresse'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-4 h-12 bg-background/80 backdrop-blur-sm"
            required
            disabled={status === 'loading' || status === 'success'}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="h-12 px-6 group"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEnglish ? 'Subscribing...' : 'Wird abonniert...'}
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              {isEnglish ? 'Subscribed!' : 'Abonniert!'}
            </>
          ) : (
            <>
              {isEnglish ? 'Subscribe' : 'Abonnieren'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-4">
        {isEnglish
          ? 'No spam. Unsubscribe anytime. We respect your privacy.'
          : 'Kein Spam. Jederzeit abbestellbar. Wir respektieren deine Privatsphäre.'}
      </p>
    </div>
  );
}
