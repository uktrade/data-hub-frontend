const router = require('express').Router()
const { postcodeLookupHandler } = require('./api.controller')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)

module.exports = {
  path: '/api',
  router,
}
