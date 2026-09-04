# MCP-Powered GitHub AI Agent

A TypeScript-based **Model Context Protocol (MCP) application** that connects an LLM-powered client to a remote MCP server and exposes GitHub capabilities as structured tools.

The project demonstrates how an AI application can discover MCP tools and resources, call external APIs through those tools, consume tool results, and continue reasoning through multiple tool-call steps before producing a final answer.

> **Project focus:** MCP • AI Tool Calling • GitHub API • Remote MCP • Streamable HTTP • TypeScript • Bun • Hono • Groq

---

## 🚀 What Does This Project Do?

Instead of giving an AI model direct access to every API, this project puts an **MCP server** between the AI client and external capabilities such as GitHub.

A user can ask questions such as:

- "Show me my GitHub repositories."
- "Give me the details of this repository."
- "What issues are open in this repository?"
- "Search this repository for authentication code."
- "Create an issue with this title and description."

The LLM decides when a tool is needed.

The MCP client sends the request to the MCP server, the server executes the appropriate GitHub operation, and the result is returned to the model.

### High-Level Flow

```text
User
  │
  ▼
Groq-powered MCP Client
  │
  │  LLM decides which tool is needed
  ▼
MCP Client
  │
  │  Streamable HTTP
  ▼
Remote MCP Server
  │
  ├── GitHub Tools
  ├── Core Tools
  ├── MCP Resources
  └── MCP Prompts
  │
  ▼
GitHub API / Application Data
  │
  ▼
Tool Result
  │
  ▼
LLM receives the result
  │
  ├── call another tool if required
  └── generate final answer
```

---

## 🧠 Why MCP?

The **Model Context Protocol (MCP)** provides a standard way for AI applications to connect models with external tools, data, and application capabilities.

In this project, MCP separates the responsibilities of the system:

- **LLM Client** — understands the user's request and decides which tool to use.
- **MCP Client** — connects to the MCP server and executes requested MCP operations.
- **MCP Server** — exposes tools, resources, and prompts.
- **Service Layer** — contains the actual GitHub API integration.
- **External Service** — GitHub provides repository and issue data.

This makes the project a practical example of **LLM tool orchestration through MCP**, rather than a simple direct GitHub API integration.

---

# ✨ Key Features

## 🤖 LLM-Powered MCP Client

The client uses **Groq** with `openai/gpt-oss-120b` to interpret user requests and select available tools dynamically.

The client discovers tools from the MCP server instead of hard-coding the complete tool list.

---

## 🔁 Sequential Multi-Step Tool Calling

The client supports multiple tool-call rounds.

For example:

```text
User:
"Find the repository where I built my trading application
and show its issues."

        ↓

LLM
        ↓
GitHub repository list
        ↓
Identify the correct repository
        ↓
GitHub issue list
        ↓
Final answer
```

After each tool result, the result is added back to the conversation so the LLM can decide whether another tool call is necessary.

A maximum number of steps is used as a safety limit to prevent an infinite tool-call loop.

---

# 🌐 Remote MCP Server

The server uses **Streamable HTTP** and **Hono**, making it possible to connect to the MCP server remotely.

The server exposes its MCP endpoint through:

```text
/services
```

This allows an MCP client running on another machine or environment to communicate with the server.

---

# 🐙 GitHub API Integration

GitHub capabilities are implemented as MCP tools and backed by **Octokit**.

The application exposes GitHub operations through the MCP protocol instead of calling GitHub directly from the LLM.

### Available GitHub Tools

| Tool                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `github_get_my_profile` | Get the authenticated GitHub user's profile     |
| `github_list_repos`     | List the user's repositories                    |
| `github_get_repo`       | Get detailed information about a repository     |
| `github_list_issues`    | List repository issues                          |
| `github_get_issue`      | Get details of a specific issue                 |
| `github_search_code`    | Search code inside a repository                 |
| `github_create_issue`   | Create a GitHub issue when explicitly requested |

This demonstrates how an external API can be converted into **LLM-callable MCP tools**.

---

# 📦 MCP Resources

The server also demonstrates **MCP Resources**.

Examples include:

- Professional profile resource
- Car details resource

The MCP client discovers available resources from the server and can read them when required.

Resources provide a way to expose structured application information to an MCP client without treating everything as a tool call.

---

# 🧩 MCP Prompts

The project also contains reusable MCP prompt examples.

Currently implemented examples include:

- Vacation planning
- Email-related workflow

These demonstrate how prompts can be exposed as reusable MCP capabilities.

---

# 🛠️ Core MCP Tools

The server also contains example application tools for:

- Student enrollment data
- Weather lookup
- Web search
- Actor details

These tools demonstrate how application-specific functionality can be exposed through MCP.

---

# 🏗️ Project Architecture

The code is organized into separate layers so the MCP protocol, tools, business/API integrations, resources, and prompts are easier to understand and maintain.

```text
src/
│
├── client.ts
│   └── Groq-powered MCP client
│       ├── Connect to local or remote MCP server
│       ├── Discover tools and resources
│       ├── Send tools to the LLM
│       ├── Execute tool calls
│       └── Continue sequential tool-call loop
│
├── mainserver.ts
│   └── MCP server entry point
│       ├── Register tools
│       ├── Register resources
│       ├── Register prompts
│       └── Expose Streamable HTTP endpoint
│
├── tools/
│   ├── coretools.ts
│   │   └── Example application tools
│   │
│   └── githubtool.ts
│       └── GitHub MCP tool definitions
│
├── services/
│   └── github.ts
│       └── Octokit + GitHub API operations
│
├── resources/
│   └── profileResources.ts
│       └── MCP resource definitions
│
├── prompts/
│   ├── emailPrompt.ts
│   └── vacationPrompt.ts
│       └── MCP prompt definitions
│
└── data/
    └── Example application data
```

---

# 🔄 Tool Calling Architecture

One of the most important parts of this project is the loop between the LLM, MCP client, and MCP server.

```text
1. User sends a question
          ↓
2. LLM receives available tools
          ↓
3. LLM requests a tool call
          ↓
4. MCP client receives the tool call
          ↓
5. MCP client calls the MCP server
          ↓
6. MCP server executes the tool
          ↓
7. Tool calls GitHub API / application service
          ↓
8. Result returns to MCP client
          ↓
9. Result is added to the LLM conversation
          ↓
10. LLM decides:
       ├── another tool call is required
       └── final answer can be generated
```

This allows the model to perform **multi-step tasks** rather than stopping after a single tool invocation.

---

# 🔌 Local and Remote MCP Connections

The MCP client supports two connection approaches.

## Local MCP Server

The client can start a local MCP server through a **stdio transport**.

```text
MCP Client
   │
   └── Stdio
          │
          ▼
     Local MCP Server
```

---

## Remote MCP Server

The client can connect to an MCP server through **Streamable HTTP**.

```text
MCP Client
   │
   └── HTTP
          │
          ▼
     Remote MCP Server
```

The current client configuration can connect to the remote MCP server endpoint.

---

# 🧰 Tech Stack

## AI / LLM

- Groq
- `openai/gpt-oss-120b`
- LLM Tool Calling

## MCP

- Model Context Protocol
- MCP Client
- MCP Server
- MCP Tools
- MCP Resources
- MCP Prompts
- Streamable HTTP Transport
- Stdio Transport

## Backend

- TypeScript
- Bun
- Hono
- Zod

## API Integration

- GitHub REST API
- Octokit

---

# ⚙️ Project Setup

## 1. Clone the Repository

```bash
git clone https://github.com/devtanishq-tech/mcp-application.git

cd mcp-application
```

---

## 2. Install Dependencies

This project uses **Bun**.

```bash
bun install
```

---

## 3. Configure Environment Variables

Create a `.env` file and provide the credentials required by the application:

```env
GROQ_API_KEY=your_groq_api_key
GITHUB_ACCESS_TOKEN=your_github_token
```

> ⚠️ Keep your API keys private. Never commit `.env` or secrets to GitHub.

---

# ▶️ Running the Application

## Start the MCP Server

Run:

```bash
bun run src/mainserver.ts
```

The server runs on the configured HTTP port.

The MCP endpoint is:

```text
/services
```

For a local server, this will typically be:

```text
http://localhost:8080/services
```

---

## Start the MCP Client

The client accepts the MCP server URL as a command-line argument.

```bash
bun run src/client.ts http://localhost:8080/services
```

You can then enter questions in the terminal.

The LLM can discover and use the MCP tools to answer your questions.

---

# 💬 Example Questions

Once the client is connected, try:

```text
Show me my GitHub repositories.
```

```text
Tell me about my AI expense tracker repository.
```

```text
List the issues in my MCP application repository.
```

```text
Search my repository for the function that handles GitHub issues.
```

```text
Create an issue titled "Improve error handling"
with a description explaining that API errors should
return clearer messages.
```

For repository-specific questions where the exact repository name is not known, the client can first discover the user's repositories and then use the appropriate repository-specific tool.

---

# 🔐 Security Notes

The GitHub integration uses an access token to authenticate API requests.

Recommended practices:

- Store credentials in environment variables.
- Never commit `.env` files.
- Use a GitHub token with only the permissions the application needs.
- Treat issue creation and other write operations as privileged actions.
- Keep the MCP server protected when exposing it publicly.
- Do not expose private GitHub data through an unsecured public endpoint.

---

# 🧠 What I Learned From Building This

This project was built to understand how an AI application can communicate with external capabilities through MCP.

The main concepts explored are:

- Designing an MCP client/server architecture
- Exposing application functionality as MCP tools
- Working with MCP resources and prompts
- Connecting to MCP through Streamable HTTP
- Connecting to local servers through stdio
- Integrating GitHub REST APIs through Octokit
- Converting MCP tool definitions into LLM tool definitions
- Handling sequential tool calls
- Feeding tool results back into an LLM conversation
- Separating tool definitions from service/API logic
- Designing a system where the LLM can dynamically choose available capabilities

---

# 🚧 Future Improvements

Possible next steps for this project include:

- Add stronger authentication for remote MCP connections
- Add better request validation and error handling
- Add pagination for large GitHub repository and issue lists
- Add more GitHub operations such as pull requests and commits
- Add structured logging
- Add automated tests for MCP tools
- Add observability for tool-call traces
- Add production deployment configuration
- Add more external services through MCP
- Add more complex multi-step agent workflows

---

# 📌 Project Status

**Status:** 🚧 Active development / learning project

The project is designed as a practical implementation of MCP concepts and is being extended with additional tools, integrations, and agent workflows.

---

# 👨‍💻 Author

## Tanishq Jaiswal

Software Developer / AI Engineer focused on:

- Full-Stack Development
- LLM Applications
- RAG
- Agentic AI
- AI Tool Calling
- MCP
- AI-powered Developer Tools

GitHub:

https://github.com/devtanishq-tech

---

# 📄 License

This project is currently intended as a personal learning and portfolio project.
