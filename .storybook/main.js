const webpackConfig = require('../webpack.config').resolve

module.exports = {
  stories: ['../src/**/*.stories.(js|jsx)$/'],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...webpackConfig,
      },
    }
  },
}
