require('dotenv').config()

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message)
      return null
    },
  })

  config.env.sandbox_url = process.env.API_ROOT
  config.env.one_list_email = process.env.ONE_LIST_EMAIL

  return config
}
