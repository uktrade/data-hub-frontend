const { resolve } = require('../webpack.config')()

module.exports = {
  stories: ['../src/**/*.stories.(js|jsx)$/'],
  addons: ['@storybook/addon-a11y'],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...resolve,
      },
    }
  },
}
