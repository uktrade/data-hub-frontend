const router = require('./router')
const accountController = require('./account.controller')

module.exports = {
  router,
  controllers: {
    account: accountController,
  },
}
