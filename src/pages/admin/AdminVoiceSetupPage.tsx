import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Loader2, 
  LogOut, 
  ArrowLeft,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Settings,
  Phone,
  Webhook,
  Bot,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';
import { NoIndex } from '@/components/NoIndex';

export default function AdminVoiceSetupPage() {
  const { isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
      toast.success('Kopiert');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const CopyButton = ({ text, item }: { text: string; item: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, item)}
    >
      {copiedItem === item ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  const CodeBlock = ({ code, item }: { code: string; item: string }) => (
    <div className="relative bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
      <pre className="whitespace-pre-wrap">{code}</pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} item={item} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <span className="font-semibold">Voice Setup</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/admin/calls">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Calls
                </Button>
              </Link>
              <Button variant="outline" onClick={signOut} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <Alert className={siteConfig.voiceEnabled ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          {siteConfig.voiceEnabled ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          )}
          <AlertTitle>
            {siteConfig.voiceEnabled ? 'Voice Agent aktiv' : 'Voice Agent inaktiv'}
          </AlertTitle>
          <AlertDescription>
            {siteConfig.voiceEnabled 
              ? 'Der Voice Agent ist konfiguriert und bereit.'
              : 'Folge den Schritten unten, um den Voice Agent einzurichten. Nach der Konfiguration setze voiceEnabled=true in site.ts.'}
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 mt-8">
          {/* Step 1: Twilio SIP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                1. Twilio SIP Trunking
              </CardTitle>
              <CardDescription>
                Manuelle Schritte in der Twilio Console
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Erstelle einen <strong>Elastic SIP Trunk</strong> in Twilio Console</li>
                <li>Unter "Origination" füge hinzu: <code className="bg-muted px-1 rounded">sip:sip.retellai.com</code></li>
                <li>Unter "Termination" verwende die lokalisierte Termination URI für deine Region</li>
                <li>Konfiguriere Credential Authentication (Retell SIP Server hat keine statische IP)</li>
                <li>Importiere deine Telefonnummer(n) in Retell (Dashboard oder API)</li>
              </ol>
              
              <div className="pt-4">
                <p className="text-sm font-medium mb-2">Origination SIP URI:</p>
                <CodeBlock code="sip:sip.retellai.com" item="sip-uri" />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Retell Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                2. Retell Webhooks
              </CardTitle>
              <CardDescription>
                Konfiguriere Webhooks im Retell Dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Webhook URL (setze im Retell Dashboard):</p>
                <CodeBlock 
                  code="https://akxdeuvxvhecvddxyqnd.supabase.co/functions/v1/retell-webhook" 
                  item="webhook-url" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Optional: Füge <code>/{'{'}RETELL_WEBHOOK_PATH_SECRET{'}'}</code> am Ende hinzu für zusätzliche Sicherheit
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Benötigte Events:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>call_started</li>
                  <li>call_ended</li>
                  <li>call_analyzed</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Sicherheit:</p>
                <p className="text-sm text-muted-foreground">
                  Die Signatur wird mit <code>x-retell-signature</code> Header und RETELL_API_KEY verifiziert.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Agent Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                3. Agent Prompt Requirements
              </CardTitle>
              <CardDescription>
                Kopierbare Skripte für den Retell Agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">🇩🇪 DE Opening:</p>
                <CodeBlock 
                  code={`Grüezi. Ich bin der digitale Assistent von itsFeierabend.ch. Damit ich dir helfen kann: Darf ich kurz ein paar Fragen stellen?

Hinweis: Dieses Gespräch kann zur Qualitätssicherung aufgezeichnet werden. Ist das okay?`}
                  item="de-opening" 
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">🇩🇪 Wenn Aufzeichnung abgelehnt:</p>
                <CodeBlock 
                  code="Kein Problem. Dann machen wir ohne Aufzeichnung weiter, oder ich verbinde dich mit einem Menschen."
                  item="de-decline" 
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">🇩🇪 Dialekt-Handling:</p>
                <CodeBlock 
                  code="Ich verstehe Dialekt meistens gut. Wenn ich etwas nicht verstehe, kannst du es bitte kurz auf Hochdeutsch sagen?"
                  item="de-dialect" 
                />
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">🇬🇧 EN Opening:</p>
                <CodeBlock 
                  code={`Hi — I'm the digital assistant for itsFeierabend.ch. May I ask a few quick questions?

Note: this call may be recorded for quality. Is that okay?`}
                  item="en-opening" 
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">🇬🇧 If recording declined:</p>
                <CodeBlock 
                  code="No problem. We can continue without recording, or I can connect you to a person."
                  item="en-decline" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Tool Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                4. Tool Endpoints
              </CardTitle>
              <CardDescription>
                Konfiguriere diese Endpoints als Tools in Retell
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">send_sms_link:</p>
                <CodeBlock 
                  code={`POST https://akxdeuvxvhecvddxyqnd.supabase.co/functions/v1/voice-tools/send_sms_link
Header: X-VOICE-TOOL-SECRET: {your_secret}
Body: { "phone": "+41...", "language": "de", "type": "booking" }`}
                  item="tool-sms" 
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">create_lead_note:</p>
                <CodeBlock 
                  code={`POST https://akxdeuvxvhecvddxyqnd.supabase.co/functions/v1/voice-tools/create_lead_note
Header: X-VOICE-TOOL-SECRET: {your_secret}
Body: { "phone": "+41...", "note": "Interested in painting services" }`}
                  item="tool-note" 
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">set_do_not_call:</p>
                <CodeBlock 
                  code={`POST https://akxdeuvxvhecvddxyqnd.supabase.co/functions/v1/voice-tools/set_do_not_call
Header: X-VOICE-TOOL-SECRET: {your_secret}
Body: { "phone": "+41...", "reason": "User requested" }`}
                  item="tool-dnc" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Diese Secrets müssen konfiguriert werden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono space-y-1 text-muted-foreground">
                <p>RETELL_API_KEY=...</p>
                <p>RETELL_WEBHOOK_PATH_SECRET=... (optional)</p>
                <p>RETELL_AGENT_ID_DE=...</p>
                <p>RETELL_AGENT_ID_EN=...</p>
                <p>RETELL_FROM_NUMBER=+41...</p>
                <p>VOICE_CALLBACK_ENABLED=false</p>
                <p>VOICE_STORE_TRANSCRIPTS=false</p>
                <p>VOICE_STORE_RECORDINGS=false</p>
                <p>VOICE_DATA_STORAGE_SETTING=everything_except_pii</p>
                <p>VOICE_TOOL_SECRET=... (für Tool-Authentifizierung)</p>
                <p className="pt-2 text-muted-foreground/70">--- Optional für SMS ---</p>
                <p>TWILIO_ACCOUNT_SID=...</p>
                <p>TWILIO_AUTH_TOKEN=...</p>
                <p>TWILIO_SMS_FROM=+41...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
