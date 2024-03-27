/* eslint-disable */
require('dotenv').config()

module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('cypress-image-diff-js/plugin')
  getCompareSnapshotsPlugin(on, config)
  config.env.sandbox_url = process.env.API_ROOT
  return config
}
