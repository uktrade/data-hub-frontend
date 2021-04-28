const router = require('express').Router()

const {
  renderOpportunitiesView,
  renderOpportunityDetailsView,
} = require('./controllers/opportunities')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get('/', setInvestmentTabItems, renderOpportunitiesView)

router.get(
  '/:opportunityId/details',
  setInvestmentTabItems,
  renderOpportunityDetailsView
)

router.get('/create', (req, res) => {
  const heading = 'Create UK investment opportunity'
  res
    .breadcrumb(heading)
    .render('investments/views/create/uk-investment-opportunity', {
      heading,
    })
})

module.exports = router
