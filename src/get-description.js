const createGitInterface = require('simple-git');
const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs').promises;


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

  const { latest: { msg } } = await git.log({
    maxCount: 1,
    format: {
      msg: '%s'
    },
    file: filePath,
  });

  console.log('msg:', msg);

  const match = /deploy: ([\w\d-_]+)\/([\w\d-_]+)@[\d\w]+/.exec(msg);
  if (match) {
    const [, owner, repo] = match;
    console.log('owner, repo:', owner, repo);
    const repoInfo = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });

    console.log('repoInfo:', repoInfo);
    return repoInfo.description;
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