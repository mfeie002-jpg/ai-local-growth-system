import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase-client";

export default defineTool({
  name: "list_analysis_reports",
  title: "List canonical audits",
  description: "List recent canonical website audit states. Requires admin role.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum number of reports."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("audit_requests")
      .select("id, normalized_domain, company_name, language, audit_type, status, overall_score, score_version, report_viewed_at, cta_clicked_at, email_sent_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { audits: data ?? [], count: data?.length ?? 0 },
    };
  },
});
