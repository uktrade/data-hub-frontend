const router = require('express').Router()

const { getHandler } = require('./pingdom.controller')

router.get('/ping.xml', getHandler)

module.exports = {
  router,
}
