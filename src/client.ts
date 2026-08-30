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
  private tools: ChatCompletionTool[] = [];

  constructor() {
    this.anthropic = new Groq({
      apiKey: groq_api_key,
    });
    this.mcp = new Client({ name: "first_mcp_client", version: "1-0-0-0" });
  }
  // methods will go here
  // now goint to implement the  connection function

  //============================================//
  async connectToServer(serverScriptPath: string) {
    try {
      const isJs = serverScriptPath.endsWith(".ts");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server sc0 ript must be a .ts or .py file");
      }

      this.transport = new StdioClientTransport({
        command: "bun",
        args: ["run", serverScriptPath],
      });
      await this.mcp.connect(this.transport); // this is where connection between mcp client with local transport

      const toolsResult = await this.mcp.listTools();
      console.log(`Tools result`, toolsResult);
      // this.tools = toolsResult.tools.map((tool) => {
      //   return {
      //     name: tool.name,
      //     description: tool.description,
      //     input_schema: tool.inputSchema,
      //   };
      // });
      // console.log(
      //   "Connected to server with tools:",
      //   this.tools.map(({ name }) => name),
      // );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }
  //============================================//
}
async function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node index.ts <path_to_server_script>");
    return;
  }
  const argv2: any = process.argv[2];
  const mcpClient = new MCPClient();
  await mcpClient.connectToServer(argv2);
  // try {
  //   await mcpClient.connectToServer(process.argv[2]);
  //   await mcpClient.chatLoop();
  // } catch (e) {
  //   console.error("Error:", e);
  //   await mcpClient.cleanup();
  //   process.exit(1);
  // } finally {
  //   await mcpClient.cleanup();
  //   process.exit(0);
  // }
}
main();
