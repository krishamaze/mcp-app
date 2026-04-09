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
          thread_id: z.string().optional().describe("Optional thread ID to reclaim an existing session"),
        },
      },
      async ({ role_name, thread_id }) => {
        const { data: role, error: roleError } = await supabase.from("roles").select("id").eq("name", role_name).single();
        if (roleError) return { content: [{ type: "text", text: `Error: Role '${role_name}' not found.` }], isError: true };

        if (thread_id) {
          const { data: existing } = await supabase.from("employee_sessions").select("id, status, thread_id").eq("role_id", role.id).eq("thread_id", thread_id).maybeSingle();
          if (existing) {
            if (existing.status !== 'active') await supabase.from("employee_sessions").update({ status: 'active' }).eq("id", existing.id);
            return { content: [{ type: "text", text: `SessionID: ${existing.id}, Status: active, ThreadID: ${existing.thread_id}, Role: ${role_name}, Message: Session reclaimed.` }] };
          }
        }

        const { data: active } = await supabase.from("employee_sessions").select("id, status, thread_id").eq("role_id", role.id).eq("status", "active").maybeSingle();
        if (active) return { content: [{ type: "text", text: `SessionID: ${active.id}, Status: active, ThreadID: ${active.thread_id || 'none'}, Role: ${role_name}, Message: Active session claimed.` }] };

        const { data: newS, error: cError } = await supabase.from("employee_sessions").insert([{ role_id: role.id, status: "active", thread_id }]).select().single();
        if (cError) return { content: [{ type: "text", text: `Error: ${cError.message}` }], isError: true };

        return { content: [{ type: "text", text: `SessionID: ${newS.id}, Status: active, ThreadID: ${newS.thread_id || 'none'}, Role: ${role_name}, Message: New session created.` }] };
      }
    );

    server.registerTool(
      "check_role_session",
      {
        title: "Check Role Session",
        description: "Checks if a named role currently has an active session.",
        inputSchema: {
          role_name: z.string().describe("The name of the role to check"),
        },
      },
      async ({ role_name }) => {
        const { data: role, error: roleError } = await supabase.from("roles").select("id").eq("name", role_name).single();
        if (roleError) return { content: [{ type: "text", text: `Error: Role '${role_name}' not found.` }], isError: true };

        const { data: active } = await supabase.from("employee_sessions").select("id, status, thread_id").eq("role_id", role.id).eq("status", "active").maybeSingle();
        
        if (active) {
          return { content: [{ type: "text", text: `Role: ${role_name}, Status: active, SessionID: ${active.id}, ThreadID: ${active.thread_id || 'none'}.` }] };
        } else {
          return { content: [{ type: "text", text: `Role: ${role_name}, Status: no active session.` }] };
        }
      }
    );

    server.registerTool(
      "get_signup_guide_step",
      {
        title: "Get Signup Guide Step",
        description: "Returns content for a specific signup step if the unlock key is correct.",
        inputSchema: {
          step: z.number().describe("The step number (1-3)"),
          unlock_key: z.string().describe("The secret key to unlock the step content"),
        },
      },
      async ({ step, unlock_key }) => {
        const steps: Record<number, { key: string, content: string }> = {
          1: { key: "START", content: "Welcome! Enter your email to begin." },
          2: { key: "VERIFY", content: "Check your inbox for a verification code." },
          3: { key: "FINISH", content: "Setup your profile and password." }
        };
        const target = steps[step];
        if (!target) return { content: [{ type: "text", text: "Error: Invalid step number." }], isError: true };
        if (target.key !== unlock_key) return { content: [{ type: "text", text: "Error: Incorrect unlock key." }], isError: true };
        return { content: [{ type: "text", text: `Step ${step}: ${target.content}` }] };
      }
    );
  },
  {},
  { basePath: "/api/mcp", verboseLogs: true }
);

export { handler as GET, handler as POST };
