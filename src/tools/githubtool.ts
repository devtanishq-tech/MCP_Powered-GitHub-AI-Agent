import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  getUserProfile,
  githubListRepo,
  getRepo,
  listIssues,
  getIssue,
  searchCode,
  createIssue,
} from "../services/github";
export function registerGithubTools(server: McpServer) {
  server.registerTool(
    "github_get_my_profile",
    {
      title: "Github User Profile Tool",
      description: `user this tool ,whenever user query is about
        user profile from github 
        
        `,
    },
    async () => {
      const userData = await getUserProfile();
      console.log(`0---------------------------------------------------`);
      console.log(userData);
      console.log(`0---------------------------------------------------`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(userData),
          },
        ],
      };
    },
  );
  server.registerTool(
    "github_list_repos",
    {
      title: "List GitHub Repositories",
      description: `Use this tool to list all of the authenticated user's GitHub repositories, 
            including each repo's exact name, description, tech stack (language field), 
            stars, forks, and last update time. Call this tool FIRST whenever the user 
            refers to a repository by a vague or descriptive name (e.g. 'my trading 
            platform app', 'the app I built for X') instead of its exact GitHub repo 
            name. Use the returned list to match the user's description against repo 
            names/descriptions, then pass the matched repo's exact name (and owner, 
            from its fullName field) to github_get_repo for full details.`,
    },
    async () => {
      const listrepoData = await githubListRepo();
      console.log(`---------------------------`);
      console.log(listrepoData);
      console.log(`---------------------------`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(listrepoData),
          },
        ],
      };
    },
  );
  server.registerTool(
    "github_get_repo",
    {
      title: "Get GitHub Repository Details",
      description: `Use this tool when you already know the EXACT owner and repo name, and 
        need full details about that one repository — including tech stack 
        (language), description, stars, forks, topics, and timestamps. Requires 
        exact owner and repo name — never guess these values. If you don't 
        already know the exact owner/repo (e.g. the user described the repo 
        vaguely instead of naming it), call github_list_repos first to find the 
        matching repository, then call this tool with the exact values from 
        that result.`,
      inputSchema: z.object({
        owner: z
          .string()
          .describe(
            "The GitHub username or organization that owns the repository.",
          ),
        repo: z.string().describe("The exact GitHub repository name."),
      }),
    },
    async ({ owner, repo }) => {
      const repoData = await getRepo(owner, repo);
      console.log(`--------------------------------------`);
      console.log(repoData);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(repoData),
          },
        ],
      };
    },
  );
  //===============================================///

  server.registerTool(
    "github_list_issues",
    {
      title: "List GitHub Issues",
      description:
        "Use this tool to list issues (both open and closed) for a specific GitHub repository. Returns up to 10 issues with issue number, title, state, author, body, comment count, labels, and timestamps. Requires exact owner and repo name — never guess these. If the user refers to the repo by a vague or descriptive name instead of its exact name, call github_list_repos first to find the matching repository, then use its exact owner/name here. Use this tool when the user asks to see issues in general, or when you need to find a specific issue's number before calling github_get_issue.",
      inputSchema: z.object({
        owner: z
          .string()
          .describe(
            "The GitHub username or organization that owns the repository.",
          ),
        repo: z.string().describe("The exact GitHub repository name."),
      }),
    },
    async ({ owner, repo }) => {
      const issuesData = await listIssues(owner, repo);
      return {
        content: [{ type: "text", text: JSON.stringify(issuesData) }],
      };
    },
  );

  server.registerTool(
    "github_get_issue",
    {
      title: "Get GitHub Issue Details",
      description:
        "Use this tool when the user asks for full details about ONE specific issue and you already know its exact issue number. Returns the issue's full body, author, comments, labels, and timestamps. Requires exact owner, repo, and issueNumber — never guess these. If you don't already know the exact issue number (e.g. the user described the issue by topic instead of number), call github_list_issues first to find the matching issue, then use its issue_number here. If you don't know the exact owner/repo either, call github_list_repos first.",
      inputSchema: z.object({
        owner: z
          .string()
          .describe(
            "The GitHub username or organization that owns the repository.",
          ),
        repo: z.string().describe("The exact GitHub repository name."),
        issueNumber: z
          .number()
          .describe(
            "The exact issue number, found from github_list_issues if not already known.",
          ),
      }),
    },
    async ({ owner, repo, issueNumber }) => {
      const issueData = await getIssue(owner, repo, issueNumber);
      return {
        content: [{ type: "text", text: JSON.stringify(issueData) }],
      };
    },
  );

  server.registerTool(
    "github_search_code",
    {
      title: "Search Code in GitHub Repository",
      description:
        "Use this tool to search for specific code, function names, filenames, or text content WITHIN one specific GitHub repository. Returns matching file names, paths, and links. Requires exact owner and repo name — never guess these. If the user refers to the repo by a vague or descriptive name (e.g. 'my trading app', 'the bot I built') instead of its exact name, call github_list_repos first to find the matching repository, then use its exact owner/name here. Only use this tool when the user wants to find something INSIDE a repo's code — not for repo metadata like tech stack (use github_get_repo or github_list_repos for that) and not for issues (use github_list_issues/github_get_issue for that).",
      inputSchema: z.object({
        owner: z
          .string()
          .describe(
            "The GitHub username or organization that owns the repository.",
          ),
        repo: z.string().describe("The exact GitHub repository name."),
        query: z
          .string()
          .describe(
            "The code, keyword, filename, or text to search for inside the repository.",
          ),
      }),
    },
    async ({ owner, repo, query }) => {
      const searchData = await searchCode(owner, repo, query);
      return {
        content: [{ type: "text", text: JSON.stringify(searchData) }],
      };
    },
  );

  server.registerTool(
    "github_create_issue",
    {
      title: "Create GitHub Issue",
      description:
        "Use this tool ONLY when the user explicitly asks to create, file, open, or report a new issue on a GitHub repository — this is a write action that creates real, visible data on GitHub, not a read/lookup action. Requires exact owner, repo, and a title (body is optional). Never guess owner/repo — if the user refers to the repo by a vague or descriptive name, call github_list_repos first to find the matching repository, then use its exact owner/name here. Do not call this tool speculatively or to answer informational questions.",
      inputSchema: z.object({
        owner: z
          .string()
          .describe(
            "The GitHub username or organization that owns the repository.",
          ),
        repo: z.string().describe("The exact GitHub repository name."),
        title: z.string().describe("The title of the issue to create."),
        body: z
          .string()
          .optional()
          .describe("Optional description/body content for the issue."),
      }),
    },
    async ({ owner, repo, title, body }) => {
      const issueData = await createIssue(owner, repo, title, body);
      return {
        content: [{ type: "text", text: JSON.stringify(issueData) }],
      };
    },
  );
}
