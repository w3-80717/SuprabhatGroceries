// test-babel.js
const path = require('path');

try {
  // Dynamically require babel.config.js
  const babelConfigPath = path.resolve(__dirname, 'babel.config.js');
  const configFunction = require(babelConfigPath);

  // Call the function to get the actual config object
  const config = configFunction({ cache: () => {} });

  console.log('SUCCESS: babel.config.js loaded and parsed by Node.js successfully!');
  console.log('Config presets:', config.presets);
  console.log('Config plugins:', config.plugins);

  // Check if plugins is actually an array and contains nativewind/babel
  if (!Array.isArray(config.plugins)) {
    console.error('ERROR: config.plugins is NOT an array!');
  } else if (!config.plugins.includes('nativewind/babel')) {
    console.warn('WARNING: nativewind/babel is missing from plugins array.');
  }

} catch (e) {
  console.error('FAILURE: Could not load or parse babel.config.js with raw Node.js.');
  console.error('Error:', e);
  console.error('This indicates a syntax error, invisible character, or file encoding issue in babel.config.js.');
  console.error('Your babel.config.js content (for debugging purposes):');
  // Attempt to read the file content to help debug
  const fs = require('fs');
  try {
      const fileContent = fs.readFileSync(path.resolve(__dirname, 'babel.config.js'), 'utf8');
      console.error(fileContent);
  } catch (readError) {
      console.error('Could not read babel.config.js for content:', readError);
  }
}