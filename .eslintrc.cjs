module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-await-in-loop': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
    'no-underscore-dangle': 0,
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
  },
};
