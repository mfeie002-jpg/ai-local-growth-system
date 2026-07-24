import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NoIndex } from "@/components/NoIndex";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthResult = {
  data?: {
    client?: { name?: string; client_id?: string; redirect_uris?: string[] };
    scope?: string;
    redirect_url?: string;
    redirect_to?: string;
  };
  error?: { message: string } | null;
};
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
    approveAuthorization: (id: string) => Promise<OAuthResult>;
    denyAuthorization: (id: string) => Promise<OAuthResult>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthResult["data"] | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user.email ?? null);
      try {
        const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data ?? null);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await oauth.approveAuthorization(authorizationId)
        : await oauth.denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        setError(error.message);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        setError("No redirect returned by the authorization server.");
        return;
      }
      window.location.href = target;
    } catch (e) {
      setBusy(false);
      setError((e as Error).message);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <NoIndex />
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
          <ShieldOff className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Authorization error</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <NoIndex />
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const clientName = details.client?.name ?? "an external app";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <NoIndex />
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">Connect {clientName} to itsFeierabend.ch</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {clientName} will be able to call this app's enabled MCP tools while you are signed in.
        </p>

        {userEmail && (
          <p className="text-sm mb-4">
            Signed in as <strong>{userEmail}</strong>
          </p>
        )}

        {details.scope && (
          <div className="mb-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Requested scopes:</p>
            <p className="text-sm font-mono">{details.scope}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-6">
          This does not bypass this app's row-level security or admin permissions.
        </p>

        <div className="flex gap-3">
          <Button onClick={() => decide(true)} disabled={busy} className="flex-1">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
          </Button>
          <Button onClick={() => decide(false)} disabled={busy} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
