const router = require('express').Router()

const { renderPingdomXml, getHandler } = require('./controllers')

router.get('/', getHandler)

router.get('/ping.xml', renderPingdomXml)

module.exports = router
