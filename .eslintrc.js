module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'sonarjs'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:sonarjs/recommended-legacy', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'sonarjs/no-hardcoded-credentials': 'off',
    'no-restricted-syntax': 'off',
    'sonarjs/cognitive-complexity': ['error', 25],
    'sonarjs/no-empty-collection': 'off',
    'import/no-cycle': 'off',
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
