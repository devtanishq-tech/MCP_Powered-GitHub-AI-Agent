import { McpServer } from "@modelcontextprotocol/server";
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";

import { registerCoreTools } from "./tools/coretools";

import { registerVacationPrompt } from "./prompts/vacationPrompt";
import { registerEmailPrompt } from "./prompts/emailPrompt";

import { registerProfileResources } from "./resources/profileResources";

const server = new McpServer({
  name: "Tanishq_JAISWAL-Server",
  version: "1-1-1",
});

// ===============================
// Register MCP capabilities
// ==============================
//===================================================MCP SERVER  CAPABILITIES ================================

registerCoreTools(server);
registerVacationPrompt(server);
registerEmailPrompt(server);
registerProfileResources(server);
//============================================================================================================

async function main() {
  const app = new Hono();

  const transport = new StreamableHTTPTransport();

  app.all("/services", async (c) => {
    if (!server.isConnected()) {
      await server.connect(transport);
    }

    return await transport.handleRequest(c);
  });

  Bun.serve({
    fetch: app.fetch,
    port: 8080,
  });

  console.log("MCP server running on http://localhost:8080");
}

main();
