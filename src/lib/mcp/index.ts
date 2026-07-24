import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeadsTool from "./tools/list-leads";
import getLeadTool from "./tools/get-lead";
import listCallsTool from "./tools/list-calls";
import listAnalysisReportsTool from "./tools/list-analysis-reports";
import addDoNotCallTool from "./tools/add-do-not-call";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "itsfeierabend-mcp",
  title: "itsFeierabend.ch",
  version: "0.1.0",
  instructions:
    "Tools to inspect leads, voice calls, and website analysis reports for itsFeierabend.ch, plus adding numbers to the do-not-call list. All tools act as the signed-in admin user; row-level security enforces access.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeadsTool, getLeadTool, listCallsTool, listAnalysisReportsTool, addDoNotCallTool],
});
