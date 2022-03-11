const baseConfig = require('./webpack.config.js')
const nodeExternals = require('webpack-node-externals')

module.exports = (env) => ({
  ...baseConfig(env),
  target: 'node',
  externals: [nodeExternals()],
})
