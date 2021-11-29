
function pick (obj, ...keys) {
  const entries = Object.entries(obj).filter(([key]) => keys.includes(key));
  return Object.fromEntries(entries);
}

module.exports = pick;
