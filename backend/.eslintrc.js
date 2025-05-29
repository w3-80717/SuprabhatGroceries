module.exports = {
  // Specifies the ESLint parser for TypeScript
  parser: '@typescript-eslint/parser',
  // Specifies the ESLint parser options
  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json', // Important: Path to your tsconfig.json for type-aware linting rules
  },
  // Specifies the ESLint plugins
  plugins: [
    '@typescript-eslint', // For TypeScript-specific linting rules
    'prettier', // For Prettier integration
    // Add other plugins as needed, e.g., 'jest' if you use Jest for testing
  ],
  // Specifies the ESLint environments
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping.
    es2021: true, // Enables ES2021 globals.
    // jest: true, // Add this if you use Jest for testing
  },
  // Specifies the ESLint extended configurations
  // Order matters: Prettier should be last to override other formatting rules.
  extends: [
    'eslint:recommended', // ESLint's recommended rules
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Additional type-aware rules (optional, but powerful)
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  // Specifies the ESLint rules
  rules: {
    // --- Prettier ---
    'prettier/prettier': [
      'warn', // Or 'error' to fail on Prettier issues
      {
        // Your Prettier options from .prettierrc.js can go here or be inferred
        // e.g., endOfLine: 'auto',
      },
    ],

    // --- TypeScript specific ---
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // Preference: Can be 'warn' or 'error' if you prefer explicit return types
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Preference: Can be 'warn' or 'error'
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about using 'any'
    '@typescript-eslint/no-floating-promises': 'error', // Requires handling for Promises that are not awaited
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false, // Allow promises in void contexts (e.g. event handlers) if you need
      },
    ],

    // --- General ESLint ---
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Disallow console.log in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'eqeqeq': ['error', 'always'], // Require === and !==
    'curly': ['error', 'all'], // Require curly braces for all control statements

    // You can add more specific rules or override defaults here.
    // For example:
    // 'indent': ['error', 2], // If not using Prettier for indentation
    // 'quotes': ['error', 'single'], // If not using Prettier for quotes
  },
  // Specifies files/folders to be ignored by ESLint (can also use .eslintignore)
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '.eslintrc.js', // Don't lint this file itself with project-based rules
    '**/migrations/*.js', // Example: ignore JS files in migrations if they are auto-generated
    '**/seeders/*.js',    // Example: ignore JS files in seeders
  ],
};