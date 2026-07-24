import { useEffect, useRef, useState } from "react";

// Minimal Cloudflare Turnstile widget wrapper.
// Reads VITE_TURNSTILE_SITE_KEY at build time. When the key is missing the
// component renders nothing and reports token=null so local dev keeps working.

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_ID = "cf-turnstile-script";

interface Props {
  onToken: (token: string | null) => void;
}

export function Turnstile({ onToken }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  // Inject the script once
  useEffect(() => {
    if (!SITE_KEY) return;
    if (document.getElementById(SCRIPT_ID)) {
      setReady(!!window.turnstile);
      return;
    }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = () => setReady(!!window.turnstile);
    document.head.appendChild(s);
  }, []);

  // Render widget when the script + container are ready
  useEffect(() => {
    if (!SITE_KEY || !ready || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "auto",
      callback: (t) => onToken(t),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
        widgetIdRef.current = null;
      }
    };
  }, [ready, onToken]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="cf-turnstile" data-testid="turnstile" />;
}

export const TURNSTILE_ENABLED = !!SITE_KEY;
