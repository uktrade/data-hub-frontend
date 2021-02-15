const router = require('express').Router()

const {
  LARGE_INVESTMENT_PROFILE_QUERY,
  LARGE_INVESTMENT_PROFILE_QUERY_FIELDS,
  LARGE_INVESTMENT_PROFILE_QUERY_DATE,
} = require('./constants')

const { setDefaultQuery } = require('../middleware')

const { getRequestBody } = require('../../middleware/collection')
const { renderProfilesView } = require('./controllers/profiles')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

router.get('/', setInvestmentTabItems, renderProfilesView)

router.get(
  '/export',
  setDefaultQuery(LARGE_INVESTMENT_PROFILE_QUERY),
  getRequestBody(
    LARGE_INVESTMENT_PROFILE_QUERY_FIELDS,
    LARGE_INVESTMENT_PROFILE_QUERY_DATE
  ),
  exportCollection('large-investor-profile')
)

module.exports = router
