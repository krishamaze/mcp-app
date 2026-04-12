import { protectedResourceHandler } from "mcp-handler";

const handler = protectedResourceHandler({
  authServerUrls: ["https://sheets-mcp-xi.vercel.app/api/auth"],
  resourceUrl: "https://sheets-mcp-xi.vercel.app",
});

export { handler as GET };
