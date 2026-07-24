import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function client(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_leads",
  title: "List leads",
  description: "List recent leads submitted through the site (newest first). Requires admin role.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum number of leads to return."),
    status: z.string().optional().describe("Optional status filter, e.g. 'new', 'contacted'."),
    lead_type: z.string().optional().describe("Optional lead type filter, e.g. 'audit', 'call'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status, lead_type }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = client(ctx);
    let query = sb
      .from("leads")
      .select("id, created_at, name, email, phone, lead_type, status, industry, service_area, pre_score_bucket, pre_score_total, language")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) query = query.eq("status", status);
    if (lead_type) query = query.eq("lead_type", lead_type);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { leads: data ?? [], count: data?.length ?? 0 },
    };
  },
});
