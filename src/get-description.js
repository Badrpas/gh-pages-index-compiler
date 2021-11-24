const createGitInterface = require('simple-git');
const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

const githubToken = core.getInput('token');
const octokit = githubToken ? github.getOctokit(githubToken) : null;

const git = createGitInterface();

async function getDescriptionFromFile (filePath) {
  try {
    await fs.stat(filePath)

    return await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    return null;
  }
}

async function getDescriptionFromGithub (filePath) {
  if (!octokit) {
    console.log(`No GitHub token provided`);
    return;
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
  if (match) {
    const [, owner, repo] = match;
    console.log('owner, repo:', owner, repo);
    const resp = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });

    return resp.data.description;
  }
}

async function getDescription (entry) {
  const descriptionPath = path.join(entry.dir, 'description.txt');
  const descriptionFromFile = await getDescriptionFromFile(descriptionPath);
  if (descriptionFromFile !== null) {
    return descriptionFromFile;
  }

  return getDescriptionFromGithub(entry.indexPath);
}


module.exports = getDescription;
