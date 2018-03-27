const router = require('express').Router()

const {
  postcodeLookupHandler,
  getOptionsHandler,
  getAdviserOptionsHandler,
} = require('./controllers')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get('/options/:entity', getOptionsHandler, getAdviserOptionsHandler)

module.exports = router
