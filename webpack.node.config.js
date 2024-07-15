const nodeExternals = require('webpack-node-externals')

const baseConfig = require('./webpack.config.js')

module.exports = {
  ...baseConfig,
  target: 'node',
  externals: [nodeExternals()],
}
