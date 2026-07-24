// Ambient declaration for MCP tool files that run under Deno at runtime.
// The Vite plugin bundles src/lib/mcp/ into a Supabase Edge Function where
// `process.env.*` is polyfilled; we just need TS to accept the reference.
declare const process: { env: Record<string, string | undefined> };
