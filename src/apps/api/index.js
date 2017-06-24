const router = require('./router')
const apiController = require('./api.controller')

module.exports = {
  router,
  controllers: {
    api: apiController,
  },
}
