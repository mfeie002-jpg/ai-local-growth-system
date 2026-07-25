// Runtime-configurable ceilings passed by the validated Edge Function to the
// atomic create_audit_with_lead database transaction.

const num = (name: string, fallback: number) => {
  const value = Deno.env.get(name);
  const parsed = value ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const LIMITS = {
  perIpDaily: num("AUDIT_LIMIT_PER_IP_DAILY", 5),
  globalDaily: num("AUDIT_LIMIT_GLOBAL_DAILY", 200),
};
