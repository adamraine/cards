/** @type {import('eslint').Linter.BaseConfig} */
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
    'no-console': 2,
    'react/prop-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'eqeqeq': 2,
    'indent': [2, 2],
    'no-empty': 1,
    'no-implicit-coercion': 2,
    'no-unused-expressions': 1,
    'no-unused-vars': 2,
    'space-infix-ops': 1,
    'prefer-const': 2,
    'curly': [1, 'multi-line'],
    'semi': 1,
    'comma-dangle': [1, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    'object-curly-spacing': 1,
    'sort-imports': [1, {
      ignoreCase: true,
    }],
  }
};
