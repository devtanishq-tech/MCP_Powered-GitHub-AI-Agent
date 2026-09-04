import { Groq } from "groq-sdk/client.js";

import {
  Client,
  StreamableHTTPClientTransport,
  type Transport,
} from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import type {
  ChatCompletion,
  ChatCompletionTool,
} from "groq-sdk/resources/chat.js";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import readliner from "readline/promises";
import { stdin, stdout } from "process";
import { url } from "inspector";
const groq_api_key = process.env.GROQ_API_KEY;
if (!groq_api_key) {
  throw new Error(`API IS invlaid `);
}
type MCPResource = {
  name: string;
  title?: string;
  uri: string;
  description?: string;
  mimeType?: string;
};
class MCPClient {
  private mcp: Client;
  private groq: Groq;
  private transport:
    | StdioClientTransport
    | StreamableHTTPClientTransport
    | null = null;
  private tools: ChatCompletionTool[] = [];
  private resource: MCPResource[] = [];

  constructor() {
    this.groq = new Groq({
      apiKey: groq_api_key,
    });
    this.mcp = new Client({ name: "first_mcp_client", version: "1-0-0-0" });
  }
  // methods will go here
  // now goint to implement the  connection function

  //============================================//
  async connectToServer(
    serverScriptPath: string,
    typeofUrl: `local` | `remote`,
  ) {
    if (typeofUrl === "local") {
      const isJs = serverScriptPath.endsWith(".ts");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server sc0 ript must be a .ts or .py file");
      }

      this.transport = new StdioClientTransport({
        command: "bun",
        args: ["run", serverScriptPath],
      });
    } else if (typeofUrl === "remote") {
      this.transport = new StreamableHTTPClientTransport(
        new URL(serverScriptPath),
      );
    }
    try {
      await this.mcp.connect(this.transport as Transport); // basically this is used to connect the client to the mcp server
      const resouseResult = await this.mcp.listResources();
      const toolsResult = await this.mcp.listTools();
      // console.log(`Tools result`, toolsResult);
      // console.log(`---------------------------`);
      this.resource = resouseResult.resources.map((current) => {
        return {
          name: current.name,
          title: current.title,
          uri: current.uri,
          description: current.description,
          mimeType: current.mimeType,
        };
      });
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
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  //============================================//
  async processingQuery(query: string) {
    const resourceInfo = this.resource
      .map((resource) => {
        return `
          Name: ${resource.name}
          Title: ${resource.title}
          URI: ${resource.uri}
          Description: ${resource.description}
          MIME Type: ${resource.mimeType}
`;
      })
      .join("\n");
    //============================================//
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a personal AI assistant connected to the user's MCP server, which holds the owner's private data. Use a tool/resource only when the query needs it; never invent private info. GitHub tools: if you don't already have the exact owner and repo name, call github_list_repos first to resolve them before calling any other GitHub tool — never guess owner/repo.`,
      },
      {
        role: "system",
        content: resourceInfo
          ? `Available MCP resources (use read_mcp_resource with the URI when needed): ${resourceInfo}`
          : "No MCP resources are currently available.",
      },
      {
        role: "user",
        content: query,
      },
    ];
    //============================== this is the additional tools thatr are sending from the client side ===========================
    const resourceTool: ChatCompletionTool = {
      type: "function",
      function: {
        name: "read_mcp_resource",
        description:
          "Read the contents of an MCP resource. Use this when the user's question requires information contained in an available MCP resource.",
        parameters: {
          type: "object",
          properties: {
            uri: {
              type: "string",
              description: "The URI of the MCP resource to read",
            },
          },
          required: ["uri"],
        },
      },
    };
    //==============================
    const allTools = [...this.tools, resourceTool];
    const finaltext: string[] = [];

    // Sequential tool-call loop: keep `tools` attached on every round trip so
    // the model can see a tool's result and decide to call another tool,
    // instead of stopping after a single round of tool calls.
    const MAX_STEPS = 5; // safety cap against infinite tool-call loops
    for (let step = 0; step < MAX_STEPS; step++) {
      const response = await this.groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        reasoning_effort: "low",
        max_completion_tokens: 2000,
        //========================
        tools: allTools,
        //=====================
        messages: messages,
      });
      console.log(
        `--------------------trying to see how many tokes they have use here `,
      );
      console.log(response);
      console.log(`-----------------------------------------------------`);
      const aimessage = response.choices[0]?.message;
      messages.push(aimessage!);

      if (aimessage?.content) {
        // means normal message given by the ai
        finaltext.push(aimessage.content);
      }

      // now we check does tool call called by the llm or not
      if (!aimessage?.tool_calls || aimessage.tool_calls.length === 0) {
        // no more tools requested -> this is the final answer
        break;
      }

      for (let toolcall of aimessage.tool_calls) {
        const toolName = toolcall.function.name;
        const toolArgument = JSON.parse(toolcall.function.arguments);
        finaltext.push(
          `Calling tool  ${toolName} with the argument ${toolArgument}`,
        );
        let result;
        if (toolcall.function.name === "read_mcp_resource") {
          const mcpresourceR = await this.mcp.readResource({
            uri: toolArgument.uri,
          });
          result = mcpresourceR.contents;
        } else {
          const mcptoolR = await this.mcp.callTool({
            name: toolName,
            arguments: toolArgument,
          });
          result = mcptoolR.content;
        }
        messages.push({
          role: "tool",
          tool_call_id: toolcall.id,
          content: JSON.stringify(result),
        });
      }
      // loop back around so the model can see these tool results and
      // decide whether it needs to call another tool
    }

    return finaltext.join("\n");
  }
  async chatLoop() {
    const rl = readliner.createInterface({ input: stdin, output: stdout });
    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");
      while (true) {
        const userMessage = await rl.question("ask question:");
        if (userMessage === "exit") {
          console.log(" exiting the chat interferace bye bye 👋👋");
          break;
        }
        const finalData = await this.processingQuery(userMessage);
        console.log(`Ai message : `, finalData);
      }
    } catch (err) {
      console.log(`Some error happen at chatLop method`);
      console.log(err);
    }
  }
}
async function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node index.ts <path_to_server_script>");
    return;
  }
  // here argv is the path that we passing inside the connect server file
  const argv2: any = process.argv[2];
  const mcpClient = new MCPClient();
  await mcpClient.connectToServer(argv2, "remote");
  await mcpClient.chatLoop();
}
main();
