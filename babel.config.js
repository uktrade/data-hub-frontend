module.exports = {
  sourceType: 'unambiguous',
  env: {
    test: {
      plugins: ['istanbul'],
    },
    development: {
      plugins: ['istanbul'],
    },
  },
  presets: [
    ['@babel/preset-react'],
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
