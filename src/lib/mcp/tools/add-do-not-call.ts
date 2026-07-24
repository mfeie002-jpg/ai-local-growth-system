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
  name: "add_do_not_call",
  title: "Add phone to do-not-call list",
  description: "Add a phone number to the do-not-call list so the voice agent will no longer contact it. Requires admin role.",
  inputSchema: {
    phone: z.string().min(5).describe("Phone number in E.164-ish format, e.g. +41791234567."),
    reason: z.string().optional().describe("Optional reason note."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ phone, reason }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await client(ctx)
      .from("do_not_call")
      .insert({ phone, reason: reason ?? null })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Added ${phone} to do-not-call list.` }],
      structuredContent: { entry: data },
    };
  },
});
