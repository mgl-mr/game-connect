module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/prefer-default-export': [
      // eslint-disable-next-line no-bitwise
      ('off' | 'warn' | 'error'),
      { target: 'single' },
    ],
    'import/named': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
