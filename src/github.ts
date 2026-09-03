import { Octokit } from "octokit";
const token = process.env.GITHUB_ACCESS_TOKEN;
if (!token) {
  throw new Error("GITHUB_TOKEN is missing from .env");
}
export const github = new Octokit({
  auth: token,
});
export async function getUserProfile() {
  const response = await github.rest.users.getAuthenticated();
  console.log(`get user Porfile data`);
  console.log(response.data);
  console.log(`------------------------------`);
  const userData = {
    id: response.data.id,
    username: response.data.login,
    name: response.data.name,
    githubUrl: response.data.html_url,
    avatarUrl: response.data.avatar_url,
    publicRepo: response.data.public_repos,
    followers: response.data.followers,
    following: response.data.following,
  };
  console.log(userData);
  return userData;
}
async function githubListRepo() {
  const repodata = await github.rest.repos.listForAuthenticatedUser({
    per_page: 20,
  });
  const listrepo = repodata.data.map((repo) => {
    return {
      name: repo.name,
      livelink: repo.homepage,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      private: repo.private,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      defaultBranch: repo.default_branch,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
    };
  });
  for (let current of listrepo) {
    console.log(current);
  }
  return listrepo;
}
async function getRepo(owner: string, repo: string) {
  const repoo = await github.rest.repos.get({ owner, repo });
  console.log("-------------------------------");
  return {
    id: repoo.data.id,
    name: repoo.data.name,
    fullName: repoo.data.full_name,
    url: repoo.data.html_url,
    livelink: repoo.data.homepage,
    cloneUrl: repoo.data.clone_url,
    description: repoo.data.description,
    private: repoo.data.private,
    visibility: repoo.data.visibility,
    language: repoo.data.language,
    stars: repoo.data.stargazers_count,
    forks: repoo.data.forks_count,
    watchers: repoo.data.watchers_count,
    openIssues: repoo.data.open_issues_count,
    defaultBranch: repoo.data.default_branch,
    createdAt: repoo.data.created_at,
    updatedAt: repoo.data.updated_at,
    pushedAt: repoo.data.pushed_at,
    archived: repoo.data.archived,
    topics: repoo.data.topics,
  };
}
// make sure inside the getRepo , argument  must be stricty correct

//==================================================================================//
async function listIssues(owner: string, repo: string) {
  try {
    const response = await github.rest.issues.listForRepo({
      owner,
      repo,
      state: "all", // it means i want both open and close issue
      per_page: 10,
    });
    console.log(`--------------------------------------------------------`);
    console.log(response.data);
    console.log(`-------------------------------------------------------`);
    console.log(response.data.length);
    return response.data.map((issue) => ({
      IssueNumber: issue.number,
      title: issue.title,
      state: issue.state,
      ownerName: issue.user?.login,
      ownerGithubProfile: issue.html_url,
      IssueMainContent: issue.body,
      comments: issue.comments,
      labels: issue.labels.map((label) =>
        typeof label === "string" ? label : label.name,
      ),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }));
  } catch (err) {
    console.error("Some error occur at listIsuses function");
    console.log(err);
  }
}
// 5. Get issue, used to find the one specific issue , suppose want the issue one , based on that it return the content  of that data
export async function getIssue(
  owner: string,
  repo: string,
  issueNumber: number,
) {
  const response = await github.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });
  const issue = response.data;
  return {
    number: issue.number,
    title: issue.title,
    state: issue.state,
    author: issue.user?.login,
    body: issue.body,
    url: issue.html_url,
    comments: issue.comments,
    labels: issue.labels.map((label) =>
      typeof label === "string" ? label : label.name,
    ),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,
  };
}
// 6. Search code inside one repository.
export async function searchCode(owner: string, repo: string, query: string) {
  // The code-search endpoint scopes results through the `repo:` qualifier.
  // `owner` and `repo` are not endpoint parameters, so passing them as fields
  // does not restrict the search.
  const response = await github.rest.search.code({
    q: `${query} repo:${owner}/${repo}`,
  });
  console.log(response.data);
  return response.data;
}

// 7. List pull requests
export async function listPullRequests(owner: string, repo: string) {
  const response = await github.rest.pulls.list({
    owner,
    repo,
  });

  return response.data;
}

// 8. Create issue
export async function createIssue(
  owner: string,
  repo: string,
  title: string,
  body?: string,
) {
  const response = await github.rest.issues.create({
    owner,
    repo,
    title,
    body,
  });

  return response.data;
}
// Call searchCode(...) from the application instead of running a request when
// this module is imported.
// searchCode("devtanishq-tech", "mcp-application", "github");
searchCode("devtanishq-tech", "mcp-application", "listIssues");
