import {
  McpServer,
  type ReadResourceResult,
} from "@modelcontextprotocol/server";
import { students } from "./student";
import { actor } from "./adultStar";
//-----------------the type of transport layer you are using we import that ----
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { StreamableHTTPTransport } from "@hono/mcp";
import z, { registry } from "zod";

import { Hono } from "hono";
import { ServerError } from "@modelcontextprotocol/sdk/server/auth/errors";
const server = new McpServer({
  name: "Tanishq_JAISWAL-Server",
  version: "1-1-1",
});

//=================================Server Resource //=============================
server.registerResource(
  "tanishq-professional-profile",
  "profile://tanishq",
  {
    title: "Tanishq Jaiswal - Professional Profile",
    description: "whenever query is about Tanishq Jaiswal skiils  ",
    mimeType: "text/plain",
  },
  async ({}): Promise<ReadResourceResult> => {
    return {
      contents: [
        {
          uri: "profile://tanishq",
          text: `
Candidate Profile - Tanishq Jaiswal

Name:
Tanishq Jaiswal

Location:
Gurugram, Haryana, India

Education:
B.Tech in Computer Science and Engineering (CSE)
Dronacharya College of Engineering, Gurugram
Expected Graduation: 2026

Professional Profile:
Software Developer and AI Engineer focused on building full-stack applications
and Agentic AI systems using TypeScript, Node.js, React, LangChain, LangGraph,
RAG, and LLM APIs.

Core AI / GenAI Skills:
- Generative AI and Large Language Models (LLMs)
- Agentic AI and multi-agent systems
- LangChain and LangGraph
- RAG pipelines
- Vector embeddings and semantic retrieval
- Tool calling and dynamic agent workflows
- Prompt Engineering
- LLM API integration
- StateGraph-based agent orchestration

Backend / Full-Stack Skills:
- TypeScript, JavaScript, Python, Java, C++, SQL
- Node.js and Express.js
- React.js, Next.js
- MongoDB
- REST API development
- FastAPI, Flask, Django
- JWT authentication
- WebSockets / Socket.io
- Git, GitHub, Docker, Kubernetes
- CI/CD
- Vercel, Render, Netlify

Key Project 1 - AI SaaS Platform:
Built a production-ready AI SaaS platform using React.js, Node.js, Express.js,
LangChain, LangGraph, Groq API, vector embeddings, and RAG.

Key capabilities:
- Multi-step agent workflows using LangGraph StateGraph
- Streaming AI responses
- Persistent conversational memory
- Complete RAG pipeline
- Document ingestion and text chunking
- Embedding generation and semantic retrieval
- Context-aware response generation
- Dynamic tool calling
- Graph-based agent execution
- Backend API orchestration

Key Project 2 - Google Workspace AI Agent:
Built an Agentic AI assistant using Node.js, TypeScript, LangGraph, LangChain,
and Groq API.

Integrated:
- Google Calendar API
- Gmail API
- Google People API
- Tavily Search

The agent supports autonomous workflows such as:
- Scheduling meetings
- Composing and sending emails
- Retrieving inbox content
- Resolving contacts
- Multi-step reasoning
- Conditional graph execution
- Dynamic tool calling
- Persistent conversation memory

Key Project 3 - TradeFlow:
Built a full-stack Zerodha-style trading simulation platform using React.js,
Node.js, Express.js, MongoDB, Socket.io, Material UI, Recharts, and LLM integration.

Key capabilities:
- Virtual buy/sell execution
- Real-time portfolio tracking
- P&L analytics
- JWT-based authentication
- Custom mock stock engine
- WebSocket-based live price simulation
- Broadcasting price updates every 5 seconds
- Gemini 2.5 Flash trading assistant

Key Project 4 - Airbnb-Inspired Rental Platform:
Built a full-stack property rental marketplace using Node.js, Express.js,
MongoDB, Cloudinary, and Mapbox.

Key capabilities:
- RESTful API architecture
- Property listing creation
- Advanced filtering
- Booking functionality
- MVC architecture
- Session-based authentication
- Cloudinary image storage
- Mapbox-based geolocation visualization

Coding / Achievement:
- Solved 100+ DSA problems on LeetCode using Java.
- GitHub: github.com/devtanishq-tech
- LeetCode: leetcode.com/tanishq
- Portfolio: tanishq.dev

Target Profile:
Software Developer / Full-Stack Developer / AI Engineer / Generative AI Engineer
with a focus on Agentic AI, LLM applications, RAG, backend systems, and
AI-powered full-stack applications.
`,
        },
      ],
    };
  },
);

server.registerResource(
  "cardetails",
  "car://details",
  {
    title: "Car Details",
    description:
      "This resource contains the user's car information. " +
      "When the user asks about their car, vehicle, car model, car number plate, " +
      "car details, or any other question requiring information about their car, " +
      "read this resource and use its contents to answer the user. " +
      "Do not guess car information if it is not available in this resource.",
    mimeType: "text/plain",
  },
  async (): Promise<ReadResourceResult> => {
    return {
      contents: [
        {
          uri: "car://details",
          text: `
              Owner: Tanishq Jaiswal
              Car: WagonR
              Number Plate: DL12CJ4851
              Model Year: 2016
          `,
        },
      ],
    };
  },
);
//===================================Server Prompt =================================
server.registerPrompt(
  "send_email_prompt",
  {
    title: "send_email",
    description: "used whenever there is query relerated to sending email",
    argsSchema: z.object({
      to: z.string().describe("whom user tring to send  email"),
      subject: z
        .string()
        .describe(
          "The name of the entity, table, or concept to generate a schema for (e.g., 'User', 'Product', 'Order').",
        ),
      body: z.string().describe("the main content of the body "),
    }),
  },
  async ({ to, subject, body }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create the draft email where you are sending the email to ${to} 
            ,with the subject name of ${subject} and for the body content you need to use ${body}
            and  make sure to rewrite it or correct the body of the mail 
            `,
          },
        },
      ],
    };
  },
);
server.registerPrompt(
  "vacation_planning",
  {
    title: "Vaccation-Planning",
    description: "Used to plan and process the Vaccation planning ",
    argsSchema: {
      duration: z.string().describe("duration in days for the trip "),
      destination: z.string().describe("destination you want to you"),
      interests: z.array(z.string().describe("list of Interests")),
      budget: z.string().describe("How much money you are spending "),
    },
  },
  async ({ destination, budget, duration, interests }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Plan a ${duration}-day vacation to ${destination}.
  Budget: ${budget ? `$${budget}` : "flexible"}
  Interests: ${interests.join(", ")}
  Please suggest an itinerary, accommodations, and activities.`,
          },
        },
      ],
    };
  },
);

//=================How to add Tools or define tool inside the server //==========
server.registerTool(
  `enrolled_students`,
  {
    description: "Get the list of students with the enrollement information",
    inputSchema: z.object({
      limit: z
        .number()
        .optional()
        .describe("return the maximum Number of students "),
    }),
  },
  async ({ limit }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(students),
        },
      ],
    };
  },
);
server.registerTool(
  "weather_check",
  {
    description: "used to find the current and laterst weather report ",
    inputSchema: z.object({
      city: z.string().describe("name of the city user trying to find "),
    }),
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: `Current weather of ${city}  is 25 °C`,
        },
      ],
    };
  },
);
//=====================================Another tool =============================
server.registerTool(
  `web_search`,
  {
    description: "used to search real time data on the internet",
    inputSchema: z.object({
      query: z.string().describe("query is that is needed to be search"),
    }),
  },
  async ({ query }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify("HI THERE "),
        },
      ],
    };
  },
);
server.registerTool(
  "pornStarName",
  {
    description: "used to find the pornstar deatils when  user asked for it",
    inputSchema: z.object({
      totalNumber: z
        .number()
        .optional()
        .describe("MaXIMUM NUMBER of pornstar data "),
    }),
  },
  async ({ totalNumber }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(actor.slice(0, totalNumber)),
        },
      ],
    };
  },
);
//=======================================NOW  WE ARE CALLING THE FUNCTIION , WHERE WE CONNECT THE SERVER AND MAKE IT TRANSFEREABLE =======
// async function main() {
//   const transport = new StdioServerTransport();
//   await server.connect(transport);
//   console.error("Tanishq_JAISWAL MCP server has started ");
// }
// main().catch((error) => {
//   console.error("Fata errol has occur", error);
//   process.exit(1);
// });
async function main() {
  const app = new Hono();
  const transport = new StreamableHTTPTransport();

  app.all("/servies", async (c) => {
    if (!server.isConnected()) {
      await server.connect(transport);
    }
    return await transport.handleRequest(c);
  });
  Bun.serve({
    fetch: app.fetch,
    port: 8080,
  });
  console.log(`Server is running on localhost:8080`);
}
main();
