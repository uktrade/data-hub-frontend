const router = require('express').Router()

const { adviserOptionsHandler } = require('./controllers/advisers')
const { postcodeLookupHandler } = require('./controllers/postcodes')
const { getOptionsHandler } = require('./controllers/options')

router.get('/postcodelookup/:postcode', postcodeLookupHandler)
router.get('/options/:entity', getOptionsHandler, adviserOptionsHandler)

module.exports = {
  mountpath: '/api',
  router,
}
