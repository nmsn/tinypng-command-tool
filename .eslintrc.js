module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'arrow-parens': 'off',
    'consistent-return': 'off',
    'object-curly-newline': 'off',
    radix: 0,
  },
};
