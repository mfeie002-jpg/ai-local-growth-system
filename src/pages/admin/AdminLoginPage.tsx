import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, LogIn, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NoIndex } from '@/components/NoIndex';

export default function AdminLoginPage() {
  const { isAdmin, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin/leads" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Diese E-Mail-Adresse ist bereits registriert.');
          } else {
            setError(error.message || 'Registrierung fehlgeschlagen.');
          }
        } else {
          setSuccess('Konto erstellt! Du kannst dich jetzt anmelden. Ein Admin muss dir noch die Admin-Rolle zuweisen.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Ungültige Anmeldedaten. Bitte prüfe E-Mail und Passwort.');
          } else {
            setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
          }
        }
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <NoIndex />
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="text-primary font-bold">its</span>
              <span className="font-bold text-foreground">Feierabend</span>
              <span className="text-primary font-bold">.ch</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Admin Registrierung' : 'Admin Login'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? 'Erstelle ein neues Admin-Konto.' 
                : 'Melde dich an, um auf das Admin-Panel zuzugreifen.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@itsfeierabend.ch"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Registrieren...' : 'Anmelden...'}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registrieren
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Anmelden
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Bereits ein Konto? Anmelden' 
                : 'Noch kein Konto? Registrieren'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Nur für autorisierte Administratoren.
        </p>
      </div>
    </div>
  );
}
