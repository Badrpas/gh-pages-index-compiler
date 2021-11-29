const createGitInterface = require('simple-git');

const git = createGitInterface();


async function getLastCommitDate (filePath) {
  const log = await git.log({
    maxCount: 1,
    format: {
      dateStr: '%cd',
    },
    file: filePath,
  });

  const { latest: { dateStr } } = log;

  return new Date(dateStr).toISOString();
}

module.exports = getLastCommitDate;
