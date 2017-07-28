const router = require('express').Router()
const { adviserSearchHandler, postcodeLookupHandler } = require('./controllers')

router.get('/adviserlookup/:term', adviserSearchHandler)
router.get('/postcodelookup/:postcode', postcodeLookupHandler)

module.exports = {
  mountpath: '/api',
  router,
}
