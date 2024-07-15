const config = require('./src/config')

module.exports = {
  sourceType: 'unambiguous',
  plugins: [
    ...(config.isDev ? ['react-refresh/babel'] : []),
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
