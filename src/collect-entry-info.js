const path = require('path');
const getDescription = require('./get-description');


module.exports = async indexPath => {
  const entry = {
    indexPath,
    fileName: path.basename(indexPath),
    dir: path.dirname(indexPath),
  };

  entry.description = (await getDescription(entry)) || '';

  return entry;
};
