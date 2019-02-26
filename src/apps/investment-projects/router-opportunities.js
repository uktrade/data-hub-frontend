const setInvestmentTabItems = require('./middleware/investments-tab-items')
const { renderOpportunitiesView } = require('./controllers/opportunities')

const router = require('express').Router()

router.get('/', setInvestmentTabItems, renderOpportunitiesView)

module.exports = router
