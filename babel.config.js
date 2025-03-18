const config = require('./src/config')

// The react-refresh plugin breaks storybook so we have to exclude it
const isStorybook = process.env.npm_lifecycle_event === 'storybook'
const includeReactRefresh = config.isDev && !isStorybook

module.exports = {
  sourceType: 'unambiguous',
  plugins: [
    ...(includeReactRefresh ? ['react-refresh/babel'] : []),
    '@babel/plugin-syntax-import-assertions',
  ],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
  // Check if this can be removed when upgrading to Babel version 8.
  // https://babeljs.io/docs/babel-plugin-syntax-import-attributes
  generatorOpts: { importAttributesKeyword: 'with' },
  presets: [
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: ['last 2 versions'],
        },
      },
    ],
  ],
}
