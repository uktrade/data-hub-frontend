const router = require('express').Router()

const { postcodeLookupHandler } = require('./controllers')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)

module.exports = router
