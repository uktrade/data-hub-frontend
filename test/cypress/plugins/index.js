/* eslint-disable */
require('dotenv').config()
const path = require("path");

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/react-scripts')(
      on,
      config,
      {webpackConfigPath: path.join(process.cwd(), 'webpack.config.js')}
    )

    return config
  }
  require('@cypress/code-coverage/task')(on, config)
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  on("task", { log(message) {
      console.log(message)
      return null
    },
  })
  config.env.sandbox_url = process.env.API_ROOT
  return config
}
