const { resolve } = require('../webpack.config')()

module.exports = {
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
