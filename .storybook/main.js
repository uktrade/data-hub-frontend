//I'm just checking the Cypress integration. I won't merge this...
//I'm just checking the Cypress integration. I won't merge this...

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
