const fs = require('fs');

/**
 * Reads a file and parses it as JSON.
 * Returns null if the file does not exist or cannot be parsed.
 * @param {string} filePath 
 * @returns {any}
 */
function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read/parse JSON from ${filePath}:`, error);
    return null;
  }
}

module.exports = {
  readJson
};
