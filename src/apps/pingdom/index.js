const router = require('express').Router()
const { getHandler } = require('./controllers')

module.exports = {
  router: router.get('/ping.xml', getHandler),
  controllers: {
    getHandler,
  },
}
