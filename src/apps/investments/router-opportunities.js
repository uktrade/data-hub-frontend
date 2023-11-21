const router = require('express').Router()

const {
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')

const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const {
  renderOpportunityView,
  renderOpportunityStatusView,
} = require('./controllers/opportunities')

router.get(
  // These paths are handled by react-router
  ['/:opportunityId/details', '/:opportunityId/interactions'],
  renderOpportunityView
)

router.get('/:opportunityId/status', renderOpportunityStatusView)

router.get(
  '/export',
  getRequestBody(
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE
  ),
  exportCollection('large-capital-opportunity')
)

module.exports = router
