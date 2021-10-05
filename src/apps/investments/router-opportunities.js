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
  renderOpportunitiesView,
  renderOpportunityView,
} = require('./controllers/opportunities')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get('/', setInvestmentTabItems, renderOpportunitiesView)

router.get(
  // These paths are handled by react-router
  ['/:opportunityId/details', '/:opportunityId/interactions'],
  renderOpportunityView
)

router.get('/create', (req, res) => {
  const heading = 'Create UK investment opportunity'
  res
    .breadcrumb(heading)
    .render('investments/views/create/uk-investment-opportunity', {
      heading,
    })
})

router.get(
  '/export',
  getRequestBody(
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE
  ),
  exportCollection('large-capital-opportunity')
)

module.exports = router
