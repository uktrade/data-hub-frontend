const {
  resolve
} = require('../webpack.config')();
module.exports = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  webpackFinal: async config => {
    return {
      ...config,
      resolve: {
        ...resolve
      }
    }
  },
  core: {
    disableTelemetry: true
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: true
  },
  stories: ['../src/client/components/*/__stories__/*.stories.jsx', '../src/client/components/*/*/__stories__/*.stories.jsx'],
}