const {
  resolve
} = require('../webpack.config')();

export default {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook'
  ],
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