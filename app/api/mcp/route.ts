import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "echo",
      {
        title: "Echo",
        description: "Echoes back the input text",
        inputSchema: {
          text: z.string().describe("The text to echo"),
        },
      },
      async ({ text }) => {
        return {
          content: [{ type: "text", text: `You said: ${text}` }],
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
