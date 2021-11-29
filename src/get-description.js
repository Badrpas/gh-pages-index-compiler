const fs = require('fs').promises;
const path = require('path');

async function getDescriptionFromFile (filePath) {
  try {
    await fs.stat(filePath)

    return await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    return null;
  }
}


async function getDescription (dir) {
  const descriptionPath = path.join(dir, 'description.txt');
  const descriptionFromFile = await getDescriptionFromFile(descriptionPath);
  if (descriptionFromFile !== null) {
    return descriptionFromFile;
  }

  return '';
}


module.exports = getDescription;
