const { resolve } = require('../webpack.config')()

module.exports = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
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
    disableTelemetry: true,
  },
}
