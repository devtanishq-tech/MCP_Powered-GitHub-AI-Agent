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
      description: "Get the authenticated user's GitHub profile.",
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
      description: `Get details for one GitHub repository. Requires the exact owner and repository name.`,
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
        "List open and closed issues for a GitHub repository. Requires the exact owner and repository name.",
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
        "Get details for one GitHub issue. Requires the exact owner, repository name, and issue number.",
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
        "Search for code or filenames inside one GitHub repository. Requires the exact owner, repository name, and search query.",
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
        "Create a GitHub issue. Use only when the user explicitly asks to create one. Requires exact owner, repository name, and title.",
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
