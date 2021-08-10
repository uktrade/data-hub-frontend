const { resolve } = require('../webpack.config')()

module.exports = {
  addons: [
    'storybook-readme',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
  ],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...resolve,
      },
    }
  },
}
