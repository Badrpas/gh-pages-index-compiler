const createGitInterface = require('simple-git');
const github = require('@actions/github');
const core = require('@actions/core');
const pick = require('./pick');


const githubToken = core.getInput('token');
const octokit = githubToken ? github.getOctokit(githubToken) : null;
const git = createGitInterface();


async function getRepoInfoFromGithub (filePath) {
  if (!octokit) {
    console.log(`No GitHub token provided`);
    return null;
  }

  console.log('Trying to get GitHub description for', filePath);

  const log = await git.log({
    maxCount: 1,
    format: {
      msg: '%s'
    },
    file: filePath,
  });

  const { latest: { msg } } = log;

  const match = /deploy: ([\w\d-_]+)\/([\w\d-_]+)@[\d\w]+/.exec(msg);
  if (!match) {
    console.log(`Couldn't find a deploy commit message`);
    return null;
  }

  const [, owner, repo] = match;
  console.log('owner, repo:', owner, repo);
  const resp = await octokit.request('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  });

  return pick(resp.data, 'description', 'name', 'full_name', 'url');
}

module.exports = getRepoInfoFromGithub;
