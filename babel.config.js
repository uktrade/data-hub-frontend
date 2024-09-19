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
