const { resolve } = require('../webpack.config')()

module.exports = {
  addons: [
    'storybook-readme',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
  ],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...resolve,
      },
    }
  },
  core: {
    builder: 'webpack5',
  },
}
