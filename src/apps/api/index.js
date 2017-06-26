const router = require('express').Router()
const { postcodeLookupHandler } = require('./controllers')

module.exports = {
  mountpath: '/api',
  router: router.get('/postcodelookup/:postcode', postcodeLookupHandler),
}
