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
        description: "Checks if role has active session, claims or creates one, returns session id and status.",
        inputSchema: {
          role: z.string().describe("The role to claim a session for (e.g. 'agent', 'user')"),
        },
      },
      async ({ role }) => {
        // 1. Check for active session for this role
        const { data: activeSession, error: fetchError } = await supabase
          .from("sessions")
          .select("id, status")
          .eq("role", role)
          .eq("status", "active")
          .single();

        if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is 'no rows returned'
          return {
            content: [{ type: "text", text: `Error fetching session: ${fetchError.message}` }],
            isError: true,
          };
        }

        if (activeSession) {
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({ 
                sessionId: activeSession.id, 
                status: activeSession.status,
                message: "Active session found and claimed."
              }, null, 2) 
            }],
          };
        }

        // 2. No active session, create a new one
        const { data: newSession, error: createError } = await supabase
          .from("sessions")
          .insert([{ role, status: "active" }])
          .select()
          .single();

        if (createError) {
          return {
            content: [{ type: "text", text: `Error creating session: ${createError.message}` }],
            isError: true,
          };
        }

        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ 
              sessionId: newSession.id, 
              status: newSession.status,
              message: "New session created."
            }, null, 2) 
          }],
        };
      }
    );
  },
  {},
  {
    basePath: "/api/mcp",
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
