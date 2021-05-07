module.exports = {
  settings: {
    react: {
      version: 'detect',
    }
  },
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react',
    'jest',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
  }
};
