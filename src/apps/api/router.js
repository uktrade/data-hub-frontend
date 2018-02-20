const router = require('express').Router()

const { postcodeLookupHandler } = require('./controllers')
const { getOptionsHandler } = require('./controllers')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get('/options/:entity', getOptionsHandler)

module.exports = router
