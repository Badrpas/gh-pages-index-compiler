const core = require('@actions/core');
const glob = require('util').promisify(require('glob'));
const collectEntryInfo = require('./collect-entry-info');

async function main () {
  try {
    const outFileName = core.getInput('out');
    const entries = [];

    const indexHtmlFiles = await glob('**/index.html');

    for (let filePath of indexHtmlFiles) {
      const entry = await collectEntryInfo(filePath);
      entries.push(entry);
    }

    const encoded = JSON.stringify(entries, null, 2);
    console.log(encoded);
    await fs.writeFile(outFileName, encoded, 'utf-8');
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }

}

main();
