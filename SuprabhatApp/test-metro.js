// test-metro.js
const path = require('path');

try {
  const metroConfigPath = path.resolve(__dirname, 'metro.config.js');
  const metroConfig = require(metroConfigPath); // Directly attempt to require it

  console.log('SUCCESS: metro.config.js loaded and parsed by Node.js successfully!');
  // Optionally, you can try to call it if it's a function, but just loading is enough for this error
  // if (typeof metroConfig === 'function') {
  //   const resolvedConfig = metroConfig(require('metro-config').getDefaultConfig(__dirname));
  //   console.log('Resolved config keys:', Object.keys(resolvedConfig));
  // } else {
  //   console.log('Loaded config object keys:', Object.keys(metroConfig));
  // }

} catch (e) {
  console.error('FAILURE: Could not load or parse metro.config.js with raw Node.js.');
  console.error('Error:', e);
  console.error('This indicates a syntax error, invisible character, or file encoding issue in metro.config.js.');
  // Attempt to read the file content to help debug
  const fs = require('fs');
  try {
      const fileContent = fs.readFileSync(path.resolve(__dirname, 'metro.config.js'), 'utf8');
      console.error('\n--- Content of metro.config.js ---\n', fileContent);
      console.error('\n----------------------------------\n');
  } catch (readError) {
      console.error('Could not read metro.config.js for content:', readError);
  }
}