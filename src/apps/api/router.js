const router = require('express').Router()

const {
  postcodeLookupHandler,
  getOptionsHandler,
  getEntityOptionsHandler,
} = require('./controllers')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get('/options/:entity', getOptionsHandler, getEntityOptionsHandler)

module.exports = router
