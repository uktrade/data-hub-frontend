const { resolve } = require('../webpack.config')()

module.exports = {
  stories: ['../src/**/*.stories.(js|jsx)$/'],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...resolve,
      },
    }
  },
}
