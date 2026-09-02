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
    per_page: 10,
  });
  console.log(repodata.data);
  const listrepo=
  return repodata.data;
}
githubListRepo();
