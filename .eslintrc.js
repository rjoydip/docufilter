module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    project: ['./tsconfig.json', './packages/*/tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
      createClass: 'createElement',
      pragma: 'h'
    }
  },
  rules: {
    'no-console': 2,
    'no-unused-vars': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
