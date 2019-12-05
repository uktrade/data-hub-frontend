const router = require('express').Router()

const { renderPingdomXml, getMicroserviceHealthcheck } = require('./controllers')

router.get('/', getMicroserviceHealthcheck)

router.get('/ping.xml', renderPingdomXml)

module.exports = router
