import { cachedDataVersionTag } from "node:v8";
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
      state: "all",
      per_page: 10,
    });
    console.log(`----list issue data `);
    for (let current of response.data) {
      console.log(current);
    }
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Some error occur at listIsuses function");
    console.log(err);
  }
}
// 5. Get issue
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

  return response.data;
}

// 6. Search code
export async function searchCode(query: string) {
  const response = await github.rest.search.code({
    q: query,
  });

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
listIssues("devtanishq-tech", "mcp-application");
