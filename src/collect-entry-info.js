const path = require('path');
const getDescription = require('./get-description');
const getRepoInfoFromGithub = require('./gh-repo-info');
const getLastCommitDate = require('./get-last-commit-date');


module.exports = async indexPath => {
  const fileName = path.basename(indexPath);
  const dir = path.dirname(indexPath);

  return {
    indexPath,
    fileName,
    dir,
    description: await getDescription(dir),
    repo: await getRepoInfoFromGithub(indexPath),
    changedAt: await getLastCommitDate(indexPath),
  };
};
