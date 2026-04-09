export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MCP Server Running</h1>
      <p className="mt-4">
        The MCP endpoint is at <code>/api/mcp</code>
      </p>
    </main>
  );
}
