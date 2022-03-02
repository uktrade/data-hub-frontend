/* eslint-disable */
require('dotenv').config()

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/load-webpack')(on, config, { webpackFilename: './webpack.config.js' })

    return config
  }
  require('@cypress/code-coverage/task')(on, config)
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  on("task", {
    log(message) {
      console.log(message)
      return null
    },
  })

  config.env.sandbox_url = process.env.API_ROOT
  config.env.one_list_email = process.env.ONE_LIST_EMAIL

  return config
}