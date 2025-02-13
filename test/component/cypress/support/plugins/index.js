require('dotenv').config()
const loadWebpack = require('@cypress/react/plugins/load-webpack')

module.exports = (on, config) => {
  loadWebpack(on, config, { webpackFilename: './webpack.config.js' })
  return config
}
