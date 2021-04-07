const router = require('express').Router()

const { renderOpportunitiesView } = require('./controllers/opportunities')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get(
  '/:opportunityId/details',
  setInvestmentTabItems,
  renderOpportunitiesView
)

router.get('/create', (req, res) => {
  const heading = 'Create UK investment opportumity'
  res
    .breadcrumb(heading)
    .render('investments/views/create/uk-investment-opportunity', {
      heading,
    })
})

module.exports = router
