const router = require('express').Router()

const { renderPingdomXml, renderPingdomWarningXml, getMicroserviceHealthcheck } = require('./controllers')

router.get('/', getMicroserviceHealthcheck)

router.get('/ping.xml', renderPingdomXml)

router.get('/warning/ping.xml', renderPingdomWarningXml)

module.exports = router
