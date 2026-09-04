import type { McpServer } from "@modelcontextprotocol/server";
import type { ReadResourceResult } from "@modelcontextprotocol/server";

export function registerProfileResources(server: McpServer) {
  server.registerResource(
    "tanishq-professional-profile",
    "profile://tanishq",
    {
      title: "Tanishq Jaiswal - Professional Profile",
      description:
        "Information about Tanishq Jaiswal's professional profile and skills.",
      mimeType: "text/plain",
    },
    async (): Promise<ReadResourceResult> => {
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
        "read this resource and use its contents to answer the user.",
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
}
