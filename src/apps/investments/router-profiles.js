const router = require('express').Router()

const { DEFAULT_COLLECTION_QUERY, QUERY_FIELDS } = require('./constants')
const { renderProfilesView } = require('./controllers/profiles')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

const { getRequestBody } = require('../../middleware/collection')
const { detectUserAgent } = require('../../middleware/detect-useragent')
const { ENTITIES } = require('../search/constants')
const { getCollection, exportCollection } = require('../../modules/search/middleware/collection')
const { setDefaultQuery } = require('../middleware')
const { transformInvestmentProjectLargeProfilesToListItem } = require('./transformers')

router.get('/',
  detectUserAgent,
  getRequestBody(QUERY_FIELDS),
  getCollection('large-investor-profile', ENTITIES, transformInvestmentProjectLargeProfilesToListItem),
  setInvestmentTabItems, renderProfilesView)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('large-investor-profile'),
)

module.exports = router
