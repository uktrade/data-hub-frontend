const router = require('express').Router()

const {
  postcodeLookupHandler,
  postcodeToRegionLookupHandler,
  getOptionsHandler,
  getAdviserOptionsHandler,
} = require('./controllers')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get(
  '/postcode-to-region-lookup/:postcode',
  postcodeToRegionLookupHandler
)
router.get('/options/:entity', getOptionsHandler, getAdviserOptionsHandler)

module.exports = router
