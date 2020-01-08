const router = require('express').Router()

const {
  getPingdomFailures,
  getPingdomWarnings,
  getMicroserviceHealthcheck,
} = require('./controllers')

router.get('/', getMicroserviceHealthcheck)

router.get('/ping.xml', getPingdomFailures)

router.get('/warning/ping.xml', getPingdomWarnings)

module.exports = router
