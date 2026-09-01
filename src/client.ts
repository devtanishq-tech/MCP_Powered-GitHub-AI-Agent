import { Groq } from "groq-sdk/client.js";
import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import type { ChatCompletion } from "groq-sdk/resources/chat.js";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const groq_api_key = process.env.GROQ_API_KEY;
if (!groq_api_key) {
  throw new Error(`API IS invlaid `);
}
class MCPClient {
  private mcp: Client;
  private groq: Groq;
  private transport:
    | StdioClientTransport
    | StreamableHTTPClientTransport
    | null = null;
  private tools: ChatCompletionTool[] = [];

  constructor() {
    this.groq = new Groq({
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
      await this.mcp.connect(this.transport); // basically this is used to connect the client to the mcp server

      const toolsResult = await this.mcp.listTools();
      // console.log(`Tools result`, toolsResult);
      // console.log(`---------------------------`);
      this.tools = toolsResult.tools.map((current) => {
        return {
          type: "function",
          function: {
            name: current.name,
            description: current.description,
            parameters: current.inputSchema,
          },
        };
      });
      console.log(`Numeber of tools  listed below :`);
      console.log(
        this.tools.map((current) => current.function?.name).join("\n"),
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  //============================================//
  async processingQuery(query: string) {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];
    const response = await this.groq.chat.completions.create({
      model: "",
      max_completion_tokens: 500,
      tools: this.tools,
      messages: messages,
    });
    const aimessage = response.choices[0]?.message;
    const finaltext: string[] = [];
    messages.push(aimessage!);
    if (aimessage?.content) {
      // means normal message given by the ai
      finaltext.push(aimessage.content);
    }
    // now we check does tool call called by the llm or not
    if (aimessage?.tool_calls) {
      for (let toolcall of aimessage.tool_calls) {
        const toolName = toolcall.function.name;
        const toolArgument = JSON.parse(toolcall.function.arguments);
        finaltext.push(
          `Calling tool  ${toolName} with the argument ${toolArgument}`,
        );
        const mcpresonse = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgument,
        });
        messages.push({
          role: "tool",
          tool_call_id: toolcall.id,
          content: JSON.stringify(mcpresonse.content),
        });
        const finalllmcall = await this.groq.chat.completions.create({
          model: "",
          max_completion_tokens: 2000,
          messages: messages,
        });
        finaltext.push(finalllmcall.choices[0]?.message.content!);
      }
    }
    return finaltext.join("\n");
  }
  // async chatLoop(){
  //   const rl=
  // }
}

async function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node index.ts <path_to_server_script>");
    return;
  }
  // here argv is the path that we passing inside the connect server file
  const argv2: any = process.argv[2];
  const mcpClient = new MCPClient();
  await mcpClient.connectToServer(argv2);
}
main();
