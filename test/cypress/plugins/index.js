/* eslint-disable */
require('dotenv').config()

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/react-scripts')(on, config)

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
