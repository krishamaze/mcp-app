import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "claim_session",
      {
        title: "Claim Session",
        description: "Looks up role by name, checks for an active session in employee_sessions, claims or creates one, and returns the session details in a single line.",
        inputSchema: {
          role_name: z.string().describe("The name of the role to claim a session for"),
        },
      },
      async ({ role_name }) => {
        const { data: role, error: roleError } = await supabase.from("roles").select("id").eq("name", role_name).single();
        if (roleError) return { content: [{ type: "text", text: `Error: Role '${role_name}' not found.` }], isError: true };

        const { data: active, error: fError } = await supabase.from("employee_sessions").select("id, status, thread_id").eq("role_id", role.id).eq("status", "active").single();
        if (fError && fError.code !== "PGRST116") return { content: [{ type: "text", text: `Error: ${fError.message}` }], isError: true };

        if (active) {
          return { content: [{ type: "text", text: `SessionID: ${active.id}, Status: ${active.status}, ThreadID: ${active.thread_id || 'none'}, Role: ${role_name}, Message: Active session claimed.` }] };
        }

        const { data: newS, error: cError } = await supabase.from("employee_sessions").insert([{ role_id: role.id, status: "active" }]).select().single();
        if (cError) return { content: [{ type: "text", text: `Error: ${cError.message}` }], isError: true };

        return { content: [{ type: "text", text: `SessionID: ${newS.id}, Status: ${newS.status}, ThreadID: ${newS.thread_id || 'none'}, Role: ${role_name}, Message: New session created.` }] };
      }
    );
  },
  {},
  { basePath: "/api/mcp", verboseLogs: true }
);

export { handler as GET, handler as POST };
