import { Groq } from "groq-sdk/client.js";
import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const groq_api_key = process.env.GROQ_API_KEY;
if (!groq_api_key) {
  throw new Error(`API IS invlaid `);
}
class MCPClient {
  private mcp: Client;
  private anthropic: Groq;
  private transport:
    | StdioClientTransport
    | StreamableHTTPClientTransport
    | null = null;
  private tools: Tool[] = [];

  constructor() {
    this.anthropic = new Groq({
      apiKey: groq_api_key,
    });
    this.mcp = new Client({ name: "first_mcp_client", version: "1-0-0-0" });
  }
  // methods will go here
}
