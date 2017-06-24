const router = require('./router')
const { getHandler } = require('./pingdom.controller')

module.exports = {
  router,
  controllers: {
    getHandler,
  },
}
