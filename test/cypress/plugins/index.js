/* eslint-disable */
require('dotenv').config()

module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'))
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  config.env.sandbox_url = process.env.API_ROOT
  return config
}
