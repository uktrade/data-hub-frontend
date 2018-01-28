const router = require('express').Router()

const { adviserSearchHandler } = require('./controllers/advisers')
const { postcodeLookupHandler } = require('./controllers/postcodes')
const { getOptionsHandler } = require('./controllers/options')

router.get('/adviserlookup/:term', adviserSearchHandler)
router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get('/options/:entity', getOptionsHandler)

module.exports = {
  mountpath: '/api',
  router,
}
