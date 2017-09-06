const router = require('express').Router()
const { getHandler } = require('./controllers')

module.exports = {
  router: router.get('/healthcheck', getHandler),
  controllers: {
    getHandler,
  },
}
